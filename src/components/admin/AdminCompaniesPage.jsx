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

  return (
    <div className="tab-content">
      <div className="content-header">
        <div>
          <h1>Company Management</h1>
          <p className="subtitle">
            Verify corporate recruiter profiles, manage approvals, and set account status.
          </p>
        </div>
      </div>

      <div className="company-tabs">
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

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Email</th>
              <th>Category</th>
              <th>Registration Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.map((comp) => (
              <tr key={comp.id}>
                <td>
                  <strong>{comp.name}</strong>
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
                <td>
                  <div className="action-btn-group">
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
  )
}
