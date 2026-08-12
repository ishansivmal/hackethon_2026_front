import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { confirmEmail } from '../api/auth'

export default function ConfirmEmail() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Missing verification token. Check the link in your email.')
      return
    }

    confirmEmail(token)
      .then((response) => {
        setStatus('success')
        setMessage(response.data.message)
      })
      .catch((err) => {
        setStatus('error')
        setMessage(
          err.response?.data?.message ||
            'Could not verify your email. The link may be invalid or expired.',
        )
      })
  }, [token])

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Email confirmation</h1>

        {status === 'loading' && (
          <p className="auth-subtitle">Verifying your email...</p>
        )}

        {status === 'success' && (
          <>
            <p className="auth-success">{message}</p>
            <Link to="/login" className="btn btn-primary btn-block">
              Log in now
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <p className="auth-error">{message}</p>
            <Link to="/signup" className="btn btn-primary btn-block">
              Create a new account
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
