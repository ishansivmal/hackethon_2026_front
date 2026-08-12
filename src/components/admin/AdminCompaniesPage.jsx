import { useState } from 'react'

export default function AdminCompaniesPage({
  companies,
  handleUpdateCompanyStatus,
}) {
  const [companyFilter, setCompanyFilter] = useState('all')

  const filteredCompanies = companies.filter((c) => {
    if (companyFilter === 'all') return true
    return c.status.toLowerCase() === companyFilter.toLowerCase()
  })

  const totalCompanies = companies.length
  const pendingCount = companies.filter((c) => c.status === 'Pending').length

  return (
    <div className="tab-content">
      {/* Header section */}
      <div className="content-header align-center">
        <div>
          <h1>Company Management</h1>
        </div>

        {/* Top-right summary badges */}
        <div className="header-stat-badges">
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
        <div className="card-header-flex">
          <div>
            <h3>Corporate Directory</h3>
          </div>

          <div className="company-tabs margin-bottom-none">
            {['all', 'pending', 'approved', 'suspended'].map((statusKey) => (
              <button
                key={statusKey}
                type="button"
                className={`admin-tab ${companyFilter === statusKey ? 'active' : ''}`}
                onClick={() => setCompanyFilter(statusKey)}
              >
                {statusKey.toUpperCase()} (
                {statusKey === 'all'
                  ? companies.length
                  : companies.filter((c) => c.status.toLowerCase() === statusKey)
                      .length}
                )
              </button>
            ))}
          </div>
        </div>

        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '22%' }}>COMPANY NAME</th>
                <th style={{ width: '28%' }}>EMAIL</th>
                <th style={{ width: '20%' }}>CATEGORY</th>
                <th style={{ width: '15%' }}>REGISTRATION DATE</th>
                <th style={{ width: '10%' }}>STATUS</th>
                <th style={{ textAlign: 'center', width: '120px' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((comp) => (
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
                  <td>{comp.category}</td>
                  <td>{comp.registeredDate}</td>
                  <td>
                    <span
                      className={`status-badge status-${comp.status.toLowerCase()}`}
                    >
                      {comp.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div className="action-btn-group justify-center">
                      {comp.status !== 'Approved' && (
                        <button
                          type="button"
                          className="btn btn-sm btn-success"
                          onClick={() =>
                            handleUpdateCompanyStatus(comp.id, 'Approved')
                          }
                        >
                          Approve
                        </button>
                      )}
                      {comp.status !== 'Suspended' && (
                        <button
                          type="button"
                          className="btn btn-sm btn-warning"
                          onClick={() =>
                            handleUpdateCompanyStatus(comp.id, 'Suspended')
                          }
                        >
                          Suspend
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
