import React, { useState, useEffect } from 'react'

export default function TaskModal({ open, onClose, initial, onSave, loading }) {
  const [form, setForm] = useState({ title: '', description: '' })

  useEffect(() => {
    if (initial) setForm({ title: initial.title || '', description: initial.description || '' })
  }, [initial])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(form)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-5 transform transition-all scale-95 opacity-0 animate-fadeInUp">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {initial?.id ? 'Edit Task' : 'New Task'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition text-sm"
            placeholder="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            required
          />

          <textarea
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition resize-none h-20 text-sm"
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />

          <div className="flex justify-end gap-2 mt-3">
            <button
              type="button"
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition text-sm"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition text-sm disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
