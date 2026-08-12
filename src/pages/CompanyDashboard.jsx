import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/useAuth'

export default function CompanyDashboard() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  const welcomeShown = useRef(false)

  const [form, setForm] = useState({
    title: '',
    companyName: '',
    location: '',
    type: 'Full-time',
    salary: '',
    description: '',
  })

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

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    toast.success(`Vacancy "${form.title}" posted (demo — backend coming soon).`)
    setForm({
      title: '',
      companyName: '',
      location: '',
      type: 'Full-time',
      salary: '',
      description: '',
    })
  }

  return (
    <section className="dashboard">
      <h1>Company Dashboard</h1>
      <p>Post and manage your job vacancies, {user.name}!</p>

      <div className="profile-card">
        <h2>Post a new vacancy</h2>
        <form className="vacancy-form" onSubmit={handleSubmit}>
          <label className="form-label" htmlFor="title">
            Job title
          </label>
          <input
            id="title"
            type="text"
            name="title"
            className="form-input"
            placeholder="e.g. Senior React Developer"
            value={form.title}
            onChange={handleChange}
            required
          />

          <label className="form-label" htmlFor="companyName">
            Company name
          </label>
          <input
            id="companyName"
            type="text"
            name="companyName"
            className="form-input"
            placeholder="e.g. Acme Inc."
            value={form.companyName}
            onChange={handleChange}
            required
          />

          <label className="form-label" htmlFor="location">
            Location
          </label>
          <input
            id="location"
            type="text"
            name="location"
            className="form-input"
            placeholder="e.g. Colombo (Remote friendly)"
            value={form.location}
            onChange={handleChange}
            required
          />

          <label className="form-label" htmlFor="type">
            Job type
          </label>
          <select
            id="type"
            name="type"
            className="form-input"
            value={form.type}
            onChange={handleChange}
          >
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Contract</option>
            <option>Internship</option>
            <option>Remote</option>
          </select>

          <label className="form-label" htmlFor="salary">
            Salary range
          </label>
          <input
            id="salary"
            type="text"
            name="salary"
            className="form-input"
            placeholder="e.g. Rs. 250,000 - 350,000"
            value={form.salary}
            onChange={handleChange}
          />

          <label className="form-label" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="form-input"
            rows="4"
            placeholder="Describe the role and requirements"
            value={form.description}
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn btn-primary btn-block">
            Post Vacancy
          </button>
        </form>
      </div>
    </section>
  )
}
