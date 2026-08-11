import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/useAuth'
import { getProfile } from '../api/auth'

export default function Dashboard() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)

  const welcomeShown = useRef(false)

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])

  useEffect(() => {
    if (user) {
      if (!welcomeShown.current) {
        welcomeShown.current = true
        toast.success(`Welcome back, ${user.name}!`)
      }
      getProfile()
        .then((response) => setProfile(response.data))
        .catch(() => {
          toast.error('Could not fetch your profile data.')
        })
    }
  }, [user])

  if (loading) {
    return <p className="page-message">Loading...</p>
  }

  if (!user) {
    return null
  }

  return (
    <section className="dashboard">
      <h1>Dashboard</h1>
      <p>Welcome, {user.name}!</p>

      <div className="profile-card">
        <h2>Your profile</h2>
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
        <p>
          <strong>API status:</strong>{' '}
          {profile ? 'Authenticated (profile fetched)' : 'Fetching...'}
        </p>
      </div>
    </section>
  )
}
