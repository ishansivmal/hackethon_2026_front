import { NavLink, Outlet, useLocation } from 'react-router-dom'

export default function Home() {
  const location = useLocation()

  return (
    <section className="customer-layout" style={{ paddingTop: '2rem' }}>
      <nav
        className="home-nav"
        style={{
          display: 'flex',
          gap: '2rem',
          borderBottom: '1px solid #444',
          paddingBottom: '1.5rem',
          marginBottom: '2rem',
          justifyContent: 'center',
          fontSize: '1.1rem'
        }}
      >
        <NavLink
          to="/internships"
          style={({ isActive }) => ({
            color: isActive || location.pathname === '/' ? '#fff' : '#4da6ff',
            textDecoration: isActive || location.pathname === '/' ? 'underline' : 'none',
            fontWeight: 'bold'
          })}
        >
          Internships
        </NavLink>
        <NavLink
          to="/jobs"
          style={({ isActive }) => ({
            color: isActive ? '#fff' : '#4da6ff',
            textDecoration: isActive ? 'underline' : 'none',
            fontWeight: 'bold'
          })}
        >
          Jobs
        </NavLink>
        <NavLink
          to="/problems"
          style={({ isActive }) => ({
            color: isActive ? '#fff' : '#4da6ff',
            textDecoration: isActive ? 'underline' : 'none',
            fontWeight: 'bold'
          })}
        >
          Problems
        </NavLink>
      </nav>

      <div className="home-content">
        <Outlet />
      </div>
    </section>
  )
}