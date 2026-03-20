import api from './api'

const operatorService = {
  getListPendaftar:   (params) => api.get('/operator/pendaftar', { params }),
  getDetailPendaftar: (id)     => api.get(`/operator/pendaftar/${id}`),
  inputNilai:         (id, data) => api.post(`/operator/pendaftar/${id}/nilai`, data),
  getHasilSeleksi:    (params) => api.get('/operator/hasil-seleksi', { params }),
  updateHasil:        (id, data) => api.put(`/operator/hasil-seleksi/${id}`, data),
}

export default operatorService