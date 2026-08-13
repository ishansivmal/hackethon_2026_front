import { useState } from 'react'
import PostedList from './PostedList'
import EditItemModal from './EditItemModal'
import CreateItemModal from './CreateItemModal'
import deletePosted from '../../utils/deletePosted'

export default function PostInternship({ items = [], onPosted }) {
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState(null)

  const handleDelete = async (internship) => {
    if (await deletePosted('internship', internship)) onPosted?.()
  }

  return (
    <div className="cd-view">
      <div className="cd-view-header">
        <div className="cd-view-heading">
          <span className="cd-view-emoji">🎓</span>
          <div>
            <h2 className="cd-view-title">Internships</h2>
            <p className="cd-view-sub">Manage the internships published by your company.</p>
          </div>
        </div>
        <button
          id="create-internship-btn"
          type="button"
          className="cd-create-btn"
          onClick={() => setCreating(true)}
        >
          <span className="cd-create-btn-plus">＋</span> Create Internship
        </button>
      </div>

      <PostedList
        icon="🎓"
        title="My Posted Internships"
        subtitle="Only internships published by your account are shown here."
        emptyText="You haven't posted any internships yet. Click “Create Internship” to publish your first listing."
        items={items}
        renderItem={(internship) => (
          <article key={internship.id} className="cd-posted-card">
            {internship.photoUrl && (
              <img
                className="cd-posted-photo"
                src={internship.photoUrl}
                alt={internship.title}
              />
            )}
            <div className="cd-posted-body">
              <h4 className="cd-posted-name">{internship.title}</h4>
              <p className="cd-posted-meta">📍 {internship.location} · {internship.internType}</p>
              <p className="cd-posted-meta">⏱ {internship.duration} · {internship.isPaid ? 'Paid' : 'Unpaid'}</p>
              <p className="cd-posted-meta">🗓 Deadline: {new Date(internship.deadline).toLocaleDateString()}</p>
              <span className="cd-posted-apps">📨 {internship.applications?.length ?? 0} applications</span>
              <div className="cd-posted-actions">
                <button
                  type="button"
                  className="cd-posted-btn cd-posted-btn--edit"
                  onClick={() => setEditing(internship)}
                >
                  ✏️ Edit
                </button>
                <button
                  type="button"
                  className="cd-posted-btn cd-posted-btn--delete"
                  onClick={() => handleDelete(internship)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </article>
        )}
      />
      {creating && (
        <CreateItemModal
          type="internship"
          onClose={() => setCreating(false)}
          onCreated={onPosted}
        />
      )}
      {editing && (
        <EditItemModal
          type="internship"
          item={editing}
          onClose={() => setEditing(null)}
          onSaved={onPosted}
        />
      )}
    </div>
  )
}
