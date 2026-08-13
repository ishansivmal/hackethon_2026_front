import { useState } from 'react'
import PostedList from './PostedList'
import EditItemModal from './EditItemModal'
import CreateItemModal from './CreateItemModal'
import deletePosted from '../../utils/deletePosted'
import {
  FaGraduationCap,
  FaPlus,
  FaMapMarkerAlt,
  FaStopwatch,
  FaCalendarAlt,
  FaEnvelopeOpen,
  FaPencilAlt,
  FaTrashAlt,
} from 'react-icons/fa'

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
          <span className="cd-view-emoji"><FaGraduationCap /></span>
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
          <span className="cd-create-btn-plus"><FaPlus /></span> Create Internship
        </button>
      </div>

      <PostedList
        icon={<FaGraduationCap />}
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
              <p className="cd-posted-meta"><FaMapMarkerAlt /> {internship.location} · {internship.internType}</p>
              <p className="cd-posted-meta"><FaStopwatch /> {internship.duration} · {internship.isPaid ? 'Paid' : 'Unpaid'}</p>
              <p className="cd-posted-meta"><FaCalendarAlt /> Deadline: {new Date(internship.deadline).toLocaleDateString()}</p>
              <span className="cd-posted-apps"><FaEnvelopeOpen /> {internship.applications?.length ?? 0} applications</span>
              <div className="cd-posted-actions">
                <button
                  type="button"
                  className="cd-posted-btn cd-posted-btn--edit"
                  onClick={() => setEditing(internship)}
                >
                  <FaPencilAlt /> Edit
                </button>
                <button
                  type="button"
                  className="cd-posted-btn cd-posted-btn--delete"
                  onClick={() => handleDelete(internship)}
                >
                  <FaTrashAlt /> Delete
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
