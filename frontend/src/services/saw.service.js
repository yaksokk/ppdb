import api from './api'

const sawService = {
  hitung:     (data)   => api.post('/saw/hitung', data),
  getRanking: (params) => api.get('/saw/ranking', { params }),
}

export default sawService