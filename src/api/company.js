import api from './axios'

export const postInternship = (data) => api.post('/company/internships', data)

export const postJob = (data) => api.post('/company/jobs', data)

export const postProblem = (data) => api.post('/company/problems', data)
