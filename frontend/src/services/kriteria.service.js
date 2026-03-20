import api from './api'

const kriteriaService = {
  getAll:         ()       => api.get('/kriteria'),
  getByJalur:     (jalurId) => api.get(`/kriteria/jalur/${jalurId}`),
  validasiBobot:  (jalurId) => api.get(`/kriteria/validasi/${jalurId}`),
  store:          (data)   => api.post('/kriteria', data),
  update:         (id, data) => api.put(`/kriteria/${id}`, data),
  destroy:        (id)     => api.delete(`/kriteria/${id}`),
}

export default kriteriaService