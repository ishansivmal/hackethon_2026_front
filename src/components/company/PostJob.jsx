import { useState } from 'react'
import { toast } from 'react-toastify'

const JOB_TYPES = ['REMOTE', 'PHYSICAL', 'HYBRID']

const INIT = {
  jobPosition: '',
  image: '',
  requirements: '',
  jobType: 'REMOTE',
  location: '',
  salary: '',
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

export default function PostJob() {
  const [form, setForm] = useState(INIT)
  const [submitting, setSubmitting] = useState(false)

  const handle = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 900))
    toast.success(`Job "${form.jobPosition}" posted successfully! 💼`)
    setForm(INIT)
    setSubmitting(false)
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

          <Field label="Image URL" hint="Company or role banner image URL">
            <input
              id="job-image"
              className="cd-input"
              name="image"
              placeholder="https://example.com/banner.jpg"
              value={form.image}
              onChange={handle}
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
    </div>
  )
}
