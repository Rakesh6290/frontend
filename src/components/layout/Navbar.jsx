import React, { useEffect, useState } from 'react' 
import { Link, useNavigate } from 'react-router-dom'
import { clearAuth } from '../../utils/auth'
import api from '../../api/axiosInstance'

export default function Navbar() {
  const navigate = useNavigate()
  const [role, setRole] = useState(null)
  const [user, setUser] = useState(null)

  const logout = () => {
    clearAuth()
    navigate('/login')
  }

  // Fetch current user info from backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/auth/me/')
        setRole(res.data.role || 'user')
        setUser(res.data)
      } catch (err) {
        console.error('Failed to fetch user info:', err)
        setRole('user')
      }
    }
    fetchUser()
  }, [])

  // Generate initials from username
  const getInitials = (name) => {
    if (!name) return ''
    return name
      .split(' ')
      .map(n => n[0].toUpperCase())
      .slice(0, 2)
      .join('')
  }

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <Link to="/" className="text-2xl font-bold text-sky-600 hover:text-sky-700 transition">
          TaskManager
        </Link>

        <nav className="flex items-center gap-4">
          {role === 'admin' && (
            <Link
              to="/admin"
              className="text-sm font-medium text-red-600 hover:text-red-700 transition"
            >
              Admin Panel
            </Link>
          )}

          <Link
            to="/dashboard"
            className="text-sm font-medium text-slate-700 hover:text-slate-900 transition"
          >
            Dashboard
          </Link>

          <Link
            to="/profile"
            className="text-sm font-medium text-slate-700 hover:text-slate-900 transition"
          >
            Profile
          </Link>

          <button
            onClick={logout}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1 rounded-md transition"
          >
            Logout
          </button>

          {/* User Avatar / Initials */}
          {user && (
            <div className="ml-3 w-10 h-10 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-sm">
              {getInitials(user.username)}
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
