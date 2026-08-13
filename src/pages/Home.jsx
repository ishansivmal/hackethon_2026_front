import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { FaGraduationCap, FaBriefcase, FaPuzzlePiece, FaMagic } from 'react-icons/fa'
import './Home.css'

const TABS = [
  { to: '/internships', label: 'Internships', icon: <FaGraduationCap /> },
  { to: '/jobs', label: 'Jobs', icon: <FaBriefcase /> },
  { to: '/problems', label: 'Problems', icon: <FaPuzzlePiece /> },
]

export default function Home() {
  const location = useLocation()

  return (
    <section className="customer-layout">
      <header className="home-hero">
        <span className="home-badge"><FaMagic /> Opportunity Hub</span>
        <h1 className="home-title">Discover Opportunities</h1>
        <p className="home-subtitle">
          Explore the latest internships, jobs, and coding challenges tailored for you.
        </p>
      </header>

      <nav className="home-nav-container">
        {TABS.map((tab) => {
          const isActive =
            location.pathname === tab.to ||
            (location.pathname === '/' && tab.to === '/internships')

          return (
            <NavLink key={tab.to} to={tab.to} className={`home-nav-link ${isActive ? 'active' : ''}`}>
              <span className="home-tab-icon">{tab.icon}</span>
              <span className="home-tab-text">{tab.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="home-content-wrapper">
        <Outlet />
      </div>
    </section>
  )
}
