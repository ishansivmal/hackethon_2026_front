import { useState } from 'react'
import Swal from 'sweetalert2'

export default function AdminUsersPage({
  users,
  loadingUsers,
  currentUser,
  handleCreateUser,
  handleUserUpdate,
  handleDelete,
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

  // Create New Admin Modal via SweetAlert
  const handleOpenAddAdminModal = () => {
    Swal.fire({
      title: '<strong>Create New Admin Account</strong>',
      html: `
        <div style="text-align: left; font-size: 13px; font-family: inherit;">
          <label style="display: block; margin-bottom: 4px; font-weight: 600; color: #334155;">Full Name *</label>
          <input id="swal-create-name" class="swal2-input" placeholder="e.g. Admin Name" style="margin: 0 0 12px 0; width: 100%; box-sizing: border-box;">
          
          <label style="display: block; margin-bottom: 4px; font-weight: 600; color: #334155;">Email Address *</label>
          <input id="swal-create-email" type="email" class="swal2-input" placeholder="e.g. admin@example.com" style="margin: 0 0 12px 0; width: 100%; box-sizing: border-box;">
          
          <label style="display: block; margin-bottom: 4px; font-weight: 600; color: #334155;">Password *</label>
          <input id="swal-create-password" type="password" class="swal2-input" placeholder="Enter secure password" style="margin: 0 0 12px 0; width: 100%; box-sizing: border-box;">

          <label style="display: block; margin-bottom: 4px; font-weight: 600; color: #334155;">Account Role</label>
          <input class="swal2-input" value="admin" disabled style="margin: 0; width: 100%; box-sizing: border-box; background: #e2e8f0; color: #475569; font-weight: bold; cursor: not-allowed;">
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Create Admin',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#65DCD5',
      preConfirm: () => {
        const name = document.getElementById('swal-create-name').value
        const email = document.getElementById('swal-create-email').value
        const password = document.getElementById('swal-create-password').value

        if (!name || !name.trim()) {
          Swal.showValidationMessage('Please enter full name')
          return false
        }
        if (!email || !email.trim()) {
          Swal.showValidationMessage('Please enter email address')
          return false
        }
        if (!password || password.length < 6) {
          Swal.showValidationMessage('Password must be at least 6 characters')
          return false
        }

        return { name: name.trim(), email: email.trim(), password, role: 'admin' }
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        handleCreateUser(result.value)
      }
    })
  }

  // View User Modal via SweetAlert
  const handleViewUser = (u) => {
    Swal.fire({
      title: `<h3 style="margin: 0; color: #1e293b;">User Details #${u.id}</h3>`,
      icon: 'info',
      html: `
        <div style="text-align: left; font-size: 14px; line-height: 1.8; color: #334155; padding: 10px 0;">
          <div style="margin-bottom: 8px;"><strong>Database ID:</strong> #${u.id}</div>
          <div style="margin-bottom: 8px;"><strong>Full Name:</strong> ${u.name}</div>
          <div style="margin-bottom: 8px;"><strong>Email Address:</strong> ${u.email}</div>
          <div style="margin-bottom: 8px;"><strong>Fixed Role:</strong> <span style="text-transform: uppercase; font-weight: bold; background: rgba(20, 184, 166, 0.15); color: #0d9488; padding: 2px 8px; border-radius: 4px;">${u.role}</span></div>
          <div style="margin-bottom: 8px;"><strong>Email Verified:</strong> ${u.emailVerified ? '✅ Verified' : '⚠️ Pending Verification'}</div>
          <div style="margin-bottom: 8px;"><strong>Registration Date:</strong> ${u.createdAt ? new Date(u.createdAt).toLocaleString() : 'N/A'}</div>
        </div>
      `,
      confirmButtonText: 'Close Details',
      confirmButtonColor: '#65DCD5',
    })
  }

  // Edit User Name and Email Modal via SweetAlert
  const handleEditUser = (u) => {
    Swal.fire({
      title: `Edit User Details (#${u.id})`,
      html: `
        <div style="text-align: left; font-size: 13px; font-family: inherit;">
          <label style="display: block; margin-bottom: 4px; font-weight: 600; color: #334155;">Full Name</label>
          <input id="swal-edit-name" class="swal2-input" placeholder="Name" value="${u.name || ''}" style="margin: 0 0 14px 0; width: 100%; box-sizing: border-box;">
          
          <label style="display: block; margin-bottom: 4px; font-weight: 600; color: #334155;">Email Address</label>
          <input id="swal-edit-email" type="email" class="swal2-input" placeholder="Email" value="${u.email || ''}" style="margin: 0 0 14px 0; width: 100%; box-sizing: border-box;">
          
          <label style="display: block; margin-bottom: 4px; font-weight: 600; color: #334155;">System Role (Fixed)</label>
          <input class="swal2-input" value="${u.role}" disabled style="margin: 0; width: 100%; box-sizing: border-box; background: #e2e8f0; color: #475569; font-weight: bold; cursor: not-allowed;">
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Save to Database',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#65DCD5',
      preConfirm: () => {
        const name = document.getElementById('swal-edit-name').value
        const email = document.getElementById('swal-edit-email').value

        if (!name || !name.trim()) {
          Swal.showValidationMessage('Name is required')
          return false
        }
        if (!email || !email.trim()) {
          Swal.showValidationMessage('Email is required')
          return false
        }

        return { name: name.trim(), email: email.trim() }
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        handleUserUpdate(u.id, result.value)
      }
    })
  }

  return (
    <div className="tab-content">
      {/* Header section */}
      <div className="content-header align-center">
        <div>
          <h1>User Management</h1>
        </div>

        {/* Top-right summary badges + Add New Admin Button */}
        <div className="header-stat-badges" style={{ gap: '12px' }}>
          <button
            type="button"
            style={{
              font: 'inherit',
              fontSize: '13px',
              fontWeight: '600',
              padding: '8px 14px',
              borderRadius: '8px',
              border: 'none',
              background: '#65DCD5',
              color: '#0f172a',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 6px rgba(101, 220, 213, 0.25)',
            }}
            onClick={handleOpenAddAdminModal}
          >
            <span>➕ Add New Admin</span>
          </button>
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
              <option value="jobseeker">Job Seeker</option>
              <option value="company">Company</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {loadingUsers ? (
          <p className="page-message">Loading users from database...</p>
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
                  <th style={{ width: '28%' }}>USER NAME</th>
                  <th style={{ width: '38%' }}>EMAIL</th>
                  <th style={{ width: '16%' }}>ROLE</th>
                  <th style={{ textAlign: 'center', width: '180px' }}>ACTIONS</th>
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
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                          <button
                            type="button"
                            style={{
                              font: 'inherit',
                              fontSize: '12px',
                              fontWeight: '600',
                              padding: '5px 10px',
                              borderRadius: '6px',
                              border: '1px solid rgba(59, 130, 246, 0.3)',
                              background: 'rgba(59, 130, 246, 0.12)',
                              color: '#3b82f6',
                              cursor: 'pointer',
                            }}
                            onClick={() => handleViewUser(u)}
                            title="View User Details"
                          >
                            👁️ View
                          </button>
                          <button
                            type="button"
                            style={{
                              font: 'inherit',
                              fontSize: '12px',
                              fontWeight: '600',
                              padding: '5px 10px',
                              borderRadius: '6px',
                              border: '1px solid rgba(20, 184, 166, 0.3)',
                              background: 'rgba(20, 184, 166, 0.12)',
                              color: '#14b8a6',
                              cursor: 'pointer',
                            }}
                            onClick={() => handleEditUser(u)}
                            title="Edit User Details"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            type="button"
                            style={{
                              font: 'inherit',
                              fontSize: '12px',
                              fontWeight: '600',
                              padding: '5px 10px',
                              borderRadius: '6px',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              background: 'rgba(239, 68, 68, 0.12)',
                              color: '#ef4444',
                              cursor: isSelf ? 'not-allowed' : 'pointer',
                              opacity: isSelf ? 0.5 : 1,
                            }}
                            disabled={isSelf}
                            onClick={() => handleDelete(u)}
                            title={isSelf ? 'Cannot delete own account' : 'Delete User'}
                          >
                            🗑️ Delete
                          </button>
                        </div>
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
