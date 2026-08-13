import { Link } from 'react-router-dom'
import {
  FaSync,
  FaUsers,
  FaUser,
  FaBuilding,
  FaBolt,
  FaHourglassHalf,
  FaBullhorn,
  FaChartBar,
} from 'react-icons/fa'

export default function AdminDashboardView({
  users,
  companies,
  loadingUsers,
  fetchUsers,
  currentUser,
}) {
  const totalUsersCount = users.length
  const adminCount = users.filter((u) => u.role === 'admin').length
  const normalUserCount = users.filter(
    (u) => u.role === 'user' || u.role === 'jobseeker',
  ).length
  const companyUserCount = users.filter((u) => u.role === 'company').length
  const pendingApprovalsCount =
    companies.filter((c) => c.status === 'Pending').length + 2

  return (
    <div className="tab-content">
      <div className="content-header align-center">
        <div>
          <h1>Admin Dashboard</h1>
        </div>
        <button type="button" className="btn btn-outline" onClick={fetchUsers}>
          <FaSync /> Refresh Data
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon-blue"><FaUsers /></div>
          <div className="stat-details">
            <span className="stat-label">Total Users</span>
            <span className="stat-value">{totalUsersCount}</span>
            <span className="stat-subtext">Registered across platform</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-green"><FaUser /></div>
          <div className="stat-details">
            <span className="stat-label">Normal Users / Seekers</span>
            <span className="stat-value">{normalUserCount}</span>
            <span className="stat-subtext">Active candidates</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-purple"><FaBuilding /></div>
          <div className="stat-details">
            <span className="stat-label">Companies</span>
            <span className="stat-value">
              {companyUserCount + companies.length}
            </span>
            <span className="stat-subtext">
              {companies.filter((c) => c.status === 'Approved').length} verified
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-teal"><FaBolt /></div>
          <div className="stat-details">
            <span className="stat-label">Admin Accounts</span>
            <span className="stat-value">{adminCount}</span>
            <span className="stat-subtext">System administrators</span>
          </div>
        </div>

        <div className="stat-card stat-card-highlight">
          <div className="stat-icon stat-icon-orange"><FaHourglassHalf /></div>
          <div className="stat-details">
            <span className="stat-label">Pending Approvals</span>
            <span className="stat-value">{pendingApprovalsCount}</span>
            <span className="stat-subtext">Requires review</span>
          </div>
        </div>
      </div>

      {/* Distribution & Quick Actions */}
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>User Role Distribution</h3>
          <p className="card-subtitle">Proportion of account types on the platform</p>

          <div className="distribution-bar">
            <div
              className="bar-segment bar-segment-admin"
              style={{
                width: `${Math.max(
                  10,
                  (adminCount / (totalUsersCount || 1)) * 100,
                )}%`,
              }}
              title={`Admins: ${adminCount}`}
            />
            <div
              className="bar-segment bar-segment-user"
              style={{
                width: `${Math.max(
                  15,
                  (normalUserCount / (totalUsersCount || 1)) * 100,
                )}%`,
              }}
              title={`Users: ${normalUserCount}`}
            />
            <div
              className="bar-segment bar-segment-company"
              style={{
                width: `${Math.max(
                  15,
                  (companyUserCount / (totalUsersCount || 1)) * 100,
                )}%`,
              }}
              title={`Companies: ${companyUserCount}`}
            />
          </div>

          <div className="legend-grid">
            <div className="legend-item">
              <span className="legend-dot dot-admin" />
              <span>Admins ({adminCount})</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot dot-user" />
              <span>Normal Users ({normalUserCount})</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot dot-company" />
              <span>Companies ({companyUserCount})</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Quick Navigation</h3>
          <p className="card-subtitle">Manage core application features directly</p>
          <div className="quick-actions-grid">
            <Link to="/admin/users" className="action-btn">
              <span><FaUsers /></span> Manage Users
            </Link>
            <Link to="/admin/companies" className="action-btn">
              <span><FaBuilding /></span> Review Companies
            </Link>
            <Link to="/admin/notifications" className="action-btn">
              <span><FaBullhorn /></span> Send Broadcast
            </Link>
            <Link to="/admin/reports" className="action-btn">
              <span><FaChartBar /></span> Export Analytics
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Users Table */}
      <div className="dashboard-card margin-top">
        <h3>Recent User Accounts</h3>
        <p className="card-subtitle">Latest accounts registered in database</p>

        {loadingUsers ? (
          <p className="page-message">Loading recent users...</p>
        ) : (
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 5).map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="user-table-cell">
                        <span className="user-avatar-sm">
                          {u.name?.[0] || 'U'}
                        </span>
                        <span>{u.name}</span>
                      </div>
                    </td>
                    <td className="email-col">{u.email}</td>
                    <td>
                      <span className={`role-badge role-badge-${u.role}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className="status-badge status-active">Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
