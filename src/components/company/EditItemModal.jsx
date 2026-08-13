import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { updateInternship, updateJob, updateProblem } from '../../api/company'
import ImageSelector from './ImageSelector'
import {
  FaGraduationCap,
  FaBriefcase,
  FaMicroscope,
  FaFileAlt,
  FaTimes,
  FaUndoAlt,
  FaTrashAlt,
  FaSave,
} from 'react-icons/fa'

const INTERN_TYPES = ['PHYSICAL', 'ONLINE', 'HYBRID']
const JOB_TYPES = ['REMOTE', 'PHYSICAL', 'HYBRID']

const META = {
  internship: {
    icon: <FaGraduationCap />,
    title: 'Edit Internship',
    api: updateInternship,
    fileKey: 'photo',
  },
  job: {
    icon: <FaBriefcase />,
    title: 'Edit Job',
    api: updateJob,
    fileKey: 'image',
  },
  problem: {
    icon: <FaMicroscope />,
    title: 'Edit Problem',
    api: updateProblem,
    fileKey: 'pdf',
  },
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

function initialState(type, item) {
  if (type === 'internship') {
    return {
      title: item.title || '',
      description: item.description || '',
      requirements: item.requirements || '',
      duration: item.duration || '',
      location: item.location || '',
      internType: (item.internType || 'physical').toUpperCase(),
      isPaid: !!item.isPaid,
      deadline: String(item.deadline || '').slice(0, 10),
      photo: null,
      photoPreview: item.photoUrl || '',
      removePhoto: false,
    }
  }

  if (type === 'job') {
    return {
      jobPosition: item.position || '',
      requirements: item.requirements || '',
      jobType: (item.jobType || 'remote').toUpperCase(),
      location: item.location || '',
      salary: item.salary || '',
      image: null,
      imagePreview: item.photoUrl || '',
      removePhoto: false,
    }
  }

  return {
    description: item.description || '',
    pdf: null,
    pdfName: '',
    removePdf: false,
  }
}

export default function EditItemModal({ type, item, onClose, onSaved }) {
  const meta = META[type]
  const id = item.id ?? item.job_ID ?? item.problem_ID

  const [form, setForm] = useState(() => initialState(type, item))
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
      const currentPreview = prev[previewKey]
      if (currentPreview && currentPreview !== item.photoUrl) {
        URL.revokeObjectURL(currentPreview)
      }
      return {
        ...prev,
        [photoKey]: file,
        removePhoto: !file,
        [previewKey]: file ? URL.createObjectURL(file) : '',
      }
    })
  }

  const handlePdf = (e) => {
    const file = e.target.files?.[0] || null
    setForm(prev => ({ ...prev, pdf: file, pdfName: file?.name || '', removePdf: false }))
    e.target.value = ''
  }

  const removePdf = () => {
    setForm(prev => ({ ...prev, pdf: null, pdfName: '', removePdf: true }))
  }

  const clearNewPdf = () => {
    setForm(prev => ({ ...prev, pdf: null, pdfName: '', removePdf: false }))
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
        if (form.removePhoto) fd.append('removePhoto', 'true')
      } else if (type === 'job') {
        fd.append('jobPosition', form.jobPosition)
        fd.append('requirements', form.requirements)
        fd.append('jobType', form.jobType)
        fd.append('location', form.location)
        fd.append('salary', form.salary)
        if (form.image) fd.append('image', form.image)
        if (form.removePhoto) fd.append('removePhoto', 'true')
      } else {
        fd.append('description', form.description)
        if (form.pdf) fd.append('pdf', form.pdf)
        if (form.removePdf) fd.append('removePdf', 'true')
      }

      await meta.api(id, fd)

      const label = type === 'internship' ? 'Internship' : type === 'job' ? 'Job' : 'Problem'
      toast.success(`${label} updated successfully!`)
      onSaved?.()
      onClose()
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update. Please try again.'
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
          aria-label="Close edit modal"
        >
          &times;
        </button>

        <div className="cd-modal-header">
          <span className="cd-view-emoji">{meta.icon}</span>
          <div>
            <h3 className="cd-modal-title">{meta.title}</h3>
            <p className="cd-modal-sub">Update the details and save your changes.</p>
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

              <Field
                label="Internship Photo"
                hint={form.removePhoto
                  ? 'Current image will be removed — pick a new one to keep an image.'
                  : 'Change the image, or click Remove on the preview to delete it'}
              >
                <ImageSelector
                  id="edit-intern-photo"
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
                  rows={3}
                  value={form.requirements}
                  onChange={handle}
                  required
                />
              </Field>

              <div className={`cd-toggle-row${form.isPaid ? ' cd-toggle-row--on' : ''}`}>
                <label className="cd-toggle-label" htmlFor="edit-intern-isPaid">
                  <span className="cd-toggle-text">
                    <span className="cd-toggle-title">Paid Internship</span>
                    <span className="cd-toggle-sub">Toggle on if this internship includes compensation</span>
                  </span>
                  <span className={`cd-toggle${form.isPaid ? ' cd-toggle--on' : ''}`}>
                    <input
                      id="edit-intern-isPaid"
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

              <Field
                label="Company / Banner Image"
                hint={form.removePhoto
                  ? 'Current image will be removed — pick a new one to keep an image.'
                  : 'Change the image, or click Remove on the preview to delete it'}
              >
                <ImageSelector
                  id="edit-job-image"
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
                  rows={7}
                  value={form.description}
                  onChange={handle}
                  required
                />
              </Field>

              <Field
                label="PDF / Document"
                hint={form.pdfName
                  ? 'A new document is selected'
                  : form.removePdf
                    ? 'Current PDF will be removed'
                    : 'Change or remove the current attachment (optional)'}
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
                    <span className="cd-pdf-icon"><FaFileAlt /></span>
                    <span className="cd-file-name">{form.pdfName}</span>
                    <button
                      type="button"
                      className="cd-upload-remove cd-upload-remove--static"
                      onClick={clearNewPdf}
                    >
                      <FaTimes /> Remove
                    </button>
                  </div>
                ) : form.removePdf ? (
                  <div className="cd-pdf-removed">
                    <span className="cd-pdf-icon"><FaFileAlt /></span>
                    <span className="cd-file-name">Current PDF will be removed</span>
                    <button
                      type="button"
                      className="cd-posted-btn cd-posted-btn--edit"
                      onClick={() => setForm(prev => ({ ...prev, removePdf: false }))}
                    >
                      <FaUndoAlt /> Undo
                    </button>
                  </div>
                ) : (
                  <div className="cd-pdf-actions">
                    <button
                      type="button"
                      className="cd-upload-box"
                      onClick={() => pdfInputRef.current?.click()}
                    >
                      <span className="cd-upload-icon"><FaFileAlt /></span>
                      <span>{item.pdf ? 'Replace current PDF' : 'Attach a PDF'}</span>
                    </button>
                    {item.pdf && (
                      <button
                        type="button"
                        className="cd-posted-btn cd-posted-btn--delete"
                        onClick={removePdf}
                      >
                        <FaTrashAlt /> Remove current PDF
                      </button>
                    )}
                  </div>
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
                ? <><span className="cd-spinner" /> Saving…</>
                : <><span><FaSave /></span> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
