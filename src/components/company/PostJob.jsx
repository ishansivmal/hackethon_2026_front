import { useState } from 'react'
import PostedList from './PostedList'
import EditItemModal from './EditItemModal'
import CreateItemModal from './CreateItemModal'
import deletePosted from '../../utils/deletePosted'

export default function PostJob({ items = [], onPosted }) {
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState(null)

  const handleDelete = async (job) => {
    if (await deletePosted('job', job)) onPosted?.()
  }

  return (
    <div className="cd-view">
      <div className="cd-view-header">
        <div className="cd-view-heading">
          <span className="cd-view-emoji">💼</span>
          <div>
            <h2 className="cd-view-title">Jobs</h2>
            <p className="cd-view-sub">Manage the job openings published by your company.</p>
          </div>
        </div>
        <button
          id="create-job-btn"
          type="button"
          className="cd-create-btn"
          onClick={() => setCreating(true)}
        >
          <span className="cd-create-btn-plus">＋</span> Create Job
        </button>
      </div>

      <PostedList
        icon="💼"
        title="My Posted Jobs"
        subtitle="Only jobs published by your account are shown here."
        emptyText="You haven't posted any jobs yet. Click “Create Job” to publish your first opening."
        items={items}
        renderItem={(job) => (
          <article key={job.job_ID ?? job.id} className="cd-posted-card">
            {job.photoUrl && (
              <img
                className="cd-posted-photo"
                src={job.photoUrl}
                alt={job.position}
              />
            )}
            <div className="cd-posted-body">
              <h4 className="cd-posted-name">{job.position}</h4>
              <p className="cd-posted-meta">📍 {job.location} · {job.jobType}</p>
              {job.salary && <p className="cd-posted-meta">💰 {job.salary}</p>}
              <span className="cd-posted-apps">📨 {job.applications?.length ?? 0} applications</span>
              <div className="cd-posted-actions">
                <button
                  type="button"
                  className="cd-posted-btn cd-posted-btn--edit"
                  onClick={() => setEditing(job)}
                >
                  ✏️ Edit
                </button>
                <button
                  type="button"
                  className="cd-posted-btn cd-posted-btn--delete"
                  onClick={() => handleDelete(job)}
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
          type="job"
          onClose={() => setCreating(false)}
          onCreated={onPosted}
        />
      )}
      {editing && (
        <EditItemModal
          type="job"
          item={editing}
          onClose={() => setEditing(null)}
          onSaved={onPosted}
        />
      )}
    </div>
  )
}
