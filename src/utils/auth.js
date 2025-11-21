export const saveAuth = ({ access, refresh, role }) => {
  if (access) localStorage.setItem('access_token', access)
  if (refresh) localStorage.setItem('refresh_token', refresh)
  if (role) localStorage.setItem('user_role', role)
}
export const clearAuth = () => localStorage.clear()
export const getAuth = () => ({
  access: localStorage.getItem('access_token'),
  refresh: localStorage.getItem('refresh_token'),
  role: localStorage.getItem('user_role')
})
