import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { homePathFor } from '../utils/homePath'
import AdminProfileModal from './admin/AdminProfileModal'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(() => {
    return localStorage.getItem('admin_avatar_url') || user?.avatarUrl || ''
  })

  useEffect(() => {
    const handleAvatarChange = () => {
      setAvatarUrl(localStorage.getItem('admin_avatar_url') || user?.avatarUrl || '')
    }
    window.addEventListener('admin_avatar_changed', handleAvatarChange)
    return () => window.removeEventListener('admin_avatar_changed', handleAvatarChange)
  }, [user])

  const closeMenu = () => setOpen(false)

  const handleLogout = async () => {
    closeMenu()
    await logout()
    navigate('/login')
  }

  const homePath = homePathFor(user)

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <Link to="/" className="navbar-logo" onClick={closeMenu}>
            Hackathon 2026
          </Link>
        </div>

        <button
          type="button"
          className={`navbar-toggle ${open ? 'open' : ''}`}
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`navbar-links ${open ? 'open' : ''}`}>
          <NavLink to="/" className="nav-link" end onClick={closeMenu}>
            Home
          </NavLink>

          {user ? (
            <>
              {user.role === 'company' && (
                <NavLink to={homePath} className="nav-link" onClick={closeMenu}>
                  Post Vacancies
                </NavLink>
              )}
              {user.role === 'jobseeker' && (
                <NavLink to={homePath} className="nav-link" onClick={closeMenu}>
                  Browse Jobs
                </NavLink>
              )}
              {user.role === 'admin' && (
                <NavLink to="/admin" className="nav-link" onClick={closeMenu}>
                  Admin
                </NavLink>
              )}
              <button
                type="button"
                className="nav-user-button"
                onClick={() => {
                  closeMenu()
                  setShowProfileModal(true)
                }}
                title="Click to view and update profile details"
              >
                <span className="user-avatar-badge" style={{ overflow: 'hidden', padding: 0 }}>
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={user.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                    />
                  ) : (
                    user.name ? user.name[0].toUpperCase() : 'U'
                  )}
                </span>
                <span className="user-name-text">{user.name}</span>
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-link" onClick={closeMenu}>
                Login
              </NavLink>
              <Link to="/signup" className="btn btn-primary" onClick={closeMenu}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      {showProfileModal && user && (
        <AdminProfileModal
          user={user}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </>
  )
}
