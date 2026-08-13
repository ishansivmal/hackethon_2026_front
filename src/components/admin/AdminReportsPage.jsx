import { FaDownload } from 'react-icons/fa'

export default function AdminReportsPage({ handleExportReport }) {
  return (
    <div className="tab-content">
      <div className="content-header align-center">
        <div>
          <h1>Reports & Analytics</h1>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleExportReport}
        >
          <FaDownload /> Export JSON Report
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Platform Uptime</span>
          <span className="stat-value text-green">99.98%</span>
          <span className="stat-subtext">All services healthy</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Applications Submitted</span>
          <span className="stat-value">1,420</span>
          <span className="stat-subtext">+18% this month</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Active Vacancies</span>
          <span className="stat-value">84</span>
          <span className="stat-subtext">Across 12 categories</span>
        </div>
      </div>

      <div className="dashboard-card margin-top">
        <h3>Monthly Growth Trend</h3>
        <p className="card-subtitle">
          User registration trajectory across Q3 2026
        </p>
        <div className="analytics-chart-mock">
          <div className="chart-bar-wrap">
            <div className="chart-bar" style={{ height: '40%' }}>
              <span>May</span>
            </div>
          </div>
          <div className="chart-bar-wrap">
            <div className="chart-bar" style={{ height: '65%' }}>
              <span>Jun</span>
            </div>
          </div>
          <div className="chart-bar-wrap">
            <div className="chart-bar" style={{ height: '80%' }}>
              <span>Jul</span>
            </div>
          </div>
          <div className="chart-bar-wrap">
            <div className="chart-bar chart-bar-active" style={{ height: '95%' }}>
              <span>Aug</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
