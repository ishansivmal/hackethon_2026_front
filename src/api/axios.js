import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const TOKEN_KEYS = {
  access: 'hackathon_access_token',
  refresh: 'hackathon_refresh_token',
}

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(TOKEN_KEYS.access)
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

let refreshPromise = null

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem(TOKEN_KEYS.refresh)

      if (refreshToken && !originalRequest.url.includes('/refresh')) {
        originalRequest._retry = true

        if (!refreshPromise) {
          refreshPromise = axios
            .post(
              `${api.defaults.baseURL}/auth/refresh`,
              { refreshToken },
            )
            .then((response) => {
              localStorage.setItem(
                TOKEN_KEYS.access,
                response.data.accessToken,
              )
              localStorage.setItem(
                TOKEN_KEYS.refresh,
                response.data.refreshToken,
              )
              return response.data.accessToken
            })
            .finally(() => {
              refreshPromise = null
            })
        }

        try {
          const newAccessToken = await refreshPromise
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return api(originalRequest)
        } catch (refreshError) {
          localStorage.removeItem(TOKEN_KEYS.access)
          localStorage.removeItem(TOKEN_KEYS.refresh)
          localStorage.removeItem('hackathon_user')
          window.location.href = '/login'
          return Promise.reject(refreshError)
        }
      }
    }

    return Promise.reject(error)
  },
)

export default api
