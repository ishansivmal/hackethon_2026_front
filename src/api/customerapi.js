import api from './axios'
export const getInternships = (page = 1, pageSize = 10) => api.get('/public/internships', { params: { page, pageSize } })
export const getJobs = (page = 1, pageSize = 10) => api.get('/public/jobs', { params: { page, pageSize } })
export const getProblems = (page = 1, pageSize = 10) => api.get('/public/problems', { params: { page, pageSize } })

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
