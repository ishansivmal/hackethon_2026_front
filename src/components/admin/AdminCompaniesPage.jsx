import { useState } from 'react'
import Swal from 'sweetalert2'

const STATUS_CONFIG = {
  all: { label: 'ALL', icon: '🏢', color: '#65DCD5', bg: 'rgba(101, 220, 213, 0.15)', border: 'rgba(101, 220, 213, 0.4)' },
  pending: { label: 'PENDING', icon: '⏳', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.4)' },
  approved: { label: 'APPROVED', icon: '✅', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.4)' },
  suspended: { label: 'SUSPENDED', icon: '⛔', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.4)' },
}

export default function AdminCompaniesPage({
  companies,
  loadingCompanies,
  handleUpdateCompany,
  handleDeleteCompany,
}) {
  const [companyFilter, setCompanyFilter] = useState('all')

  const filteredCompanies = companies.filter((c) => {
    if (companyFilter === 'all') return true
    return (c.status || '').toLowerCase() === companyFilter.toLowerCase()
  })

  const totalCompanies = companies.length
  const pendingCount = companies.filter((c) => (c.status || '').toLowerCase() === 'pending').length

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  // View Company Details Modal via SweetAlert
  const handleViewCompany = (c) => {
    Swal.fire({
      title: `<h3 style="margin: 0; color: #1e293b;">🏢 ${c.name}</h3>`,
      icon: 'info',
      html: `
        <div style="text-align: left; font-size: 14px; line-height: 1.8; color: #334155; padding: 10px 0;">
          <div style="margin-bottom: 8px;"><strong>Company Name:</strong> ${c.name}</div>
          <div style="margin-bottom: 8px;"><strong>Contact Email:</strong> ${c.email}</div>
          <div style="margin-bottom: 8px;"><strong>Category:</strong> ${c.category || 'N/A'}</div>
          <div style="margin-bottom: 8px;"><strong>Status:</strong> <span style="font-weight: bold; text-transform: uppercase;">${c.status}</span></div>
          <div style="margin-bottom: 8px;"><strong>Location:</strong> ${c.location || 'N/A'}</div>
          <div style="margin-bottom: 8px;"><strong>Website:</strong> ${c.website ? `<a href="${c.website}" target="_blank" rel="noopener noreferrer">${c.website}</a>` : 'N/A'}</div>
          <div style="margin-bottom: 8px;"><strong>Registered Date:</strong> ${formatDate(c.createdAt || c.registeredDate)}</div>
        </div>
      `,
      confirmButtonText: 'Close Details',
      confirmButtonColor: '#65DCD5',
    })
  }

  // Edit Company Details Modal via SweetAlert
  const handleEditCompany = (c) => {
    Swal.fire({
      title: `Edit Company (${c.name})`,
      html: `
        <div style="text-align: left; font-size: 13px; font-family: inherit;">
          <label style="display: block; margin-bottom: 4px; font-weight: 600; color: #334155;">Company Name</label>
          <input id="swal-edit-company-name" class="swal2-input" value="${c.name || ''}" style="margin: 0 0 10px 0; width: 100%; box-sizing: border-box;">
          
          <label style="display: block; margin-bottom: 4px; font-weight: 600; color: #334155;">Email Address</label>
          <input id="swal-edit-company-email" type="email" class="swal2-input" value="${c.email || ''}" style="margin: 0 0 10px 0; width: 100%; box-sizing: border-box;">
          
          <label style="display: block; margin-bottom: 4px; font-weight: 600; color: #334155;">Category</label>
          <input id="swal-edit-company-category" class="swal2-input" value="${c.category || 'Software & IT'}" style="margin: 0 0 10px 0; width: 100%; box-sizing: border-box;">

          <label style="display: block; margin-bottom: 4px; font-weight: 600; color: #334155;">Status</label>
          <select id="swal-edit-company-status" class="swal2-input" style="margin: 0 0 10px 0; width: 100%; box-sizing: border-box;">
            <option value="Pending" ${c.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Approved" ${c.status === 'Approved' ? 'selected' : ''}>Approved</option>
            <option value="Suspended" ${c.status === 'Suspended' ? 'selected' : ''}>Suspended</option>
          </select>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Save to Database',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#65DCD5',
      preConfirm: () => {
        const name = document.getElementById('swal-edit-company-name').value
        const email = document.getElementById('swal-edit-company-email').value
        const category = document.getElementById('swal-edit-company-category').value
        const status = document.getElementById('swal-edit-company-status').value

        if (!name || !name.trim()) {
          Swal.showValidationMessage('Company name is required')
          return false
        }
        if (!email || !email.trim()) {
          Swal.showValidationMessage('Company email is required')
          return false
        }

        return { name: name.trim(), email: email.trim(), category, status }
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        handleUpdateCompany(c.id, result.value)
      }
    })
  }

  const onAttemptDelete = (c) => {
    if ((c.status || '').toLowerCase() !== 'pending') {
      Swal.fire({
        title: 'Action Restricted',
        text: 'Only pending companies can be deleted. Approved or suspended companies cannot be deleted.',
        icon: 'warning',
        confirmButtonColor: '#65DCD5',
      })
      return
    }
    handleDeleteCompany(c)
  }

  return (
    <div className="tab-content">
      {/* Header section */}
      <div className="content-header align-center">
        <div>
          <h1>Company Management</h1>
        </div>

        {/* Top-right summary badges */}
        <div className="header-stat-badges" style={{ gap: '12px' }}>
          <div className="badge-stat badge-active">
            <span className="dot dot-active"></span>
            <span>TOTAL</span>
            <strong>{totalCompanies} Companies</strong>
          </div>
          {pendingCount > 0 && (
            <div className="badge-stat badge-warning-stat">
              <span>PENDING</span>
              <strong>{pendingCount}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Main Dashboard Card Container */}
      <div className="dashboard-card">
        <div className="card-header-flex" style={{ justifyContent: 'flex-end', marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {['all', 'pending', 'approved', 'suspended'].map((statusKey) => {
              const cfg = STATUS_CONFIG[statusKey]
              const isActive = companyFilter === statusKey
              const count =
                statusKey === 'all'
                  ? companies.length
                  : companies.filter((c) => (c.status || '').toLowerCase() === statusKey).length

              return (
                <button
                  key={statusKey}
                  type="button"
                  onClick={() => setCompanyFilter(statusKey)}
                  style={{
                    fontFamily: 'inherit',
                    fontSize: '12px',
                    fontWeight: '700',
                    padding: '7px 14px',
                    borderRadius: '20px',
                    border: `1px solid ${isActive ? cfg.border : 'rgba(255, 255, 255, 0.1)'}`,
                    background: isActive ? cfg.bg : 'rgba(255, 255, 255, 0.04)',
                    color: isActive ? cfg.color : '#94a3b8',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? `0 2px 8px ${cfg.bg}` : 'none',
                    transform: isActive ? 'scale(1.03)' : 'scale(1)',
                  }}
                >
                  <span>{cfg.icon}</span>
                  <span>{cfg.label}</span>
                  <span
                    style={{
                      background: isActive ? cfg.color : 'rgba(255, 255, 255, 0.1)',
                      color: isActive ? '#0f172a' : '#cbd5e1',
                      padding: '1px 7px',
                      borderRadius: '10px',
                      fontSize: '11px',
                      fontWeight: '800',
                    }}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {loadingCompanies ? (
          <p className="page-message">Loading corporate directory from database...</p>
        ) : filteredCompanies.length === 0 ? (
          <div className="empty-state-box">
            <p>No companies found in database matching status criteria.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '20%' }}>COMPANY NAME</th>
                  <th style={{ width: '26%' }}>EMAIL</th>
                  <th style={{ width: '16%' }}>CATEGORY</th>
                  <th style={{ width: '18%', paddingRight: '24px', whiteSpace: 'nowrap' }}>REGISTRATION DATE</th>
                  <th style={{ width: '12%', paddingLeft: '24px', whiteSpace: 'nowrap' }}>STATUS</th>
                  <th style={{ textAlign: 'center', width: '170px' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.map((comp) => {
                  const isPending = (comp.status || '').toLowerCase() === 'pending'

                  return (
                    <tr key={comp.id}>
                      <td>
                        <div className="user-table-cell">
                          <span className="user-avatar-sm company-avatar">
                            🏢
                          </span>
                          <strong className="user-display-name">{comp.name}</strong>
                        </div>
                      </td>
                      <td className="email-col">{comp.email}</td>
                      <td>{comp.category || 'Software & IT'}</td>
                      <td style={{ paddingRight: '24px', whiteSpace: 'nowrap' }}>{formatDate(comp.createdAt || comp.registeredDate)}</td>
                      <td style={{ paddingLeft: '24px' }}>
                        <span
                          className={`status-badge status-${(comp.status || 'pending').toLowerCase()}`}
                        >
                          {comp.status}
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
                            onClick={() => handleViewCompany(comp)}
                            title="View Company Details"
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
                            onClick={() => handleEditCompany(comp)}
                            title="Edit Company Details"
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
                              border: isPending ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(148, 163, 184, 0.2)',
                              background: isPending ? 'rgba(239, 68, 68, 0.12)' : 'rgba(148, 163, 184, 0.08)',
                              color: isPending ? '#ef4444' : '#64748b',
                              cursor: isPending ? 'pointer' : 'not-allowed',
                              opacity: isPending ? 1 : 0.45,
                            }}
                            onClick={() => onAttemptDelete(comp)}
                            title={isPending ? 'Delete Pending Company' : 'Only pending companies can be deleted'}
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
