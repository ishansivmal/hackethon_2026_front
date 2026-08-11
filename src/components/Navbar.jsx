import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const closeMenu = () => setOpen(false)

  const handleLogout = async () => {
    closeMenu()
    await logout()
    navigate('/login')
  }

  return (
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
            <NavLink to="/dashboard" className="nav-link" onClick={closeMenu}>
              Dashboard
            </NavLink>
            {user.role === 'admin' && (
              <NavLink to="/admin" className="nav-link" onClick={closeMenu}>
                Admin
              </NavLink>
            )}
            <span className="nav-user">{user.name}</span>
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
  )
}
