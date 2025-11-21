import React from 'react'
import { FaCheckCircle, FaRegCircle, FaEdit, FaTrash } from 'react-icons/fa'

export default function TaskCard({ t, onToggle, onEdit, onDelete, currentUser }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition p-5 flex flex-col justify-between border border-gray-100">
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-lg text-gray-800 truncate">{t.title}</h3>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1
            ${t.completed ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
            {t.completed ? <FaCheckCircle /> : <FaRegCircle />}
            {t.completed ? 'Completed' : 'Pending'}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-2 line-clamp-3">{t.description}</p>
        <p className="text-gray-400 text-xs">Owner: {t.owner_username || t.owner}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-4">
        {/* Toggle completion button */}
        <button
          onClick={() => onToggle(t.id)}
          className={`px-3 py-1 rounded-full text-white text-sm flex items-center gap-1 transition 
            ${t.completed ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'}`}
        >
          {t.completed ? <FaRegCircle /> : <FaCheckCircle />}
          {t.completed ? 'Mark Incomplete' : 'Mark Complete'}
        </button>

        {/* Admin-only actions */}
        {currentUser?.role === 'admin' && (
          <>
            {onEdit && (
              <button
                onClick={() => onEdit(t)}
                className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm flex items-center gap-1 hover:bg-blue-600 transition"
              >
                <FaEdit /> Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(t.id)}
                className="px-3 py-1 bg-red-500 text-white rounded-full text-sm flex items-center gap-1 hover:bg-red-600 transition"
              >
                <FaTrash /> Delete
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
