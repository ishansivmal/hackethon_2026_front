import api from './axios'

export const registerUser = (userData) => api.post('/auth/register', userData)

export const loginUser = (credentials) => api.post('/auth/login', credentials)

export const googleAuth = (idToken) => api.post('/auth/google', { idToken })

export const logoutUser = (refreshToken) =>
  api.post('/auth/logout', { refreshToken })

export const getProfile = () => api.get('/auth/profile')

export const forgotPassword = (email) =>
  api.post('/auth/forgot-password', { email })

export const resetPassword = (token, newPassword) =>
  api.post('/auth/reset-password', { token, newPassword })
