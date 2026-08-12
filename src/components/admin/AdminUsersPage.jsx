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

  return (
    <div className="tab-content">
      <div className="content-header">
        <div>
          <h1>User Management</h1>
          <p className="subtitle">
            View, search, filter, update roles, or delete system user accounts.
          </p>
        </div>
      </div>

      {/* Filter controls */}
      <div className="filters-bar">
        <input
          type="text"
          className="form-input search-input"
          placeholder="Search by user name or email..."
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
        />
        <select
          className="role-select"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="company">Company</option>
        </select>
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
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Current Role</th>
                <th>Change Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => {
                const isSelf = u.id === currentUser?.id
                return (
                  <tr key={u.id}>
                    <td>#{u.id}</td>
                    <td>
                      <div className="user-table-cell">
                        <span className="user-avatar-sm">
                          {u.name?.[0] || 'U'}
                        </span>
                        <strong>{u.name}</strong>
                      </div>
                    </td>
                    <td className="email-col">{u.email}</td>
                    <td>
                      <span className={`role-badge role-badge-${u.role}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <select
                        className="role-select"
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
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger"
                        disabled={isSelf}
                        onClick={() => handleDelete(u)}
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
  )
}
