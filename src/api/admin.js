import api from './axios'

export const getUsers = () => api.get('/admin/users')

export const createUser = (userData) => api.post('/admin/users', userData)

export const updateUserRole = (id, role) =>
  api.put(`/admin/users/${id}/role`, { role })

export const updateUser = (id, userData) =>
  api.put(`/admin/users/${id}`, userData)

export const deleteUser = (id) => api.delete(`/admin/users/${id}`)
