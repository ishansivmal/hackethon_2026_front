import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/useAuth'
import { getCompanyDashboard } from '../api/company'
import PostInternship from '../components/company/PostInternship'
import PostJob from '../components/company/PostJob'
import PostProblem from '../components/company/PostProblem'
import '../styles/CompanyDashboard.css'

// ─── Nav items config ─────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    id: 'internship',
    label: 'Post Internship',
    icon: '🎓',
    desc: 'Add an internship listing',
    color: '#2196F3',   /* theme accent */
  },
  {
    id: 'job',
    label: 'Post Job',
    icon: '💼',
    desc: 'Publish a job opening',
    color: '#2196F3',   /* theme accent */
  },
  {
    id: 'problem',
    label: 'Post Problem',
    icon: '🔬',
    desc: 'Submit a company challenge',
    color: '#2196F3',   /* theme accent */
  },
]

// ─── Sidebar nav item ─────────────────────────────────────────────────────────
function NavItem({ item, active, onClick }) {
  return (
    <button
      id={`cd-nav-${item.id}`}
      type="button"
      className={`cd-nav-item${active ? ' cd-nav-item--active' : ''}`}
      onClick={() => onClick(item.id)}
      style={{ '--item-color': item.color }}
    >
      <span className="cd-nav-icon">{item.icon}</span>
      <span className="cd-nav-text">
        <span className="cd-nav-label">{item.label}</span>
        <span className="cd-nav-desc">{item.desc}</span>
      </span>
      {active && <span className="cd-nav-arrow">›</span>}
    </button>
  )
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color }) {
  return (
    <div className="cd-stat-card" style={{ '--stat-color': color }}>
      <span className="cd-stat-icon">{icon}</span>
      <div>
        <p className="cd-stat-value">{value}</p>
        <p className="cd-stat-label">{label}</p>
      </div>
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function CompanyDashboard() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const welcomeShown = useRef(false)
  const [activeView, setActiveView] = useState('internship')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dashboard, setDashboard] = useState(null)

  const loadDashboard = useCallback(async () => {
    try {
      const { data } = await getCompanyDashboard()
      setDashboard(data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load dashboard data')
    }
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  useEffect(() => {
    if (!loading && !user) navigate('/login')
  }, [user, loading, navigate])

  useEffect(() => {
    if (user && !welcomeShown.current) {
      welcomeShown.current = true
      toast.success(`Welcome back, ${user.name}! 🎉`)
    }
  }, [user])

  if (loading) return <p className="page-message">Loading…</p>
  if (!user)   return null

  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'CO'

  const activeItem = NAV_ITEMS.find(n => n.id === activeView)

  const handleNav = (id) => {
    setActiveView(id)
    setSidebarOpen(false)
  }

  return (
    <div className="cd-shell">

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="cd-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ══════════════ SIDEBAR ══════════════ */}
      <aside className={`cd-sidebar${sidebarOpen ? ' cd-sidebar--open' : ''}`}>

        {/* Brand / profile */}
        <div className="cd-sidebar-brand">
          <div className="cd-avatar">{initials}</div>
          <div className="cd-brand-info">
            <p className="cd-brand-name">{user.name}</p>
            <p className="cd-brand-role">Company Account</p>
          </div>
        </div>

        <div className="cd-sidebar-divider" />

        {/* Navigation */}
        <p className="cd-sidebar-section-label">MANAGE</p>
        <nav className="cd-nav" role="navigation" aria-label="Dashboard navigation">
          {NAV_ITEMS.map(item => (
            <NavItem
              key={item.id}
              item={item}
              active={activeView === item.id}
              onClick={handleNav}
            />
          ))}
        </nav>

        {/* Footer status */}
        <div className="cd-sidebar-footer">
          <span className="cd-status-dot" />
          <span className="cd-status-label">Active</span>
        </div>
      </aside>

      {/* ══════════════ MAIN ══════════════ */}
      <div className="cd-main">

        {/* Top bar */}
        <header className="cd-topbar">
          {/* Mobile menu toggle */}
          <button
            id="cd-menu-toggle"
            type="button"
            className="cd-menu-toggle"
            onClick={() => setSidebarOpen(o => !o)}
            aria-label="Toggle sidebar"
          >
            <span /><span /><span />
          </button>

          <div className="cd-topbar-title">
            <span className="cd-topbar-icon">{activeItem?.icon}</span>
            <h1 className="cd-topbar-heading">{activeItem?.label}</h1>
          </div>

          <div className="cd-topbar-badge">
            <span className="cd-status-dot" />
            Active
          </div>
        </header>

        {/* Stats row */}
        <div className="cd-stats-row">
          <StatCard icon="🎓" label="Internships Posted" value={dashboard?.counts?.internships ?? 0} color="#0D47A1" />
          <StatCard icon="💼" label="Jobs Posted"        value={dashboard?.counts?.jobs ?? 0} color="#0D47A1" />
          <StatCard icon="🔬" label="Problems Submitted" value={dashboard?.counts?.problems ?? 0} color="#0D47A1" />
          <StatCard icon="📨" label="Total Applications" value={dashboard?.counts?.applications ?? 0} color="#0D47A1" />
        </div>

        {/* Content panel */}
        <div className="cd-content">
          {activeView === 'internship' && <PostInternship items={dashboard?.internships ?? []} onPosted={loadDashboard} />}
          {activeView === 'job'        && <PostJob        items={dashboard?.jobs ?? []}        onPosted={loadDashboard} />}
          {activeView === 'problem'    && <PostProblem    items={dashboard?.problems ?? []}    onPosted={loadDashboard} />}
        </div>

      </div>
    </div>
  )
}
