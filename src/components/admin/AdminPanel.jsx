import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import Navbar from "../layout/Navbar";
import TaskCard from "../dashboard/TaskCard";
import TaskModal from "../dashboard/TaskModal";
import useCurrentUser from "../../utils/useCurrentUser";

export default function AdminDashboard() {
  const { user, loading } = useCurrentUser();
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  // Load all tasks
  const loadTasks = async () => {
    try {
      const res = await api.get("tasks/"); // backend returns all tasks for admin
      setTasks(res.data);
    } catch (e) {
      console.error("Error loading tasks:", e.response?.data || e);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") loadTasks();
  }, [user]);

  // Create or update task
  const createOrSave = async (payload) => {
    setSaving(true);
    try {
      if (editing?.id) {
        await api.patch(`tasks/${editing.id}/`, payload);
        setTasks((prev) =>
          prev.map((t) => (t.id === editing.id ? { ...t, ...payload } : t))
        );
      } else {
        const res = await api.post("tasks/", payload);
        setTasks((prev) => [...prev, res.data]);
      }
      setOpen(false);
      setEditing(null);
    } catch (e) {
      console.error("Error saving task:", e.response?.data || e);
      alert("Failed to save task");
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (id) => {
    try {
      const res = await api.post(`tasks/${id}/toggle/`);
      setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
    } catch (e) {
      console.error("Error toggling task:", e.response?.data || e);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this task?")) return;
    try {
      await api.delete(`tasks/${id}/`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      console.error("Error deleting task:", e.response?.data || e);
      alert("Failed to delete task");
    }
  };

  const startEdit = (task) => {
    setEditing(task);
    setOpen(true);
  };

  if (loading) return <div>Loading...</div>;
  if (!user || user.role !== "admin")
    return <div>Access denied. Admins only.</div>;

  return (
    <>
      <Navbar user={user} />

      <div className="container mx-auto mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Admin Dashboard - All Tasks</h2>
          <button
            className="btn bg-sky-600 text-white"
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            New Task
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {tasks.length === 0 && <p>No tasks yet</p>}
          {tasks.map((t) => (
            <TaskCard
              key={t.id}
              t={t}
              onToggle={toggle}
              onDelete={remove} // admin can delete
              onEdit={startEdit} // admin can edit
              currentUser={user}
            />
          ))}
        </div>
      </div>

      <TaskModal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        initial={editing || {}}
        onSave={createOrSave}
        loading={saving}
      />
    </>
  );
}
