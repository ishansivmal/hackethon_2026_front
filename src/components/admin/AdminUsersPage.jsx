import { useState } from 'react'

export default function AdminUsersPage({
  users,
  loadingUsers,
  currentUser,
  handleRoleChange,
  handleDelete,
  pendingRoles,
}) {
  const [userSearch, setUserSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase())
    const matchesRole = roleFilter === 'all' || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  const totalCount = users.length
  const adminCount = users.filter((u) => u.role === 'admin').length

  return (
    <div className="tab-content">
      {/* Header section */}
      <div className="content-header align-center">
        <div>
          <h1>User Management</h1>
        </div>

        {/* Top-right summary badges */}
        <div className="header-stat-badges">
          <div className="badge-stat badge-active">
            <span className="dot dot-active"></span>
            <span>TOTAL</span>
            <strong>{totalCount} Users</strong>
          </div>
          <div className="badge-stat">
            <span>ADMINS</span>
            <strong>{adminCount}</strong>
          </div>
        </div>
      </div>

      {/* Main Dashboard Card Container */}
      <div className="dashboard-card">
        <div className="card-header-flex">
          <div>
            <h3>All Registered Users</h3>
          </div>

          {/* Compact Search & Filter Toolbar */}
          <div className="filters-bar compact-filters margin-bottom-none">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="compact-search-input"
                placeholder="Search user or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>

            <select
              className="role-select compact-role-select"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="company">Company</option>
            </select>
          </div>
        </div>

        {loadingUsers ? (
          <p className="page-message">Loading system users...</p>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-state-box">
            <p>No users found matching your search criteria.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '70px' }}>ID</th>
                  <th style={{ width: '22%' }}>USER NAME</th>
                  <th style={{ width: '35%' }}>EMAIL</th>
                  <th style={{ width: '13%' }}>ROLE</th>
                  <th style={{ width: '15%' }}>CHANGE ROLE</th>
                  <th style={{ textAlign: 'center', width: '100px' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const isSelf = u.id === currentUser?.id
                  return (
                    <tr key={u.id}>
                      <td>
                        <span className="id-tag">#{u.id}</span>
                      </td>
                      <td>
                        <div className="user-table-cell">
                          <span className="user-avatar-sm">
                            {u.name?.[0] || 'U'}
                          </span>
                          <strong className="user-display-name">{u.name}</strong>
                        </div>
                      </td>
                      <td className="email-col">{u.email}</td>
                      <td>
                        <span className={`role-badge role-badge-${u.role}`}>
                          {(u.role || 'user').toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <select
                          className="role-select table-role-select"
                          value={pendingRoles[u.id] ?? u.role}
                          disabled={isSelf}
                          onChange={(event) =>
                            handleRoleChange(u.id, event.target.value)
                          }
                        >
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                          <option value="company">company</option>
                        </select>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm btn-delete-action"
                          disabled={isSelf}
                          onClick={() => handleDelete(u)}
                          title={isSelf ? 'Cannot delete your own account' : 'Delete user'}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
