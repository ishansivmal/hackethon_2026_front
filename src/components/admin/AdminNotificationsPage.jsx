export default function AdminNotificationsPage({
  notifications,
  handleSendNotification,
  handleDeleteNotif,
  notifForm,
  setNotifForm,
}) {
  return (
    <div className="tab-content">
      <div className="content-header">
        <div>
          <h1>Notification Management</h1>
          <p className="subtitle">
            Create broadcast announcements and review notification alert history.
          </p>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Broadcast Form */}
        <div className="dashboard-card">
          <h3>Create Broadcast Announcement</h3>
          <form onSubmit={handleSendNotification} className="notif-form">
            <label className="form-label">Announcement Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Scheduled System Maintenance"
              value={notifForm.title}
              onChange={(e) =>
                setNotifForm({ ...notifForm, title: e.target.value })
              }
              required
            />

            <div className="form-row margin-top">
              <div>
                <label className="form-label">Target Audience</label>
                <select
                  className="form-input"
                  value={notifForm.audience}
                  onChange={(e) =>
                    setNotifForm({ ...notifForm, audience: e.target.value })
                  }
                >
                  <option value="All Users">All Users</option>
                  <option value="Companies">Companies Only</option>
                  <option value="Job Seekers">Job Seekers Only</option>
                  <option value="Admins">Admins Only</option>
                </select>
              </div>

              <div>
                <label className="form-label">Priority</label>
                <select
                  className="form-input"
                  value={notifForm.priority}
                  onChange={(e) =>
                    setNotifForm({ ...notifForm, priority: e.target.value })
                  }
                >
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            <label className="form-label margin-top">Message Content</label>
            <textarea
              className="form-input text-area"
              rows="4"
              placeholder="Write message details..."
              value={notifForm.message}
              onChange={(e) =>
                setNotifForm({ ...notifForm, message: e.target.value })
              }
              required
            />

            <button type="submit" className="btn btn-primary margin-top">
              📢 Broadcast Notification
            </button>
          </form>
        </div>

        {/* History */}
        <div className="dashboard-card">
          <h3>Announcement History</h3>
          <p className="card-subtitle">Active and past system broadcasts</p>

          <div className="notif-list">
            {notifications.map((n) => (
              <div key={n.id} className="notif-card">
                <div className="notif-header">
                  <span className="notif-title">{n.title}</span>
                  <button
                    type="button"
                    className="btn-text-danger"
                    onClick={() => handleDeleteNotif(n.id)}
                    title="Delete notification"
                  >
                    &times;
                  </button>
                </div>
                <p className="notif-msg">{n.message}</p>
                <div className="notif-meta">
                  <span className="badge badge-outline">{n.audience}</span>
                  <span
                    className={`priority-badge priority-${n.priority.toLowerCase()}`}
                  >
                    {n.priority}
                  </span>
                  <span className="notif-date">{n.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
