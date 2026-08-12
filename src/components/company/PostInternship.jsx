import { useState } from 'react'
import { toast } from 'react-toastify'

const INTERN_TYPES = ['PHYSICAL', 'ONLINE', 'HYBRID']

const INIT = {
  title: '',
  photo: '',
  description: '',
  requirements: '',
  duration: '',
  location: '',
  internType: 'PHYSICAL',
  isPaid: false,
  deadline: '',
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

export default function PostInternship() {
  const [form, setForm] = useState(INIT)
  const [submitting, setSubmitting] = useState(false)

  const handle = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 900))
    toast.success(`Internship "${form.title}" posted successfully! 🎓`)
    setForm(INIT)
    setSubmitting(false)
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

          <Field label="Photo URL" hint="Paste a direct image link or CDN URL">
            <input
              id="intern-photo"
              className="cd-input"
              name="photo"
              placeholder="https://example.com/image.jpg"
              value={form.photo}
              onChange={handle}
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
              placeholder="e.g. 2025-09-30 or September 30, 2025"
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
    </div>
  )
}
