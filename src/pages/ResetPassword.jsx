import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { resetPassword } from '../api/auth'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''

  const [form, setForm] = useState({ password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!token) {
      toast.error('Invalid or missing reset token')
      return
    }

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      await resetPassword(token, form.password)
      toast.success('Password reset! You can now log in.')
      setForm({ password: '', confirmPassword: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1 className="auth-title">Set a new password</h1>
        <p className="auth-subtitle">
          Choose a strong password for your account
        </p>


        <label className="form-label" htmlFor="password">
          New password
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
          Confirm new password
        </label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          className="form-input"
          placeholder="Repeat your new password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset password'}
        </button>

        <p className="auth-switch">
          <Link to="/login">Back to login</Link>
        </p>
      </form>
    </div>
  )
}
