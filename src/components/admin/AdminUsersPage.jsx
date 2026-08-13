import { useCallback, useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { FaPlus, FaSearch, FaEye, FaPencilAlt, FaTrashAlt } from 'react-icons/fa'
import { getUsers } from '../../api/admin'
import Pagination from '../Pagination'

const DEFAULT_COUNTS = { total: 0, admin: 0, user: 0, jobseeker: 0, company: 0 }

export default function AdminUsersPage({
  currentUser,
  handleCreateUser,
  handleUserUpdate,
  handleDelete,
}) {
  const [users, setUsers] = useState([])
  const [counts, setCounts] = useState(DEFAULT_COUNTS)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(true)

  const [userSearch, setUserSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(userSearch), 300)
    return () => clearTimeout(timer)
  }, [userSearch])

  const loadUsers = useCallback(async () => {
    setLoading(true)
    try {
      const params = {
        page,
        pageSize,
        search: debouncedSearch || undefined,
        role: roleFilter === 'all' ? undefined : roleFilter,
      }
      const { data } = await getUsers(params)
      setUsers(data.users || [])
      setTotal(data.total || 0)
      setTotalPages(data.totalPages || 1)
      setCounts(data.counts || DEFAULT_COUNTS)
    } catch (err) {
      console.error('Failed to load users:', err)
      setUsers([])
      setTotal(0)
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, debouncedSearch, roleFilter])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const handleSearchChange = (e) => {
    setUserSearch(e.target.value)
    setPage(1)
  }

  const handleRoleChange = (e) => {
    setRoleFilter(e.target.value)
    setPage(1)
  }

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value))
    setPage(1)
  }

  const handleCreate = async (userData) => {
    const ok = await handleCreateUser(userData)
    if (ok) {
      setPage(1)
      setUserSearch('')
      loadUsers()
    }
  }

  const handleUpdate = async (id, userData) => {
    const ok = await handleUserUpdate(id, userData)
    if (ok) loadUsers()
  }

  const handleRemove = async (user) => {
    await handleDelete(user)
    loadUsers()
  }

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
      confirmButtonColor: '#2196F3',
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
        handleCreate(result.value)
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
          <div style="margin-bottom: 8px;"><strong>Email Verified:</strong> ${u.emailVerified ? 'Verified' : 'Pending Verification'}</div>
          <div style="margin-bottom: 8px;"><strong>Registration Date:</strong> ${u.createdAt ? new Date(u.createdAt).toLocaleString() : 'N/A'}</div>
        </div>
      `,
      confirmButtonText: 'Close Details',
      confirmButtonColor: '#2196F3',
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
      confirmButtonColor: '#2196F3',
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
        handleUpdate(u.id, result.value)
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
              background: '#2196F3',
              color: '#fff',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 6px rgba(33, 150, 243, 0.35)',
            }}
            onClick={handleOpenAddAdminModal}
          >
            <span><FaPlus /> Add New Admin</span>
          </button>
          <div className="badge-stat badge-active">
            <span className="dot dot-active"></span>
            <span>TOTAL</span>
            <strong>{counts.total} Users</strong>
          </div>
          <div className="badge-stat">
            <span>ADMINS</span>
            <strong>{counts.admin}</strong>
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
              <span className="search-icon"><FaSearch /></span>
              <input
                type="text"
                className="compact-search-input"
                placeholder="Search user or email..."
                value={userSearch}
                onChange={handleSearchChange}
              />
            </div>

            <select
              className="role-select compact-role-select"
              value={roleFilter}
              onChange={handleRoleChange}
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="jobseeker">Job Seeker</option>
              <option value="company">Company</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="page-message">Loading users from database...</p>
        ) : users.length === 0 ? (
          <div className="empty-state-box">
            <p>No users found matching your search criteria.</p>
          </div>
        ) : (
          <>
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
                  {users.map((u) => {
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
                              <FaEye /> View
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
                              <FaPencilAlt /> Edit
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
                              onClick={() => handleRemove(u)}
                              title={isSelf ? 'Cannot delete own account' : 'Delete User'}
                            >
                              <FaTrashAlt /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={handlePageSizeChange}
            />
          </>
        )}
      </div>
    </div>
  )
}
