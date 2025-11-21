import React, { useState } from 'react'
import api from '../../api/axiosInstance'
import { useNavigate } from 'react-router-dom'
import { FaUserAlt, FaEnvelope, FaLock } from 'react-icons/fa'

export default function Register() {
  const [form, setForm] = useState({ username:'', email:'', password:'', password2:'', role: 'user' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async e => {
    e.preventDefault()
    if (form.password !== form.password2) return alert('Passwords do not match')
    setLoading(true)
    try {
      await api.post('register/', form)
      alert('Registered successfully. Please login.')
      navigate('/login')
    } catch (err) {
      alert(err.response?.data?.detail || 'Register failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
      <div className="card w-full max-w-lg p-6 shadow-lg rounded-lg bg-white">
        <h2 className="text-2xl font-bold mb-4 text-center text-sky-600">Create Account</h2>
        <form onSubmit={submit} className="space-y-4">
          
          <div className="relative">
            <FaUserAlt className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input 
              className="w-full border rounded pl-10 p-2 focus:outline-sky-500" 
              placeholder="Username" 
              value={form.username} 
              onChange={e=>setForm({...form,username:e.target.value})} 
            />
          </div>

          <div className="relative">
            <FaEnvelope className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input 
              className="w-full border rounded pl-10 p-2 focus:outline-sky-500" 
              placeholder="Email" 
              value={form.email} 
              onChange={e=>setForm({...form,email:e.target.value})} 
            />
          </div>

          <div className="relative">
            <FaLock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input 
              type="password" 
              className="w-full border rounded pl-10 p-2 focus:outline-sky-500" 
              placeholder="Password" 
              value={form.password} 
              onChange={e=>setForm({...form,password:e.target.value})} 
            />
          </div>

          <div className="relative">
            <FaLock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input 
              type="password" 
              className="w-full border rounded pl-10 p-2 focus:outline-sky-500" 
              placeholder="Confirm Password" 
              value={form.password2} 
              onChange={e=>setForm({...form,password2:e.target.value})} 
            />
          </div>

          <select 
            className="w-full border rounded p-2 focus:outline-sky-500"
            value={form.role} 
            onChange={e=>setForm({...form,role:e.target.value})}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button 
            className="w-full bg-sky-600 text-white p-2 rounded hover:bg-sky-700 transition"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="mt-3 text-sm text-center">
          Already have an account? <span className="text-sky-600 cursor-pointer" onClick={()=>navigate('/login')}>Login</span>
        </p>
      </div>
    </div>
  )
}
