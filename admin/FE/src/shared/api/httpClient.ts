import axios from 'axios'

const httpClient = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor — đính kèm JWT token
httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('windown_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor — xử lý 401
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
      localStorage.removeItem('windown_token')
      localStorage.removeItem('windown_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default httpClient
