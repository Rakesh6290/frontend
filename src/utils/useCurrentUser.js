import { useEffect, useState } from 'react'
import api from '../api/axiosInstance'
export default function useCurrentUser() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res = await api.get('/me/')
        if (mounted) setUser(res.data)
      } catch {
        if (mounted) setUser(null)
      } finally { if (mounted) setLoading(false) }
    }
    load()
    return () => (mounted = false)
  }, [])
  return { user, loading, setUser }
}
