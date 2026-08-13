import { NavLink, Outlet, useLocation } from 'react-router-dom'
import './Home.css'

export default function Home() {
  const location = useLocation()

  return (
    <section className="customer-layout">
      <div className="home-header">
        <h1 className="home-title">Discover Opportunities</h1>
        <p className="home-subtitle">
          Explore the latest internships, jobs, and coding challenges tailored for you.
        </p>
      </div>

      <nav className="home-nav-container">
        <NavLink
          to="/internships"
          className={({ isActive }) => 
            `home-nav-link ${isActive || location.pathname === '/' ? 'active' : ''}`
          }
        >
          Internships
        </NavLink>
        <NavLink
          to="/jobs"
          className={({ isActive }) => `home-nav-link ${isActive ? 'active' : ''}`}
        >
          Jobs
        </NavLink>
        <NavLink
          to="/problems"
          className={({ isActive }) => `home-nav-link ${isActive ? 'active' : ''}`}
        >
          Problems
        </NavLink>
      </nav>

      <div className="home-content-wrapper">
        <Outlet />
      </div>
    </section>
  )
}