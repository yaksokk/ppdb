import { useEffect } from 'react'
import useAuthStore from '../store/authStore'

export function useActivityTracker() {
  const { updateActivity, isSessionExpired, clearAuth, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) return

    if (isSessionExpired()) {
      clearAuth()
      window.location.href = '/login'
      return
    }

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click']
    const handleActivity = () => updateActivity()

    events.forEach(e => window.addEventListener(e, handleActivity))

    const interval = setInterval(() => {
      if (isSessionExpired()) {
        clearAuth()
        window.location.href = '/login'
      }
    }, 60 * 1000)

    return () => {
      events.forEach(e => window.removeEventListener(e, handleActivity))
      clearInterval(interval)
    }
  }, [isAuthenticated])
}