import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../api/auth'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      await forgotPassword(email)
      setMessage(
        'If an account exists for this email, a password reset link has been sent.',
      )
      setEmail('')
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Something went wrong. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1 className="auth-title">Forgot password</h1>
        <p className="auth-subtitle">
          Enter your email and we&apos;ll send you a reset link
        </p>

        {error && <div className="auth-error">{error}</div>}
        {message && <div className="auth-success">{message}</div>}

        <label className="form-label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="form-input"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Sending...' : 'Send reset link'}
        </button>

        <p className="auth-switch">
          Remembered your password? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  )
}
