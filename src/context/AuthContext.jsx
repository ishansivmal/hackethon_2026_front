import { useEffect, useState } from 'react'
import * as authApi from '../api/auth'
import { TOKEN_KEYS } from '../api/axios'
import { AuthContext } from './useAuth'

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('hackathon_user')) ?? null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)
  const [loading, setLoading] = useState(true)

  const persistSession = (data) => {
    localStorage.setItem(TOKEN_KEYS.access, data.accessToken)
    localStorage.setItem(TOKEN_KEYS.refresh, data.refreshToken)
    localStorage.setItem('hackathon_user', JSON.stringify(data.user))
    setUser(data.user)
  }

  const login = async (email, password) => {
    const response = await authApi.loginUser({ email, password })
    persistSession(response.data)
    return response.data
  }

  const googleLogin = async (idToken) => {
    const response = await authApi.googleAuth(idToken)
    persistSession(response.data)
    return response.data
  }

  const register = async (name, email, password) => {
    await authApi.registerUser({ name, email, password })
  }

  const logout = async () => {
    const refreshToken = localStorage.getItem(TOKEN_KEYS.refresh)
    try {
      if (refreshToken) {
        await authApi.logoutUser(refreshToken)
      }
    } catch {
      // Token already invalid server-side; still clear local state
    } finally {
      localStorage.removeItem(TOKEN_KEYS.access)
      localStorage.removeItem(TOKEN_KEYS.refresh)
      localStorage.removeItem('hackathon_user')
      setUser(null)
    }
  }

  useEffect(() => {
    const restoreSession = async () => {
      const accessToken = localStorage.getItem(TOKEN_KEYS.access)
      if (accessToken && !getStoredUser()) {
        try {
          const response = await authApi.getProfile()
          localStorage.setItem(
            'hackathon_user',
            JSON.stringify(response.data.user),
          )
          setUser(response.data.user)
        } catch {
          localStorage.removeItem(TOKEN_KEYS.access)
          localStorage.removeItem(TOKEN_KEYS.refresh)
        }
      }
      setLoading(false)
    }

    restoreSession()
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, loading, login, googleLogin, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}
