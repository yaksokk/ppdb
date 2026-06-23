import api from './api'

const adminService = {
  getDashboard:         ()         => api.get('/admin/dashboard'),
  getListPendaftar:     (params)   => api.get('/admin/pendaftar', { params }),
  getDetailPendaftar:   (id)       => api.get(`/admin/pendaftar/${id}`),
  updateStatus:         (id, data) => api.put(`/admin/pendaftar/${id}/status`, data),
  verifikasiDokumen:    (id, data) => api.put(`/admin/dokumen/${id}/verifikasi`, data),
  getListOperator:      ()         => api.get('/admin/operator'),
  tambahOperator:       (data)     => api.post('/admin/operator', data),
  updateOperator:       (id, data) => api.put(`/admin/operator/${id}`, data),
  hapusOperator:        (id)       => api.delete(`/admin/operator/${id}`),
  getSetting:           ()         => api.get('/admin/setting'),
  updateSetting:        (data)     => api.put('/admin/setting', data),
  getLog:               ()         => api.get('/admin/log'),
  listPendaftarAkun:    (params)   => api.get('/admin/pendaftar-akun', { params }),
  toggleAktifPendaftar: (id)       => api.put(`/admin/pendaftar-akun/${id}/toggle`),
  hapusPendaftarAkun:   (id)       => api.delete(`/admin/pendaftar-akun/${id}`),
  // A1: Seleksi SAW (read-only untuk admin)
  getListSeleksiSaw:    (params)   => api.get('/admin/seleksi-saw', { params }),
  // A2: Setting Kuota
  getKuota:             ()         => api.get('/admin/kuota'),
  updateKuota:          (data)     => api.put('/admin/kuota', data),
}

export default adminService
