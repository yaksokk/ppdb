import { Routes, Route, Navigate } from 'react-router-dom'
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
      <Route path="/admin/pendaftar" element={<DataPendaftar />} />
      <Route path="/admin/pendaftar/:id" element={<DetailPendaftar />} />
      <Route path="/admin/seleksi" element={<HasilSeleksi />} />
      <Route path="/admin/pengumuman" element={<KelolaInfo />} />
      <Route path="/admin/operator" element={<KelolaAkun />} />
      <Route path="/admin/pengaturan" element={<Pengaturan />} />
      <Route path="/pendaftar/formulir" element={<Formulir />} />
      <Route path="/pendaftar/dokumen" element={<UploadDokumen />} />
      <Route path="/pendaftar/hasil" element={<HasilSeleksiPendaftar />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes