import api from '../utils/api'

export const healthCheck = async () => {
  const response = await api.get('/api/health')
  return response.data
}

export const getHello = async () => {
  const response = await api.get('/api/hello')
  return response.data
}

