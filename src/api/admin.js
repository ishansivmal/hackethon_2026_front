import api from './axios'

export const getUsers = () => api.get('/admin/users')

export const createUser = (userData) => api.post('/admin/users', userData)

export const updateUserRole = (id, role) =>
  api.put(`/admin/users/${id}/role`, { role })

export const updateUser = (id, userData) =>
  api.put(`/admin/users/${id}`, userData)

export const deleteUser = (id) => api.delete(`/admin/users/${id}`)

export const getCompanies = () => api.get('/admin/companies')

export const createCompany = (companyData) =>
  api.post('/admin/companies', companyData)

export const updateCompany = (id, companyData) =>
  api.put(`/admin/companies/${id}`, companyData)

export const updateCompanyStatus = (id, status) =>
  api.put(`/admin/companies/${id}/status`, { status })

export const deleteCompany = (id) => api.delete(`/admin/companies/${id}`)
