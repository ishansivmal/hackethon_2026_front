import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { postProblem } from '../../api/company'

const INIT = {
  description: '',
  pdf: null,
  pdfName: '',
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

export default function PostProblem() {
  const [form, setForm] = useState(INIT)
  const [submitting, setSubmitting] = useState(false)
  const pdfInputRef = useRef(null)

  const handle = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
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
      fd.append('description', form.description)
      if (form.pdf) fd.append('pdf', form.pdf)

      await postProblem(fd)
      toast.success('Problem statement submitted successfully! 🔬')
      setForm(INIT)
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to submit problem. Please try again.'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="cd-view">
      <div className="cd-view-header">
        <span className="cd-view-emoji">🔬</span>
        <div>
          <h2 className="cd-view-title">Post Problem</h2>
          <p className="cd-view-sub">Share a real challenge and let the community solve it.</p>
        </div>
      </div>

      {/* Info banner */}
      <div className="cd-problem-banner">
        <span className="cd-problem-banner-icon">💡</span>
        <p>
          Share a real-world challenge your company faces. Talented developers and researchers
          can propose innovative solutions during the hackathon.
        </p>
      </div>

      <form className="cd-form" onSubmit={submit} id="problem-form">

        <Field label="Problem Description">
          <textarea
            id="problem-description"
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
            id="problem-pdf"
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

        <button
          id="problem-submit"
          type="submit"
          className="cd-submit-btn cd-submit-btn--problem"
          disabled={submitting}
        >
          {submitting
            ? <><span className="cd-spinner" /> Submitting…</>
            : <><span>📤</span> Submit Problem</>}
        </button>
      </form>
    </div>
  )
}
