import api from './api'

const operatorService = {
  getListPendaftar:   (params)   => api.get('/operator/pendaftar', { params }),
  getDetailPendaftar: (id)       => api.get(`/operator/pendaftar/${id}`),
  inputNilai:         (id, data) => api.post(`/operator/pendaftar/${id}/nilai`, data),
  // O2: Verifikasi pendaftar
  setValid:           (id)       => api.put(`/operator/pendaftar/${id}/valid`),
  kirimPerbaikan:     (id)       => api.put(`/operator/pendaftar/${id}/perbaikan`),
  // O3: Seleksi SAW
  getListSeleksiSaw:  (params)   => api.get('/operator/seleksi-saw', { params }),
  getHasilSeleksi:    (params)   => api.get('/operator/hasil-seleksi', { params }),
  updateHasil:        (id, data) => api.put(`/operator/hasil-seleksi/${id}`, data),
}

export default operatorService
