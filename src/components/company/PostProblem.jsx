import { useState } from 'react'
import PostedList from './PostedList'
import EditItemModal from './EditItemModal'
import CreateItemModal from './CreateItemModal'
import deletePosted from '../../utils/deletePosted'
import { FaMicroscope, FaPlus, FaEnvelopeOpen, FaPencilAlt, FaTrashAlt } from 'react-icons/fa'

export default function PostProblem({ items = [], onPosted }) {
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState(null)

  const handleDelete = async (problem) => {
    if (await deletePosted('problem', problem)) onPosted?.()
  }

  return (
    <div className="cd-view">
      <div className="cd-view-header">
        <div className="cd-view-heading">
          <span className="cd-view-emoji"><FaMicroscope /></span>
          <div>
            <h2 className="cd-view-title">Problems</h2>
            <p className="cd-view-sub">Manage the challenges submitted by your company.</p>
          </div>
        </div>
        <button
          id="create-problem-btn"
          type="button"
          className="cd-create-btn"
          onClick={() => setCreating(true)}
        >
          <span className="cd-create-btn-plus"><FaPlus /></span> Create Problem
        </button>
      </div>

      <PostedList
        icon={<FaMicroscope />}
        title="My Submitted Problems"
        subtitle="Only problems submitted by your account are shown here."
        emptyText="You haven't submitted any problems yet. Click “Create Problem” to share your first challenge."
        items={items}
        renderItem={(problem) => (
          <article key={problem.problem_ID ?? problem.id} className="cd-posted-card">
            <div className="cd-posted-body">
              <h4 className="cd-posted-name">{problem.description}</h4>
              {problem.pdf && (
                <a className="cd-posted-link" href={problem.pdf} target="_blank" rel="noreferrer">
                  View requirements PDF
                </a>
              )}
              <span className="cd-posted-apps"><FaEnvelopeOpen /> {problem.applications?.length ?? 0} solutions</span>
              <div className="cd-posted-actions">
                <button
                  type="button"
                  className="cd-posted-btn cd-posted-btn--edit"
                  onClick={() => setEditing(problem)}
                >
                  <FaPencilAlt /> Edit
                </button>
                <button
                  type="button"
                  className="cd-posted-btn cd-posted-btn--delete"
                  onClick={() => handleDelete(problem)}
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
          type="problem"
          onClose={() => setCreating(false)}
          onCreated={onPosted}
        />
      )}
      {editing && (
        <EditItemModal
          type="problem"
          item={editing}
          onClose={() => setEditing(null)}
          onSaved={onPosted}
        />
      )}
    </div>
  )
}
