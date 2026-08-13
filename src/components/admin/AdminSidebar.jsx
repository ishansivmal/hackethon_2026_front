import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

export default function AdminSidebar({ currentUser }) {
  const [avatarUrl, setAvatarUrl] = useState(() => {
    return localStorage.getItem('admin_avatar_url') || currentUser?.avatarUrl || ''
  })

  useEffect(() => {
    const handleAvatarChange = () => {
      setAvatarUrl(localStorage.getItem('admin_avatar_url') || currentUser?.avatarUrl || '')
    }
    window.addEventListener('admin_avatar_changed', handleAvatarChange)
    return () => window.removeEventListener('admin_avatar_changed', handleAvatarChange)
  }, [currentUser])

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
        </NavLink>

        <NavLink
          to="/admin/companies"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`
          }
        >
          <span className="sidebar-icon">🏢</span>
          <span>Company Management</span>
        </NavLink>

        <NavLink
          to="/admin/notifications"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`
          }
        >
          <span className="sidebar-icon">🔔</span>
          <span>Notifications</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="admin-profile-pill">
          <span className="admin-avatar" style={{ overflow: 'hidden', padding: 0 }}>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={currentUser?.name || 'Admin'}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
              />
            ) : (
              currentUser?.name?.[0] || 'A'
            )}
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
