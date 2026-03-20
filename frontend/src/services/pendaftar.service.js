import api from './api'

const pendaftarService = {
  submitFormulir: (data)     => api.post('/pendaftar/formulir', data),
  updateFormulir: (data)     => api.put('/pendaftar/formulir', data),
  uploadDokumen:  (formData) => api.post('/pendaftar/dokumen', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  hapusDokumen:   (id)       => api.delete(`/pendaftar/dokumen/${id}`),
  submit:         ()         => api.post('/pendaftar/submit'),
  getStatus:      ()         => api.get('/pendaftar/status'),
  getHasil:       ()         => api.get('/pendaftar/hasil'),
  cekStatus:      (noDaftar) => api.get(`/cek-status/${noDaftar}`),
}

export default pendaftarService