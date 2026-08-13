import { useState } from 'react'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import { updateApplicationSelection } from '../../api/company'

const CATEGORIES = [
  { id: 'internship', icon: '🎓', label: 'Applied Internships' },
  { id: 'job', icon: '💼', label: 'Applied Jobs' },
  { id: 'problem', icon: '🔬', label: 'Applied Problems' },
]

function collectApplications(items, titleKey, type) {
  const rows = []
  items.forEach((item) => {
    ;(item.applications ?? []).forEach((app) => {
      rows.push({
        ...app,
        type,
        postedTitle: item[titleKey],
      })
    })
  })
  return rows
}

function applicationId(row) {
  return row.applied_internship_ID ?? row.applied_job_ID ?? row.applied_problem_ID
}

function ApplicantCard({ row, icon, onUpdated }) {
  const [updating, setUpdating] = useState(false)
  const applicantName = row.user?.name || 'Unknown applicant'

  const handleSelect = async () => {
    const result = await Swal.fire({
      title: 'Select applicant?',
      text: `Mark ${applicantName} as selected for "${row.postedTitle}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, select',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    })

    if (!result.isConfirmed) return

    setUpdating(true)
    try {
      await updateApplicationSelection(row.type, applicationId(row), true)
      toast.success('Applicant selected')
      onUpdated?.()
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update application'
      toast.error(message)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <article className={`cd-app-card${row.isSelected ? ' cd-app-card--selected' : ''}`}>
      <div className="cd-app-card-head">
        <span className="cd-app-avatar">{applicantName[0]}</span>
        <div className="cd-app-who">
          <h4 className="cd-app-name">{applicantName}</h4>
          {row.user?.email && <p className="cd-app-email">{row.user.email}</p>}
        </div>
      </div>
      <p className="cd-app-posted">
        <span>{icon}</span>
        <span>
          Applied to <strong>{row.postedTitle}</strong>
        </span>
      </p>
      {row.cv_url && (
        <a className="cd-app-cv" href={row.cv_url} target="_blank" rel="noreferrer">
          📄 View CV
        </a>
      )}
      <div className="cd-app-actions">
        <span className={`cd-app-status${row.isSelected ? ' cd-app-status--selected' : ''}`}>
          {row.isSelected ? '✓ Selected' : '⏳ Pending'}
        </span>
        {!row.isSelected && (
          <button
            type="button"
            className="cd-app-toggle"
            onClick={handleSelect}
            disabled={updating}
          >
            {updating ? 'Updating…' : '✓ Select'}
          </button>
        )}
      </div>
    </article>
  )
}

export default function AppliedApplications({ internships = [], jobs = [], problems = [], onUpdated }) {
  const [active, setActive] = useState('internship')

  const buckets = {
    internship: collectApplications(internships, 'title', 'internship'),
    job: collectApplications(jobs, 'position', 'job'),
    problem: collectApplications(problems, 'description', 'problem'),
  }

  const current = CATEGORIES.find((c) => c.id === active)
  const rows = buckets[active]

  return (
    <div className="cd-view">
      <div className="cd-cat-tabs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`cd-cat-tab${active === cat.id ? ' cd-cat-tab--active' : ''}`}
            onClick={() => setActive(cat.id)}
          >
            <span className="cd-cat-tab-icon">{cat.icon}</span>
            <span className="cd-cat-tab-label">{cat.label}</span>
          </button>
        ))}
      </div>

      {rows.length > 0 ? (
        <div className="cd-app-grid">
          {rows.map((row) => (
            <ApplicantCard
              key={`${applicationId(row)}-${row.user_ID}`}
              row={row}
              icon={current.icon}
              onUpdated={onUpdated}
            />
          ))}
        </div>
      ) : (
        <p className="cd-posted-empty">
          No {current.label.toLowerCase()} yet. Applications will appear here when a job seeker
          applies to one of your {active === 'internship' ? 'internship' : active === 'job' ? 'job' : 'problem'} listings.
        </p>
      )}
    </div>
  )
}
