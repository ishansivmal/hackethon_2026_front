import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">
          Hackathon 2026
        </Link>
      </div>

      <div className="navbar-links">
        <NavLink to="/" className="nav-link" end>
          Home
        </NavLink>

        {user ? (
          <>
            <NavLink to="/dashboard" className="nav-link">
              Dashboard
            </NavLink>
            {user.role === 'admin' && (
              <NavLink to="/admin" className="nav-link">
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
            <NavLink to="/login" className="nav-link">
              Login
            </NavLink>
            <Link to="/signup" className="btn btn-primary">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
