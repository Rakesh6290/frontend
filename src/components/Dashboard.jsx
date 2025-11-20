import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { Modal } from "bootstrap";
import "./Dashboard.css"; 

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [newTask, setNewTask] = useState({ title: "", description: "", completed: false });
  
  const navigate = useNavigate();

  const load = async () => {
    try {
      const res = await axios.get("/tasks/");
      setTasks(res.data);
      setFiltered(res.data);
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) navigate("/login");
    else load();
  }, []);

  useEffect(() => {
    let list = [...tasks];
    if (search.trim()) list = list.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
    if (filter === "completed") list = list.filter(t => t.completed);
    if (filter === "pending") list = list.filter(t => !t.completed);
    setFiltered(list);
  }, [search, filter, tasks]);

  const createTask = async () => {
    if (!newTask.title.trim()) return alert("Title required");
    try {
      await axios.post("/tasks/", newTask);
      await load();
      const modalEl = document.getElementById("addTaskModal");
      const modal = Modal.getInstance(modalEl) || new Modal(modalEl);
      modal.hide();
      setNewTask({ title: "", description: "", completed: false });
    } catch (err) {
      alert(JSON.stringify(err.response?.data || err.message));
    }
  };

  const toggle = async (id) => { await axios.post(`/tasks/${id}/toggle/`); load(); };
  const remove = async (id) => { if (window.confirm("Delete task?")) { await axios.delete(`/tasks/${id}/`); load(); } };
  const logout = () => { localStorage.clear(); navigate("/login"); };

  return (
    <div className="dashboard-container">

      {/* Navbar */}
      <nav className="navbar-main">
        <h3 className="navbar-title">Task Manager</h3>
        <button className="btn-logout" onClick={logout}>Logout</button>
      </nav>

      <div className="dashboard-main container">

        {/* Search + Add Task + Filter */}
        <div className="search-card">
          <div className="search-add">
            <input
              className="search-input"
              placeholder=" Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="btn-add"
              data-bs-toggle="modal"
              data-bs-target="#addTaskModal"
            >
              + Add Task
            </button>
          </div>
          <select
            className="filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Tasks</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Task Cards */}
        <div className="row g-4">
          {filtered.length === 0 && <p className="text-muted text-center">No tasks found.</p>}
          {filtered.map((t) => (
            <div key={t.id} className="col-md-6 col-lg-4">
              <div className="task-card">
                {t.completed && <span className="badge-done">Done</span>}
                <h5 className="task-title">{t.title}</h5>
                <p className="task-desc">{t.description}</p>
                <div className="task-info"><b>Owner:</b> {t.owner}</div>
                <div className="task-info"><b>Created:</b> {new Date(t.created_at).toLocaleString()}</div>
                <div className="task-info mb-2"><b>Updated:</b> {new Date(t.updated_at).toLocaleString()}</div>

                <div className="d-flex justify-content-between">
                  <button
                    className={`btn-action ${t.completed ? "btn-secondary" : "btn-success"}`}
                    onClick={() => toggle(t.id)}
                  >
                    {t.completed ? "Undo" : "Complete"}
                  </button>
                  <button className="btn-action btn-danger" onClick={() => remove(t.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Task Modal */}
      <div className="modal fade" id="addTaskModal" tabIndex="-1" aria-hidden="true">
  <div className="modal-dialog modal-md">
    <div className="modal-content modal-create-task">
      
      <div className="modal-header">
        <h5 className="modal-title fw-bold">Create New Task</h5>
        <button className="btn-close" data-bs-dismiss="modal"></button>
      </div>

      <div className="modal-body">
        <div className="form-group">
          <label className="fw-semibold">Title</label>
          <input
            type="text"
            className="modal-input"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="Enter task title"
          />
        </div>

        <div className="form-group">
          <label className="fw-semibold">Description</label>
          <textarea
            className="modal-input"
            rows="4"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            placeholder="Enter task description"
          ></textarea>
        </div>

        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            checked={newTask.completed}
            onChange={(e) => setNewTask({ ...newTask, completed: e.target.checked })}
            id="markCompleted"
          />
          <label className="form-check-label" htmlFor="markCompleted">
            Mark as Completed
          </label>
        </div>
      </div>

      <div className="modal-footer justify-content-between">
        <button className="btn-cancel" data-bs-dismiss="modal">Cancel</button>
        <button className="btn-save" onClick={createTask}>Save Task</button>
      </div>

    </div>
  </div>
</div>

    </div>
  );
}

