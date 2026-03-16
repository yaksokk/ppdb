import { Routes, Route, Navigate } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import RoleRoute from './RoleRoute'
import Login from '../pages/public/Login/Login'
import Register from '../pages/public/Register/Register'
import LoginAdmin from '../pages/admin/LoginAdmin/LoginAdmin'
import Dashboard from '../pages/admin/Dashboard/Dashboard'
import DashboardOperator from '../pages/admin/DashboardOperator/DashboardOperator'
import DashboardPendaftar from '../pages/pendaftar/Dashboard/Dashboard'
import DataPendaftar from '../pages/admin/DataPendaftar/DataPendaftar'
import DetailPendaftar from '../pages/admin/DetailPendaftar/DetailPendaftar'
import HasilSeleksi from '../pages/admin/HasilSeleksi/HasilSeleksi'
import KelolaInfo from '../pages/admin/KelolaInfo/KelolaInfo'
import KelolaAkun from '../pages/admin/KelolaAkun/KelolaAkun'
import Pengaturan from '../pages/admin/Pengaturan/Pengaturan'
import Formulir from '../pages/pendaftar/Formulir/Formulir'
import UploadDokumen from '../pages/pendaftar/UploadDokumen/UploadDokumen'
import HasilSeleksiPendaftar from '../pages/pendaftar/HasilSeleksi/HasilSeleksi'
import Beranda from '../pages/public/Beranda/Beranda'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Beranda />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin/login" element={<LoginAdmin />} />

      <Route path="/admin/dashboard" element={
        <PrivateRoute><RoleRoute allowedRoles={['admin']}><Dashboard /></RoleRoute></PrivateRoute>
      } />
      <Route path="/admin/pendaftar" element={
        <PrivateRoute><RoleRoute allowedRoles={['admin', 'operator']}><DataPendaftar /></RoleRoute></PrivateRoute>
      } />
      <Route path="/admin/pendaftar/:id" element={
        <PrivateRoute><RoleRoute allowedRoles={['admin', 'operator']}><DetailPendaftar /></RoleRoute></PrivateRoute>
      } />
      <Route path="/admin/seleksi" element={
        <PrivateRoute><RoleRoute allowedRoles={['operator']}><HasilSeleksi /></RoleRoute></PrivateRoute>
      } />
      <Route path="/admin/pengumuman" element={
        <PrivateRoute><RoleRoute allowedRoles={['admin']}><KelolaInfo /></RoleRoute></PrivateRoute>
      } />
      <Route path="/admin/operator" element={
        <PrivateRoute><RoleRoute allowedRoles={['admin']}><KelolaAkun /></RoleRoute></PrivateRoute>
      } />
      <Route path="/admin/pengaturan" element={
        <PrivateRoute><RoleRoute allowedRoles={['admin']}><Pengaturan /></RoleRoute></PrivateRoute>
      } />

      <Route path="/operator/dashboard" element={
        <PrivateRoute><RoleRoute allowedRoles={['operator']}><DashboardOperator /></RoleRoute></PrivateRoute>
      } />

      <Route path="/pendaftar/dashboard" element={
        <PrivateRoute><RoleRoute allowedRoles={['pendaftar']}><DashboardPendaftar /></RoleRoute></PrivateRoute>
      } />
      <Route path="/pendaftar/formulir" element={
        <PrivateRoute><RoleRoute allowedRoles={['pendaftar']}><Formulir /></RoleRoute></PrivateRoute>
      } />
      <Route path="/pendaftar/dokumen" element={
        <PrivateRoute><RoleRoute allowedRoles={['pendaftar']}><UploadDokumen /></RoleRoute></PrivateRoute>
      } />
      <Route path="/pendaftar/hasil" element={
        <PrivateRoute><RoleRoute allowedRoles={['pendaftar']}><HasilSeleksiPendaftar /></RoleRoute></PrivateRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes