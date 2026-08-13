import api from './axios'
export const getInternships = () => api.get('/public/internships')
export const getJobs = () => api.get('/public/jobs')
export const getProblems = () => api.get('/public/problems')

export const applyForInternship = (id, formData) => api.post(`/customer/apply/internship/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
})

export const applyForJob = (id, formData) => api.post(`/customer/apply/job/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
})

export const applyForProblem = (id, formData) => api.post(`/customer/apply/problem/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
})

export const getAppliedRecord = () => api.get('/customer/applied')

export const getAppliedInternships = () => api.get('/customer/applied/internship')
export const getAppliedJobs = () => api.get('/customer/applied/job')
export const getAppliedProblems = () => api.get('/customer/applied/problem')
