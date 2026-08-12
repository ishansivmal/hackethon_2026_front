import { useEffect } from 'react'

export default function AdminProfileModal({ user, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!user) return null

  const getInitials = (name) => {
    if (!name) return 'A'
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="profile-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
      >
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close profile modal"
        >
          &times;
        </button>

        <div className="profile-modal-header">
          <div className="profile-avatar-large">{getInitials(user.name)}</div>
          <div>
            <h2 id="profile-modal-title" className="profile-modal-name">
              {user.name}
            </h2>
            <span className={`role-badge role-badge-${user.role || 'user'}`}>
              {(user.role || 'user').toUpperCase()}
            </span>
          </div>
        </div>

        <div className="profile-modal-body">
          <div className="profile-info-row">
            <span className="profile-label">Full Name</span>
            <span className="profile-value">{user.name}</span>
          </div>

          <div className="profile-info-row">
            <span className="profile-label">Email Address</span>
            <span className="profile-value">{user.email}</span>
          </div>

          <div className="profile-info-row">
            <span className="profile-label">Account Role</span>
            <span className="profile-value capitalize">{user.role || 'user'}</span>
          </div>

          <div className="profile-info-row">
            <span className="profile-label">API Status</span>
            <span className="profile-value status-active-text">
              ● Authenticated (Profile Active)
            </span>
          </div>
        </div>

        <div className="profile-modal-footer">
          <button type="button" className="btn btn-outline btn-block" onClick={onClose}>
            Close Profile
          </button>
        </div>
      </div>
    </div>
  )
}
