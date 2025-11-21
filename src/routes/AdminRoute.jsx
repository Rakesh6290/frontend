import { Navigate } from 'react-router-dom'
export default function AdminRoute({ children }) {
  const token = localStorage.getItem('access_token')
  const role = localStorage.getItem('user_role')
  if (!token) return <Navigate to="/login" replace />
  if (role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}
