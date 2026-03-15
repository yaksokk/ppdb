import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/public/Login/Login'
import Register from '../pages/public/Register/Register'
import LoginAdmin from '../pages/admin/LoginAdmin/LoginAdmin'
import Dashboard from '../pages/admin/Dashboard/Dashboard'
import DashboardOperator from '../pages/admin/DashboardOperator/DashboardOperator'
import DashboardPendaftar from '../pages/pendaftar/Dashboard/Dashboard'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<div>Beranda</div>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin/login" element={<LoginAdmin />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/operator/dashboard" element={<DashboardOperator />} />
      <Route path="/pendaftar/dashboard" element={<DashboardPendaftar />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes