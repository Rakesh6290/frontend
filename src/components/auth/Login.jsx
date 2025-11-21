import React, { useState } from 'react'
import api from '../../api/axiosInstance'
import { useNavigate, Link } from 'react-router-dom'
import { saveAuth } from '../../utils/auth'
import { FaUserAlt, FaLock } from 'react-icons/fa'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async e => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await api.post('token/', form) 
      const { access, refresh } = res.data
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`
      const me = await api.get('me/')
      const role = me.data.role || 'user'
      saveAuth({ access, refresh, role })
      localStorage.setItem('user_role', role)
      localStorage.setItem('user', JSON.stringify(me.data))
      if (role === 'admin') navigate('/admin')
      else navigate('/dashboard')
    } catch (err) {
      const message = err.response?.data?.detail || 'Login failed'
      alert(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-sky-100 to-sky-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 space-y-6">
        <h2 className="text-3xl font-extrabold text-sky-700 text-center">Welcome Back</h2>
        <p className="text-sm text-gray-500 text-center">Sign in to your account</p>
        <form onSubmit={submit} className="space-y-5">
          <div className="relative">
            <FaUserAlt className="absolute top-3 left-3 text-gray-400" />
            <input 
              className="w-full border border-gray-300 rounded-xl py-2 pl-10 pr-3 focus:ring-2 focus:ring-sky-400 focus:outline-none" 
              placeholder="Username" 
              value={form.username} 
              onChange={e => setForm({ ...form, username: e.target.value })} 
            />
          </div>
          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <input 
              type="password" 
              className="w-full border border-gray-300 rounded-xl py-2 pl-10 pr-3 focus:ring-2 focus:ring-sky-400 focus:outline-none" 
              placeholder="Password" 
              value={form.password} 
              onChange={e => setForm({ ...form, password: e.target.value })} 
            />
          </div>
          <button 
            className="w-full bg-sky-600 text-white py-2 rounded-xl font-semibold hover:bg-sky-700 transition-colors disabled:opacity-50" 
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center text-gray-500 text-sm">
          Don't have an account? <Link to="/register" className="text-sky-600 font-medium hover:underline">Register</Link>
        </p>
      </div>
    </div>
  )
}
