import api from './axios'

export const registerUser = (userData) => api.post('/auth/register', userData)

export const loginUser = (credentials) => api.post('/auth/login', credentials)

export const logoutUser = (refreshToken) =>
  api.post('/auth/logout', { refreshToken })

export const getProfile = () => api.get('/auth/profile')
