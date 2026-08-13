import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { FaCamera } from 'react-icons/fa'

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
]

export default function AdminProfileModal({ user, onClose }) {
  const fileInputRef = useRef(null)
  const [avatarUrl, setAvatarUrl] = useState(() => {
    return localStorage.getItem('admin_avatar_url') || user?.avatarUrl || ''
  })

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

  const saveAvatar = (url) => {
    setAvatarUrl(url)
    if (url) {
      localStorage.setItem('admin_avatar_url', url)
    } else {
      localStorage.removeItem('admin_avatar_url')
    }
    window.dispatchEvent(new Event('admin_avatar_changed'))
    toast.success('Profile picture updated successfully!')
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        saveAvatar(event.target.result)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="profile-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
        style={{ maxWidth: '440px' }}
      >
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close profile modal"
        >
          &times;
        </button>

        {/* Profile Header with Interactive Avatar Camera Overlay */}
        <div className="profile-modal-header" style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <div
              style={{
                width: '96px',
                height: '96px',
                borderRadius: '50%',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #2196F3, #0D47A1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#fff',
                border: '3px solid rgba(255, 255, 255, 0.6)',
                boxShadow: '0 4px 14px rgba(13, 71, 161, 0.3)',
              }}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={user.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                getInitials(user.name)
              )}
            </div>

            {/* Camera Change Icon Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Upload new profile picture"
              style={{
                position: 'absolute',
                bottom: '2px',
                right: '2px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#2196F3',
                color: '#fff',
                border: '2px solid #ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(13, 71, 161, 0.35)',
              }}
            >
              <FaCamera />
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />

          <div>
            <h2 id="profile-modal-title" className="profile-modal-name" style={{ margin: '0 0 4px 0' }}>
              {user.name}
            </h2>
            <span className={`role-badge role-badge-${user.role || 'user'}`}>
              {(user.role || 'user').toUpperCase()}
            </span>
          </div>
        </div>

        {/* Preset Avatars Selector */}
        <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(33, 150, 243, 0.06)', borderRadius: '10px', textAlign: 'center', border: '1px solid var(--border)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text)', display: 'block', marginBottom: '8px', fontWeight: '600', opacity: 0.8 }}>
            Choose Preset Avatar or Upload Custom
          </span>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center' }}>
            {PRESET_AVATARS.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Preset ${idx + 1}`}
                onClick={() => saveAvatar(url)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  cursor: 'pointer',
                  border: avatarUrl === url ? '2px solid #2196F3' : '2px solid transparent',
                  opacity: avatarUrl === url ? 1 : 0.75,
                  transition: 'all 0.2s',
                }}
              />
            ))}
            {avatarUrl && (
              <button
                type="button"
                onClick={() => saveAvatar('')}
                title="Remove photo"
                style={{
                  padding: '4px 8px',
                  fontSize: '11px',
                  borderRadius: '6px',
                  border: '1px solid #ef4444',
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#ef4444',
                  cursor: 'pointer',
                }}
              >
                Reset
              </button>
            )}
          </div>
        </div>

        <div className="profile-modal-body" style={{ marginTop: '16px' }}>
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
