import api from './axios'

export const getInternships = () => api.get('/public/internships')
export const getJobs = () => api.get('/public/jobs')
export const getProblems = () => api.get('/public/problems')
