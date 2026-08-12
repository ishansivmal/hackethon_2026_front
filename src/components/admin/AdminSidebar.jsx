import { NavLink } from 'react-router-dom'

export default function AdminSidebar({
  users = [],
  companies = [],
  notifications = [],
  currentUser,
}) {
  const pendingCompaniesCount = companies.filter(
    (c) => c.status === 'Pending',
  ).length

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <span className="sidebar-brand-icon">⚡</span>
        <div>
          <h2 className="sidebar-title">Admin Hub</h2>
          <span className="sidebar-subtitle">Control Panel</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`
          }
        >
          <span className="sidebar-icon">📊</span>
          <span>Admin Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`
          }
        >
          <span className="sidebar-icon">👥</span>
          <span>User Management</span>
          <span className="sidebar-badge">{users.length}</span>
        </NavLink>

        <NavLink
          to="/admin/companies"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`
          }
        >
          <span className="sidebar-icon">🏢</span>
          <span>Company Management</span>
          {pendingCompaniesCount > 0 && (
            <span className="sidebar-badge badge-warning">
              {pendingCompaniesCount}
            </span>
          )}
        </NavLink>

        <NavLink
          to="/admin/reports"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`
          }
        >
          <span className="sidebar-icon">📈</span>
          <span>Reports</span>
        </NavLink>

        <NavLink
          to="/admin/notifications"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`
          }
        >
          <span className="sidebar-icon">🔔</span>
          <span>Notifications</span>
          <span className="sidebar-badge">{notifications.length}</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="admin-profile-pill">
          <span className="admin-avatar">
            {currentUser?.name?.[0] || 'A'}
          </span>
          <div className="admin-info">
            <span className="admin-name">{currentUser?.name}</span>
            <span className="admin-role">Administrator</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
