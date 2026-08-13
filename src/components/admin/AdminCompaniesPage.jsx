import { useCallback, useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import {
  FaBuilding,
  FaHourglassHalf,
  FaCheckCircle,
  FaBan,
  FaEye,
  FaPencilAlt,
  FaTrashAlt,
  FaRecycle,
} from 'react-icons/fa'
import { getCompanies } from '../../api/admin'
import Pagination from '../Pagination'

const STATUS_CONFIG = {
  all: { label: 'ALL', icon: <FaBuilding />, color: '#2196F3', bg: 'rgba(33, 150, 243, 0.12)', border: 'rgba(33, 150, 243, 0.4)' },
  pending: { label: 'PENDING', icon: <FaHourglassHalf />, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.4)' },
  approved: { label: 'APPROVED', icon: <FaCheckCircle />, color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.4)' },
  suspended: { label: 'SUSPENDED', icon: <FaBan />, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.4)' },
}

const DEFAULT_COUNTS = { total: 0, pending: 0, approved: 0, suspended: 0 }

export default function AdminCompaniesPage({
  handleCreateCompany,
  handleUpdateCompany,
  handleDeleteCompany,
  handleUpdateCompanyStatus,
}) {
  const [companies, setCompanies] = useState([])
  const [counts, setCounts] = useState(DEFAULT_COUNTS)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(true)

  const [companyFilter, setCompanyFilter] = useState('all')

  const loadCompanies = useCallback(async () => {
    setLoading(true)
    try {
      const params = {
        page,
        pageSize,
        status: companyFilter === 'all' ? undefined : companyFilter,
      }
      const { data } = await getCompanies(params)
      setCompanies(data.companies || [])
      setTotal(data.total || 0)
      setTotalPages(data.totalPages || 1)
      setCounts(data.counts || DEFAULT_COUNTS)
    } catch (err) {
      console.error('Failed to load companies:', err)
      setCompanies([])
      setTotal(0)
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, companyFilter])

  useEffect(() => {
    loadCompanies()
  }, [loadCompanies])

  const handleFilterChange = (statusKey) => {
    setCompanyFilter(statusKey)
    setPage(1)
  }

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value))
    setPage(1)
  }

  const handleCreate = async (companyData) => {
    const ok = await handleCreateCompany(companyData)
    if (ok) {
      setPage(1)
      loadCompanies()
    }
  }

  const handleUpdate = async (id, companyData) => {
    const ok = await handleUpdateCompany(id, companyData)
    if (ok) loadCompanies()
  }

  const handleUpdateStatus = async (id, status) => {
    await handleUpdateCompanyStatus(id, status)
    loadCompanies()
  }

  const handleRemove = async (company) => {
    await handleDeleteCompany(company)
    loadCompanies()
  }

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
      title: `<h3 style="margin: 0; color: #1e293b;">${c.name}</h3>`,
      icon: 'info',
      html: `
        <div style="text-align: left; font-size: 14px; line-height: 1.8; color: #334155; padding: 10px 0;">
          <div style="margin-bottom: 8px;"><strong>Company Name:</strong> ${c.name}</div>
          <div style="margin-bottom: 8px;"><strong>Contact Email:</strong> ${c.email}</div>
          <div style="margin-bottom: 8px;"><strong>Category:</strong> ${c.category || 'N/A'}</div>
          <div style="margin-bottom: 8px;"><strong>Status:</strong> <span style="font-weight: bold; text-transform: uppercase;">${c.status}</span></div>
          <div style="margin-bottom: 8px;"><strong>Location:</strong> ${c.location || 'N/A'}</div>
          <div style="margin-bottom: 8px;"><strong>Website:</strong> ${c.website ? `<a href="${c.website}" target="_blank" rel="noopener noreferrer">${c.website}</a>` : 'N/A'}</div>
          <div style="margin-bottom: 8px;"><strong>Description:</strong> ${c.description || 'N/A'}</div>
          <div style="margin-bottom: 8px;"><strong>Registered Date:</strong> ${formatDate(c.createdAt || c.registeredDate)}</div>
        </div>
      `,
      confirmButtonText: 'Close Details',
      confirmButtonColor: '#2196F3',
    })
  }

  // Create New Company Modal via SweetAlert
  const handleCreateCompanyModal = () => {
    Swal.fire({
      title: 'Create New Company',
      html: `
        <div style="text-align: left; font-size: 13px; font-family: inherit;">
          <label style="display: block; margin-bottom: 4px; font-weight: 600; color: #334155;">Company Name *</label>
          <input id="swal-new-company-name" class="swal2-input" placeholder="e.g. Acme Corp" style="margin: 0 0 10px 0; width: 100%; box-sizing: border-box;">

          <label style="display: block; margin-bottom: 4px; font-weight: 600; color: #334155;">Email Address *</label>
          <input id="swal-new-company-email" type="email" class="swal2-input" placeholder="contact@acme.com" style="margin: 0 0 10px 0; width: 100%; box-sizing: border-box;">

          <label style="display: block; margin-bottom: 4px; font-weight: 600; color: #334155;">Category</label>
          <input id="swal-new-company-category" class="swal2-input" value="Software & IT" style="margin: 0 0 10px 0; width: 100%; box-sizing: border-box;">

          <label style="display: block; margin-bottom: 4px; font-weight: 600; color: #334155;">Website</label>
          <input id="swal-new-company-website" class="swal2-input" placeholder="https://acme.com" style="margin: 0 0 10px 0; width: 100%; box-sizing: border-box;">

          <label style="display: block; margin-bottom: 4px; font-weight: 600; color: #334155;">Location</label>
          <input id="swal-new-company-location" class="swal2-input" placeholder="City, Country" style="margin: 0 0 10px 0; width: 100%; box-sizing: border-box;">

          <label style="display: block; margin-bottom: 4px; font-weight: 600; color: #334155;">Status</label>
          <select id="swal-new-company-status" class="swal2-input" style="margin: 0 0 10px 0; width: 100%; box-sizing: border-box;">
            <option value="Pending" selected>Pending</option>
            <option value="Approved">Approved</option>
            <option value="Suspended">Suspended</option>
          </select>

          <label style="display: block; margin-bottom: 4px; font-weight: 600; color: #334155;">Description</label>
          <textarea id="swal-new-company-description" class="swal2-input" rows="3" placeholder="Short company description" style="margin: 0; width: 100%; box-sizing: border-box; resize: vertical;"></textarea>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Create Company',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#2196F3',
      preConfirm: () => {
        const name = document.getElementById('swal-new-company-name').value
        const email = document.getElementById('swal-new-company-email').value
        const category = document.getElementById('swal-new-company-category').value
        const status = document.getElementById('swal-new-company-status').value
        const website = document.getElementById('swal-new-company-website').value
        const location = document.getElementById('swal-new-company-location').value
        const description = document.getElementById('swal-new-company-description').value

        if (!name || !name.trim()) {
          Swal.showValidationMessage('Company name is required')
          return false
        }
        if (!email || !email.trim()) {
          Swal.showValidationMessage('Company email is required')
          return false
        }

        return {
          name: name.trim(),
          email: email.trim(),
          category: category.trim() || 'Software & IT',
          status,
          website: website.trim(),
          location: location.trim(),
          description: description.trim(),
        }
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        handleCreate(result.value)
      }
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

          <label style="display: block; margin-bottom: 4px; font-weight: 600; color: #334155;">Website</label>
          <input id="swal-edit-company-website" class="swal2-input" value="${c.website || ''}" style="margin: 0 0 10px 0; width: 100%; box-sizing: border-box;">

          <label style="display: block; margin-bottom: 4px; font-weight: 600; color: #334155;">Location</label>
          <input id="swal-edit-company-location" class="swal2-input" value="${c.location || ''}" style="margin: 0 0 10px 0; width: 100%; box-sizing: border-box;">

          <label style="display: block; margin-bottom: 4px; font-weight: 600; color: #334155;">Status</label>
          <select id="swal-edit-company-status" class="swal2-input" style="margin: 0 0 10px 0; width: 100%; box-sizing: border-box;">
            <option value="Pending" ${c.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Approved" ${c.status === 'Approved' ? 'selected' : ''}>Approved</option>
            <option value="Suspended" ${c.status === 'Suspended' ? 'selected' : ''}>Suspended</option>
          </select>

          <label style="display: block; margin-bottom: 4px; font-weight: 600; color: #334155;">Description</label>
          <textarea id="swal-edit-company-description" class="swal2-input" rows="3" style="margin: 0; width: 100%; box-sizing: border-box; resize: vertical;">${c.description || ''}</textarea>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Save to Database',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#2196F3',
      preConfirm: () => {
        const name = document.getElementById('swal-edit-company-name').value
        const email = document.getElementById('swal-edit-company-email').value
        const category = document.getElementById('swal-edit-company-category').value
        const status = document.getElementById('swal-edit-company-status').value
        const website = document.getElementById('swal-edit-company-website').value
        const location = document.getElementById('swal-edit-company-location').value
        const description = document.getElementById('swal-edit-company-description').value

        if (!name || !name.trim()) {
          Swal.showValidationMessage('Company name is required')
          return false
        }
        if (!email || !email.trim()) {
          Swal.showValidationMessage('Company email is required')
          return false
        }

        return {
          name: name.trim(),
          email: email.trim(),
          category,
          status,
          website: website.trim(),
          location: location.trim(),
          description: description.trim(),
        }
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        handleUpdate(c.id, result.value)
      }
    })
  }

  const onAttemptDelete = (c) => {
    if ((c.status || '').toLowerCase() !== 'pending') {
      Swal.fire({
        title: 'Action Restricted',
        text: 'Only pending companies can be deleted. Approved or suspended companies cannot be deleted.',
        icon: 'warning',
        confirmButtonColor: '#2196F3',
      })
      return
    }
    handleRemove(c)
  }

  const onSuspendCompany = (c) => {
    Swal.fire({
      title: 'Suspend company?',
      text: `Suspend "${c.name}"? It will be flagged as Suspended until restored.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, suspend',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        handleUpdateStatus(c.id, 'Suspended')
      }
    })
  }

  const onRestoreCompany = (c) => {
    Swal.fire({
      title: 'Restore company?',
      text: `Approve "${c.name}" again and remove its suspension?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, restore',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        handleUpdateStatus(c.id, 'Approved')
      }
    })
  }

  return (
    <div className="tab-content">
      {/* Header section */}
      <div className="content-header align-center">
        <div>
          <h1>Company Management</h1>
        </div>

        {/* Top-right summary badges + Add Company Button */}
        <div className="header-stat-badges" style={{ gap: '12px' }}>
          <div className="badge-stat badge-active">
            <span className="dot dot-active"></span>
            <span>TOTAL</span>
            <strong>{counts.total} Companies</strong>
          </div>
          {counts.pending > 0 && (
            <div className="badge-stat badge-warning-stat">
              <span>PENDING</span>
              <strong>{counts.pending}</strong>
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
              const count = statusKey === 'all' ? counts.total : counts[statusKey] || 0

              return (
                <button
                  key={statusKey}
                  type="button"
                  onClick={() => handleFilterChange(statusKey)}
                  style={{
                    fontFamily: 'inherit',
                    fontSize: '12px',
                    fontWeight: '700',
                    padding: '7px 14px',
                    borderRadius: '20px',
                    border: `1px solid ${isActive ? cfg.border : 'rgba(13, 71, 161, 0.12)'}`,
                    background: isActive ? cfg.bg : 'rgba(227, 242, 253, 0.55)',
                    color: isActive ? cfg.color : 'var(--text)',
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
                      background: isActive ? cfg.color : 'rgba(227, 242, 253, 0.8)',
                      color: isActive ? '#fff' : 'var(--text)',
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

        {loading ? (
          <p className="page-message">Loading corporate directory from database...</p>
        ) : companies.length === 0 ? (
          <div className="empty-state-box">
            <p>No companies found in database matching status criteria.</p>
          </div>
        ) : (
          <>
            <div className="table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '20%' }}>COMPANY NAME</th>
                    <th style={{ width: '26%' }}>EMAIL</th>
                    <th style={{ width: '16%' }}>CATEGORY</th>
                    <th style={{ width: '18%', paddingRight: '24px', whiteSpace: 'nowrap' }}>REGISTRATION DATE</th>
                    <th style={{ width: '12%', paddingLeft: '24px', whiteSpace: 'nowrap' }}>STATUS</th>
                    <th style={{ textAlign: 'center', width: '200px' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((comp) => {
                    const isPending = (comp.status || '').toLowerCase() === 'pending'
                    const isApproved = (comp.status || '').toLowerCase() === 'approved'
                    const isSuspended = (comp.status || '').toLowerCase() === 'suspended'

                    return (
                      <tr key={comp.id}>
                        <td>
                          <div className="user-table-cell">
                            <span className="user-avatar-sm company-avatar">
                              <FaBuilding />
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
                                whiteSpace: 'nowrap',
                              }}
                              onClick={() => handleViewCompany(comp)}
                              title="View Company Details"
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
                                whiteSpace: 'nowrap',
                              }}
                              onClick={() => handleEditCompany(comp)}
                              title="Edit Company Details"
                            >
                              <FaPencilAlt /> Edit
                            </button>
                            {isPending ? (
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
                                  cursor: 'pointer',
                                  whiteSpace: 'nowrap',
                                }}
                                onClick={() => onAttemptDelete(comp)}
                                title="Delete Pending Company"
                              >
                                <FaTrashAlt /> Delete
                              </button>
                            ) : isApproved ? (
                              <button
                                type="button"
                                style={{
                                  font: 'inherit',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  padding: '5px 10px',
                                  borderRadius: '6px',
                                  border: '1px solid rgba(245, 158, 11, 0.4)',
                                  background: 'rgba(245, 158, 11, 0.12)',
                                  color: '#f59e0b',
                                  cursor: 'pointer',
                                  whiteSpace: 'nowrap',
                                }}
                                onClick={() => onSuspendCompany(comp)}
                                title="Suspend Approved Company"
                              >
                                <FaBan /> Suspend
                              </button>
                            ) : isSuspended ? (
                              <button
                                type="button"
                                style={{
                                  font: 'inherit',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  padding: '5px 10px',
                                  borderRadius: '6px',
                                  border: '1px solid rgba(16, 185, 129, 0.3)',
                                  background: 'rgba(16, 185, 129, 0.12)',
                                  color: '#10b981',
                                  cursor: 'pointer',
                                  whiteSpace: 'nowrap',
                                }}
                                onClick={() => onRestoreCompany(comp)}
                                title="Restore Suspended Company"
                              >
                                <FaRecycle /> Restore
                              </button>
                            ) : (
                              <button
                                type="button"
                                style={{
                                  font: 'inherit',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  padding: '5px 10px',
                                  borderRadius: '6px',
                                  border: '1px solid rgba(148, 163, 184, 0.2)',
                                  background: 'rgba(148, 163, 184, 0.08)',
                                  color: '#64748b',
                                  cursor: 'not-allowed',
                                  opacity: 0.45,
                                  whiteSpace: 'nowrap',
                                }}
                                onClick={() => onAttemptDelete(comp)}
                                title="Only pending companies can be deleted"
                              >
                                <FaTrashAlt /> Delete
                              </button>
                            )}
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
