import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/public/Login/Login'
import Register from '../pages/public/Register/Register'
import LoginAdmin from '../pages/admin/LoginAdmin/LoginAdmin'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<div>Beranda</div>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin/login" element={<LoginAdmin />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes