import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/useAuth'

export default function JobSeekerDashboard() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  const welcomeShown = useRef(false)

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])

  useEffect(() => {
    if (user && !welcomeShown.current) {
      welcomeShown.current = true
      toast.success(`Welcome, ${user.name}!`)
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
      <h1>Job Vacancies</h1>
      <p>Browse open job opportunities, {user.name}!</p>

      <div className="profile-card">
        <h2>Your profile</h2>
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong> Job Seeker
        </p>
      </div>

      <div className="profile-card">
        <h2>Available vacancies</h2>
        <p className="empty-state">No vacancies posted yet. Check back soon!</p>
      </div>
    </section>
  )
}
