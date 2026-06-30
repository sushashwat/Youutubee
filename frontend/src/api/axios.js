import axios from 'axios'

/**
 * axios instance
 * ----------------
 * Centralizes the backend base URL so every API call doesn't need to
 * repeat "http://localhost:5000/api". An interceptor automatically
 * attaches the JWT (from localStorage) to every request that needs it.
 */
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api      