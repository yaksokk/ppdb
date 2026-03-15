import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

function RoleRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(user?.role)) {
    if (user?.role === 'admin' || user?.role === 'operator') {
      return <Navigate to="/admin/dashboard" replace />
    }
    return <Navigate to="/pendaftar/dashboard" replace />
  }

  return children
}

export default RoleRoute