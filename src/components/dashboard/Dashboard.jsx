import React, { useEffect, useState } from 'react'
import api from '../../api/axiosInstance'
import Navbar from '../layout/Navbar'
import TaskCard from './TaskCard'
import TaskModal from './TaskModal'
import useCurrentUser from '../../utils/useCurrentUser'

export default function Dashboard() {
  const { user, loading } = useCurrentUser()
  const [tasks, setTasks] = useState([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  // Load tasks
  const loadTasks = async () => {
    try {
      const res = await api.get('tasks/')
      setTasks(res.data)
    } catch (e) {
      console.error('Error loading tasks:', e.response?.data || e)
    }
  }

  useEffect(() => { loadTasks() }, [])

  const createOrSave = async (payload) => {
    setSaving(true)
    try {
      if (editing?.id) {
        if (user?.role !== 'admin') { alert('Only admins can edit tasks'); return }
        await api.patch(`tasks/${editing.id}/`, payload)
        setTasks(prev => prev.map(t => t.id === editing.id ? { ...t, ...payload } : t))
      } else {
        const res = await api.post('tasks/', payload)
        setTasks(prev => [...prev, res.data])
      }
      setOpen(false)
      setEditing(null)
    } catch (e) {
      console.error('Error saving task:', e.response?.data || e)
      alert('Failed to save task')
    } finally {
      setSaving(false)
    }
  }

  const toggle = async (id) => {
    try {
      const res = await api.post(`tasks/${id}/toggle/`)
      setTasks(prev => prev.map(t => t.id === id ? res.data : t))
    } catch (e) {
      console.error('Error toggling task:', e.response?.data || e)
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this task?')) return
    if (user?.role !== 'admin') { alert('Only admins can delete tasks'); return }
    try {
      await api.delete(`tasks/${id}/`)
      setTasks(prev => prev.filter(t => t.id !== id))
    } catch (e) {
      console.error('Error deleting task:', e.response?.data || e)
      alert('Failed to delete task')
    }
  }

  const startEdit = (task) => {
    if (user?.role !== 'admin') return
    setEditing(task)
    setOpen(true)
  }

  if (loading) return <div className="flex justify-center mt-10 text-gray-500">Loading...</div>

  return (
    <>
      <Navbar user={user} />

      <div className="container mx-auto mt-8 px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
          <h2 className="text-3xl font-bold text-gray-800">Tasks</h2>
          <div className="flex gap-2 flex-wrap">
            <button 
              className="bg-sky-600 text-white px-5 py-2 rounded-lg shadow hover:bg-sky-700 transition"
              onClick={() => { setEditing(null); setOpen(true) }}
            >
              + New Task
            </button>

            {user?.role === 'admin' && (
              <a
                href="/admin/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 text-white px-5 py-2 rounded-lg shadow hover:bg-red-700 transition"
              >
                Admin Panel
              </a>
            )}
          </div>
        </div>

        {/* Task grid */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.length === 0 && (
            <p className="text-gray-500 col-span-full text-center mt-10">No tasks yet. Create one!</p>
          )}
          {tasks.map(t => (
            <TaskCard 
              key={t.id} 
              t={t} 
              onToggle={toggle} 
              onDelete={user?.role === 'admin' ? remove : undefined} 
              onEdit={user?.role === 'admin' ? startEdit : undefined} 
              currentUser={user} 
            />
          ))}
        </div>
      </div>

      <TaskModal 
        open={open} 
        onClose={() => { setOpen(false); setEditing(null) }} 
        initial={editing || {}} 
        onSave={createOrSave} 
        loading={saving} 
      />
    </>
  )
}
