import api from './axios'

export const getCompanyDashboard = () => api.get('/company/dashboard')

export const postInternship = (data) => api.post('/company/internships', data)
export const updateInternship = (id, data) => api.put(`/company/internships/${id}`, data)
export const deleteInternship = (id) => api.delete(`/company/internships/${id}`)

export const postJob = (data) => api.post('/company/jobs', data)
export const updateJob = (id, data) => api.put(`/company/jobs/${id}`, data)
export const deleteJob = (id) => api.delete(`/company/jobs/${id}`)

export const postProblem = (data) => api.post('/company/problems', data)
export const updateProblem = (id, data) => api.put(`/company/problems/${id}`, data)
export const deleteProblem = (id) => api.delete(`/company/problems/${id}`)

export const updateApplicationSelection = (type, id, isSelected) =>
  api.put(`/company/applications/${type}/${id}`, { isSelected })

export const rankApplicants = (type, id) =>
  api.post(`/company/applications/rank/${type}/${id}`)
