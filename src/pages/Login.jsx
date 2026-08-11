import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import GoogleSignIn from '../components/GoogleSignIn'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Log in to your account</p>

        {error && <div className="auth-error">{error}</div>}

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
          placeholder="Your password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="auth-forgot">
          <Link to="/forgot-password">Forgot password?</Link>
        </p>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <GoogleSignIn text="continue_with" />

        <p className="auth-switch">
          Don&apos;t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  )
}
