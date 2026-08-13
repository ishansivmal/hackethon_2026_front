import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/useAuth'
import GoogleSignIn from '../components/GoogleSignIn'

export default function Signup() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [role, setRole] = useState('jobseeker')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      await register(form.name, form.email, form.password, role)
      toast.success('Account created! A confirmation link was sent to your email.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Sign up failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Join Hackathon 2026</p>

        <label className="form-label">I want to</label>
        <div className="role-options">
          <button
            type="button"
            className={`role-option ${role === 'jobseeker' ? 'active' : ''}`}
            onClick={() => setRole('jobseeker')}
            aria-pressed={role === 'jobseeker'}
          >
            <strong className="role-option-title">Job Seeker</strong>
            <span className="role-option-desc">Find and apply for job vacancies</span>
          </button>

          <button
            type="button"
            className={`role-option ${role === 'company' ? 'active' : ''}`}
            onClick={() => setRole('company')}
            aria-pressed={role === 'company'}
          >
            <strong className="role-option-title">Company</strong>
            <span className="role-option-desc">Post and manage job vacancies</span>
          </button>
        </div>

        <label className="form-label" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          className="form-input"
          placeholder="Your name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label className="form-label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          className="form-input"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label className="form-label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          name="password"
          className="form-input"
          placeholder="8+ chars, upper, lower, number & symbol"
          value={form.password}
          onChange={handleChange}
          required
        />
        <p className="form-hint">
          At least 8 characters with uppercase, lowercase, a number and a
          special character
        </p>

        <label className="form-label" htmlFor="confirmPassword">
          Confirm password
        </label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          className="form-input"
          placeholder="Repeat your password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <GoogleSignIn text="signup_with" />

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  )
}
