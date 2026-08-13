import { useEffect, useState } from 'react'
import { Link, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/useAuth'
import { getAppliedRecord } from '../api/customerapi'
import UserInternships from '../components/customer/UserInternships'
import UserJobs from '../components/customer/UserJobs'
import UserProblems from '../components/customer/UserProblems'
import '../styles/CompanyDashboard.css'
import './UserPanel.css'

const NAV_ITEMS = [
  {
    id: 'internships',
    path: '/user-panel/internships',
    label: 'My Internships',
    desc: 'Internships you applied to',
    badge: 'IN',
  },
  {
    id: 'jobs',
    path: '/user-panel/jobs',
    label: 'My Jobs',
    desc: 'Jobs you applied to',
    badge: 'JB',
  },
  {
    id: 'problems',
    path: '/user-panel/problems',
    label: 'My Problems',
    desc: 'Problems you applied to',
    badge: 'PR',
  },
]

function NavItem({ item, active, onClick }) {
  return (
    <NavLink
      to={item.path}
      className={`cd-nav-item${active ? ' cd-nav-item--active' : ''}`}
      style={{ '--item-color': '#2196F3' }}
      onClick={onClick}
    >
      <span className="up-nav-badge">{item.badge}</span>
      <span className="cd-nav-text">
        <span className="cd-nav-label">{item.label}</span>
        <span className="cd-nav-desc">{item.desc}</span>
      </span>
      {active && <span className="cd-nav-arrow">›</span>}
    </NavLink>
  )
}

function StatCard({ badge, label, value, color }) {
  return (
    <div className="cd-stat-card" style={{ '--stat-color': color }}>
      <span className="up-stat-badge">{badge}</span>
      <div>
        <p className="cd-stat-value">{value}</p>
        <p className="cd-stat-label">{label}</p>
      </div>
    </div>
  )
}

function Overview() {
  return (
    <div className="cd-view">
      <div className="cd-view-header">
        <div className="cd-view-heading">
          <div>
            <h2 className="cd-view-title">Welcome to your dashboard</h2>
            <p className="cd-view-sub">
              Choose a section from the sidebar to review your applications and their status.
            </p>
          </div>
        </div>
      </div>

      <div className="up-overview-grid">
        {NAV_ITEMS.map((item) => (
          <Link key={item.id} to={item.path} className="cd-posted-card up-overview-card">
            <span className="up-nav-badge">{item.badge}</span>
            <div>
              <h4 className="cd-posted-name">{item.label}</h4>
              <p className="cd-app-email">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function UserPanel() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [counts, setCounts] = useState({ internships: 0, jobs: 0, problems: 0 })
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const { data } = await getAppliedRecord()
        setCounts({
          internships: data.internships?.length ?? 0,
          jobs: data.jobs?.length ?? 0,
          problems: data.problems?.length ?? 0,
        })
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load application counts')
      }
    }
    loadCounts()
  }, [])

  useEffect(() => {
    if (!loading && !user) navigate('/login')
  }, [user, loading, navigate])

  if (loading) return <p className="page-message">Loading...</p>
  if (!user) return null

  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'JS'

  const activeItem = NAV_ITEMS.find(n => n.path === location.pathname)
  const topbarTitle = activeItem ? activeItem.label : 'My Applications'

  const handleNav = () => setSidebarOpen(false)

  return (
    <div className="cd-shell">

      {sidebarOpen && (
        <div className="cd-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`cd-sidebar${sidebarOpen ? ' cd-sidebar--open' : ''}`}>
        <div className="cd-sidebar-brand">
          <div className="cd-avatar">{initials}</div>
          <div className="cd-brand-info">
            <p className="cd-brand-name">{user.name}</p>
            <p className="cd-brand-role">Job Seeker Account</p>
          </div>
        </div>

        <div className="cd-sidebar-divider" />

        <p className="cd-sidebar-section-label">MANAGE</p>
        <nav className="cd-nav" role="navigation" aria-label="User dashboard navigation">
          {NAV_ITEMS.map(item => (
            <NavItem
              key={item.id}
              item={item}
              active={location.pathname === item.path}
              onClick={handleNav}
            />
          ))}
        </nav>

        <div className="cd-sidebar-footer">
          <span className="cd-status-dot" />
          <span className="cd-status-label">Active</span>
        </div>
      </aside>

      <div className="cd-main">
        <header className="cd-topbar">
          <button
            type="button"
            className="cd-menu-toggle"
            onClick={() => setSidebarOpen(o => !o)}
            aria-label="Toggle sidebar"
          >
            <span /><span /><span />
          </button>

          <div className="cd-topbar-title">
            <h1 className="cd-topbar-heading">{topbarTitle}</h1>
          </div>

          <div className="cd-topbar-badge">
            <span className="cd-status-dot" />
            Active
          </div>
        </header>

        <div className="cd-stats-row">
          <StatCard badge="IN" label="Internships Applied" value={counts.internships} color="#0D47A1" />
          <StatCard badge="JB" label="Jobs Applied" value={counts.jobs} color="#0D47A1" />
          <StatCard badge="PR" label="Problems Applied" value={counts.problems} color="#0D47A1" />
        </div>

        <div className="cd-content">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="internships" element={<UserInternships />} />
            <Route path="jobs" element={<UserJobs />} />
            <Route path="problems" element={<UserProblems />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}
