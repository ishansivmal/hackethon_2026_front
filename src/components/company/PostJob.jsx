import { useState } from 'react'
import { toast } from 'react-toastify'
import { postJob } from '../../api/company'
import ImageSelector from './ImageSelector'
import PostedList from './PostedList'
import EditItemModal from './EditItemModal'
import deletePosted from '../../utils/deletePosted'

const JOB_TYPES = ['REMOTE', 'PHYSICAL', 'HYBRID']

const INIT = {
  jobPosition: '',
  requirements: '',
  jobType: 'REMOTE',
  location: '',
  salary: '',
  image: null,
  imagePreview: '',
}

function Field({ label, hint, children }) {
  return (
    <div className="cd-field">
      <label className="cd-field-label">{label}</label>
      {children}
      {hint && <p className="cd-field-hint">{hint}</p>}
    </div>
  )
}

export default function PostJob({ items = [], onPosted }) {
  const [form, setForm] = useState(INIT)
  const [submitting, setSubmitting] = useState(false)
  const [editing, setEditing] = useState(null)

  const handleDelete = async (job) => {
    if (await deletePosted('job', job)) onPosted?.()
  }

  const handle = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleImage = (file) => {
    if (form.imagePreview) URL.revokeObjectURL(form.imagePreview)
    setForm(prev => ({
      ...prev,
      image: file,
      imagePreview: file ? URL.createObjectURL(file) : '',
    }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('jobPosition', form.jobPosition)
      fd.append('requirements', form.requirements)
      fd.append('jobType', form.jobType)
      fd.append('location', form.location)
      fd.append('salary', form.salary)
      if (form.image) fd.append('image', form.image)

      await postJob(fd)
      toast.success(`Job "${form.jobPosition}" posted successfully! 💼`)
      if (form.imagePreview) URL.revokeObjectURL(form.imagePreview)
      setForm(INIT)
      onPosted?.()
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to post job. Please try again.'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="cd-view">
      <div className="cd-view-header">
        <span className="cd-view-emoji">💼</span>
        <div>
          <h2 className="cd-view-title">Post Job</h2>
          <p className="cd-view-sub">Post an open position and find exceptional talent.</p>
        </div>
      </div>

      <form className="cd-form" onSubmit={submit} id="job-form">
        <div className="cd-form-grid">

          <Field label="Job Position">
            <input
              id="job-position"
              className="cd-input"
              name="jobPosition"
              placeholder="e.g. Senior Full-Stack Developer"
              value={form.jobPosition}
              onChange={handle}
              required
            />
          </Field>

          <Field label="Company / Banner Image" hint="Upload a company or role banner image">
            <ImageSelector
              id="job-image"
              preview={form.imagePreview}
              onChange={handleImage}
            />
          </Field>

          <Field label="Location">
            <input
              id="job-location"
              className="cd-input"
              name="location"
              placeholder="e.g. Colombo, Sri Lanka"
              value={form.location}
              onChange={handle}
              required
            />
          </Field>

          <Field label="Salary">
            <input
              id="job-salary"
              className="cd-input"
              name="salary"
              placeholder="e.g. Rs. 250,000 – 400,000 / month"
              value={form.salary}
              onChange={handle}
            />
          </Field>

          <Field label="Job Type">
            <div className="cd-enum-group">
              {JOB_TYPES.map(t => (
                <label
                  key={t}
                  className={`cd-enum-option${form.jobType === t ? ' cd-enum-option--active' : ''}`}
                >
                  <input
                    type="radio"
                    name="jobType"
                    value={t}
                    checked={form.jobType === t}
                    onChange={handle}
                    hidden
                  />
                  <span className="cd-enum-dot" />
                  {t.charAt(0) + t.slice(1).toLowerCase()}
                </label>
              ))}
            </div>
          </Field>

        </div>

        <Field label="Requirements">
          <textarea
            id="job-requirements"
            className="cd-input cd-textarea"
            name="requirements"
            placeholder="Describe required skills, experience, and qualifications…"
            rows={5}
            value={form.requirements}
            onChange={handle}
            required
          />
        </Field>

        <button
          id="job-submit"
          type="submit"
          className="cd-submit-btn cd-submit-btn--job"
          disabled={submitting}
        >
          {submitting
            ? <><span className="cd-spinner" /> Posting…</>
            : <><span>💼</span> Post Job</>}
        </button>
      </form>

      <PostedList
        icon="💼"
        title="My Posted Jobs"
        subtitle="Only jobs published by your account are shown here."
        emptyText="You haven't posted any jobs yet."
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
