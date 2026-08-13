import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { postInternship, postJob, postProblem } from '../../api/company'
import ImageSelector from './ImageSelector'

const INTERN_TYPES = ['PHYSICAL', 'ONLINE', 'HYBRID']
const JOB_TYPES = ['REMOTE', 'PHYSICAL', 'HYBRID']

const META = {
  internship: {
    icon: '🎓',
    title: 'Create Internship',
    sub: 'Fill in the details to attract the best interns for your company.',
    api: postInternship,
    success: (name) => `Internship "${name}" posted successfully! 🎓`,
  },
  job: {
    icon: '💼',
    title: 'Create Job',
    sub: 'Post an open position and find exceptional talent.',
    api: postJob,
    success: (name) => `Job "${name}" posted successfully! 💼`,
  },
  problem: {
    icon: '🔬',
    title: 'Create Problem',
    sub: 'Share a real challenge and let the community solve it.',
    api: postProblem,
    success: () => 'Problem statement submitted successfully! 🔬',
  },
}

function initialState(type) {
  if (type === 'internship') {
    return {
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
  }

  if (type === 'job') {
    return {
      jobPosition: '',
      requirements: '',
      jobType: 'REMOTE',
      location: '',
      salary: '',
      image: null,
      imagePreview: '',
    }
  }

  return {
    description: '',
    pdf: null,
    pdfName: '',
  }
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

export default function CreateItemModal({ type, onClose, onCreated }) {
  const meta = META[type]

  const [form, setForm] = useState(() => initialState(type))
  const [submitting, setSubmitting] = useState(false)
  const pdfInputRef = useRef(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handle = (e) => {
    const { name, value, type: fieldType, checked } = e.target
    setForm(prev => ({ ...prev, [name]: fieldType === 'checkbox' ? checked : value }))
  }

  const handlePhoto = (file) => {
    const photoKey = type === 'job' ? 'image' : 'photo'
    const previewKey = type === 'job' ? 'imagePreview' : 'photoPreview'

    setForm(prev => {
      if (prev[previewKey]) URL.revokeObjectURL(prev[previewKey])
      return {
        ...prev,
        [photoKey]: file,
        [previewKey]: file ? URL.createObjectURL(file) : '',
      }
    })
  }

  const handlePdf = (e) => {
    const file = e.target.files?.[0] || null
    setForm(prev => ({ ...prev, pdf: file, pdfName: file?.name || '' }))
    e.target.value = ''
  }

  const submit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const fd = new FormData()

      if (type === 'internship') {
        fd.append('title', form.title)
        fd.append('description', form.description)
        fd.append('requirements', form.requirements)
        fd.append('duration', form.duration)
        fd.append('location', form.location)
        fd.append('internType', form.internType)
        fd.append('isPaid', form.isPaid)
        fd.append('deadline', form.deadline)
        if (form.photo) fd.append('photo', form.photo)
      } else if (type === 'job') {
        fd.append('jobPosition', form.jobPosition)
        fd.append('requirements', form.requirements)
        fd.append('jobType', form.jobType)
        fd.append('location', form.location)
        fd.append('salary', form.salary)
        if (form.image) fd.append('image', form.image)
      } else {
        fd.append('description', form.description)
        if (form.pdf) fd.append('pdf', form.pdf)
      }

      const name = type === 'internship' ? form.title : type === 'job' ? form.jobPosition : ''
      await meta.api(fd)
      toast.success(meta.success(name))
      if (form.photoPreview) URL.revokeObjectURL(form.photoPreview)
      onCreated?.()
      onClose()
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create. Please try again.'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="cd-modal-backdrop" onClick={onClose}>
      <div
        className="cd-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={meta.title}
      >
        <button
          type="button"
          className="cd-modal-close"
          onClick={onClose}
          aria-label="Close create modal"
        >
          &times;
        </button>

        <div className="cd-modal-header">
          <span className="cd-view-emoji">{meta.icon}</span>
          <div>
            <h3 className="cd-modal-title">{meta.title}</h3>
            <p className="cd-modal-sub">{meta.sub}</p>
          </div>
        </div>

        <form className="cd-form" onSubmit={submit}>

          {type === 'internship' && (
            <div className="cd-form-grid">
              <Field label="Internship Title">
                <input
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
                  id="create-intern-photo"
                  preview={form.photoPreview}
                  onChange={handlePhoto}
                />
              </Field>

              <Field label="Duration">
                <input
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

              <Field label="Description">
                <textarea
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
                  className="cd-input cd-textarea"
                  name="requirements"
                  placeholder="List the skills, qualifications, or prerequisites…"
                  rows={3}
                  value={form.requirements}
                  onChange={handle}
                  required
                />
              </Field>

              <div className={`cd-toggle-row${form.isPaid ? ' cd-toggle-row--on' : ''}`}>
                <label className="cd-toggle-label" htmlFor="create-intern-isPaid">
                  <span className="cd-toggle-text">
                    <span className="cd-toggle-title">Paid Internship</span>
                    <span className="cd-toggle-sub">Toggle on if this internship includes compensation</span>
                  </span>
                  <span className={`cd-toggle${form.isPaid ? ' cd-toggle--on' : ''}`}>
                    <input
                      id="create-intern-isPaid"
                      type="checkbox"
                      name="isPaid"
                      checked={form.isPaid}
                      onChange={handle}
                      hidden
                    />
                    <span className="cd-toggle-thumb" />
                  </span>
                </label>
              </div>
            </div>
          )}

          {type === 'job' && (
            <div className="cd-form-grid">
              <Field label="Job Position">
                <input
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
                  id="create-job-image"
                  preview={form.imagePreview}
                  onChange={handlePhoto}
                />
              </Field>

              <Field label="Location">
                <input
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

              <Field label="Requirements">
                <textarea
                  className="cd-input cd-textarea"
                  name="requirements"
                  placeholder="Describe required skills, experience, and qualifications…"
                  rows={5}
                  value={form.requirements}
                  onChange={handle}
                  required
                />
              </Field>
            </div>
          )}

          {type === 'problem' && (
            <div className="cd-form-grid">
              <Field label="Problem Description">
                <textarea
                  className="cd-input cd-textarea"
                  name="description"
                  placeholder="Describe the problem in detail — background, constraints, expected outcomes, and why it matters to your business…"
                  rows={8}
                  value={form.description}
                  onChange={handle}
                  required
                />
              </Field>

              <Field
                label="PDF / Document"
                hint="Attach a detailed problem brief, dataset, or specification PDF"
              >
                <input
                  ref={pdfInputRef}
                  className="cd-input"
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handlePdf}
                  hidden
                />
                {form.pdfName ? (
                  <div className="cd-pdf-picked">
                    <span className="cd-pdf-icon">📄</span>
                    <span className="cd-file-name">{form.pdfName}</span>
                    <button
                      type="button"
                      className="cd-upload-remove cd-upload-remove--static"
                      onClick={() => setForm(prev => ({ ...prev, pdf: null, pdfName: '' }))}
                    >
                      ✕ Remove
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="cd-upload-box"
                    onClick={() => pdfInputRef.current?.click()}
                  >
                    <span className="cd-upload-icon">📄</span>
                    <span>Attach a PDF</span>
                  </button>
                )}
              </Field>
            </div>
          )}

          <div className="cd-modal-actions">
            <button
              type="button"
              className="cd-modal-btn cd-modal-btn--ghost"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cd-modal-btn cd-modal-btn--primary"
              disabled={submitting}
            >
              {submitting
                ? <><span className="cd-spinner" /> Posting…</>
                : <><span>🚀</span> Create {type === 'internship' ? 'Internship' : type === 'job' ? 'Job' : 'Problem'}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
