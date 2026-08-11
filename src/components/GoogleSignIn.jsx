import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/useAuth'
import { loadGoogleScript } from '../utils/google'

export default function GoogleSignIn({ text = 'continue_with' }) {
  const { googleLogin } = useAuth()
  const navigate = useNavigate()
  const buttonRef = useRef(null)
  const textRef = useRef(text)
  const [processing, setProcessing] = useState(false)

  textRef.current = text

  const handleCredentialResponseRef = useRef(async () => {})

  handleCredentialResponseRef.current = async (response) => {
    if (!response?.credential) return

    setProcessing(true)

    try {
      await googleLogin(response.credential)
      toast.success('Signed in with Google!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Google sign-in failed')
      setProcessing(false)
    }
  }

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId) {
      toast.error('Google Sign-In is not configured')
      return
    }

    let canceled = false

    loadGoogleScript()
      .then(() => {
        if (canceled || !window.google?.accounts || !buttonRef.current) return

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => handleCredentialResponseRef.current(response),
        })

        buttonRef.current.innerHTML = ''
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline',
          size: 'large',
          text: textRef.current,
          width: '100%',
        })
      })
      .catch(() => {
        if (!canceled) toast.error('Unable to load Google Sign-In')
      })

    return () => {
      canceled = true
    }
  }, [])

  return (
    <div className="google-signin">
      {processing ? (
        <div className="google-signin-loading">Connecting to Google...</div>
      ) : (
        <div ref={buttonRef} className="google-signin-button" />
      )}
    </div>
  )
}
