import { useState } from 'react'
import { toast } from 'react-toastify'
import { postInternship } from '../../api/company'
import ImageSelector from './ImageSelector'
import PostedList from './PostedList'
import EditItemModal from './EditItemModal'
import deletePosted from '../../utils/deletePosted'

const INTERN_TYPES = ['PHYSICAL', 'ONLINE', 'HYBRID']

const INIT = {
  title: '',
  description: '',
  requirements: '',
  duration: '',
  location: '',
  internType: 'PHYSICAL',
  isPaid: false,
  deadline: '',
  photo: null,
  photoPreview: '',
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

export default function PostInternship({ items = [], onPosted }) {
  const [form, setForm] = useState(INIT)
  const [submitting, setSubmitting] = useState(false)
  const [editing, setEditing] = useState(null)

  const handleDelete = async (internship) => {
    if (await deletePosted('internship', internship)) onPosted?.()
  }

  const handle = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handlePhoto = (file) => {
    if (form.photoPreview) URL.revokeObjectURL(form.photoPreview)
    setForm(prev => ({
      ...prev,
      photo: file,
      photoPreview: file ? URL.createObjectURL(file) : '',
    }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('description', form.description)
      fd.append('requirements', form.requirements)
      fd.append('duration', form.duration)
      fd.append('location', form.location)
      fd.append('internType', form.internType)
      fd.append('isPaid', form.isPaid)
      fd.append('deadline', form.deadline)
      if (form.photo) fd.append('photo', form.photo)

      await postInternship(fd)
      toast.success(`Internship "${form.title}" posted successfully! 🎓`)
      if (form.photoPreview) URL.revokeObjectURL(form.photoPreview)
      setForm(INIT)
      onPosted?.()
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to post internship. Please try again.'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="cd-view">
      <div className="cd-view-header">
        <span className="cd-view-emoji">🎓</span>
        <div>
          <h2 className="cd-view-title">Post Internship</h2>
          <p className="cd-view-sub">Fill in the details to attract the best interns for your company.</p>
        </div>
      </div>

      <form className="cd-form" onSubmit={submit} id="internship-form">
        <div className="cd-form-grid">

          <Field label="Internship Title">
            <input
              id="intern-title"
              className="cd-input"
              name="title"
              placeholder="e.g. Frontend Developer Intern"
              value={form.title}
              onChange={handle}
              required
            />
          </Field>

          <Field label="Internship Photo" hint="Upload an image for the internship listing">
            <ImageSelector
              id="intern-photo"
              preview={form.photoPreview}
              onChange={handlePhoto}
            />
          </Field>

          <Field label="Duration">
            <input
              id="intern-duration"
              className="cd-input"
              name="duration"
              placeholder="e.g. 3 months, 6 weeks"
              value={form.duration}
              onChange={handle}
              required
            />
          </Field>

          <Field label="Location">
            <input
              id="intern-location"
              className="cd-input"
              name="location"
              placeholder="e.g. Colombo, Sri Lanka"
              value={form.location}
              onChange={handle}
              required
            />
          </Field>

          <Field label="Application Deadline">
            <input
              id="intern-deadline"
              className="cd-input"
              name="deadline"
              type="date"
              value={form.deadline}
              onChange={handle}
              required
            />
          </Field>

          <Field label="Intern Type">
            <div className="cd-enum-group">
              {INTERN_TYPES.map(t => (
                <label
                  key={t}
                  className={`cd-enum-option${form.internType === t ? ' cd-enum-option--active' : ''}`}
                >
                  <input
                    type="radio"
                    name="internType"
                    value={t}
                    checked={form.internType === t}
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

        <Field label="Description">
          <textarea
            id="intern-description"
            className="cd-input cd-textarea"
            name="description"
            placeholder="Describe the internship role, responsibilities, and what interns will learn…"
            rows={4}
            value={form.description}
            onChange={handle}
            required
          />
        </Field>

        <Field label="Requirements">
          <textarea
            id="intern-requirements"
            className="cd-input cd-textarea"
            name="requirements"
            placeholder="List the skills, qualifications, or prerequisites…"
            rows={3}
            value={form.requirements}
            onChange={handle}
            required
          />
        </Field>

        {/* Paid toggle */}
        <div className={`cd-toggle-row${form.isPaid ? ' cd-toggle-row--on' : ''}`}>
          <label className="cd-toggle-label" htmlFor="intern-isPaid">
            <span className="cd-toggle-text">
              <span className="cd-toggle-title">Paid Internship</span>
              <span className="cd-toggle-sub">Toggle on if this internship includes compensation</span>
            </span>
            <span className={`cd-toggle${form.isPaid ? ' cd-toggle--on' : ''}`}>
              <input
                id="intern-isPaid"
                type="checkbox"
                name="isPaid"
                checked={form.isPaid}
                onChange={handle}
                hidden
              />
              <span className="cd-toggle-thumb" />
            </span>
          </label>
          {form.isPaid && <span className="cd-paid-badge">✦ Paid</span>}
        </div>

        <button
          id="intern-submit"
          type="submit"
          className="cd-submit-btn"
          disabled={submitting}
        >
          {submitting
            ? <><span className="cd-spinner" /> Posting…</>
            : <><span>🚀</span> Post Internship</>}
        </button>
      </form>

      <PostedList
        icon="🎓"
        title="My Posted Internships"
        subtitle="Only internships published by your account are shown here."
        emptyText="You haven't posted any internships yet."
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
