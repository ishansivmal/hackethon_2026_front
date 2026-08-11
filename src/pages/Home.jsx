import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function Home() {
  const { user } = useAuth()

  return (
    <section className="home">
      <h1>Hackathon 2026</h1>
      <p>
        A full-stack starter with React, Vite and an Express + Sequelize
        backend.
      </p>

      <div className="home-actions">
        {user ? (
          <Link to="/dashboard" className="btn btn-primary">
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link to="/signup" className="btn btn-primary">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-outline">
              Login
            </Link>
          </>
        )}
      </div>
    </section>
  )
}
