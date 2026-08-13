import { useState } from 'react'
import { toast } from 'react-toastify'
import { applyForInternship, applyForJob, applyForProblem } from '../../api/customerapi'
import { useAuth } from '../../context/useAuth'
import { FaCheck } from 'react-icons/fa'

const modalBackdropStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(13, 71, 161, 0.4)',
  backdropFilter: 'blur(3px)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  padding: '1rem',
}

const modalCardStyle = {
  backgroundColor: '#fff',
  padding: '1.75rem',
  borderRadius: '16px',
  width: '100%',
  maxWidth: '440px',
  boxShadow: '0 24px 60px rgba(13, 71, 161, 0.3)',
  maxHeight: '90vh',
  overflowY: 'auto',
  textAlign: 'left',
  color: 'var(--text)',
}

const modalInputStyle = {
  width: '100%',
  padding: '0.6rem 0.75rem',
  borderRadius: '8px',
  border: '1px solid var(--border)',
  backgroundColor: 'var(--bg)',
  color: 'var(--text-h)',
  boxSizing: 'border-box',
  font: 'inherit',
  outline: 'none',
}

const btnPrimaryStyle = {
  backgroundColor: 'var(--accent)',
  border: 'none',
  color: '#fff',
  padding: '0.6rem 1.4rem',
  borderRadius: '10px',
  fontWeight: 'bold',
  cursor: 'pointer',
  opacity: 1,
}

const btnOutlineStyle = {
  backgroundColor: 'transparent',
  border: '1px solid var(--border)',
  color: 'var(--text)',
  padding: '0.6rem 1.4rem',
  borderRadius: '10px',
  cursor: 'pointer',
}

export default function ApplyButton({ itemId, itemType, hasApplied }) {
  const { user } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  const [customTime, setCustomTime] = useState('')
  const [customBudget, setCustomBudget] = useState('')
  const [customSolution, setCustomSolution] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [justApplied, setJustApplied] = useState(false)

  const isActuallyApplied = hasApplied || justApplied;

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type === 'application/pdf') {
       setSelectedFile(file)
    } else {
       toast.error("Please upload a valid PDF document.")
    }
  }

  const handleApplyClick = () => {
    if (!user) {
      toast.error("Please create an account or log in to submit your application.")
      return
    }
    if (!isActuallyApplied) {
      setIsModalOpen(true)
    }
  }

  const handleSend = async () => {
    if (!selectedFile && itemType !== 'problem') {
      toast.error("Please select a PDF CV to attach before sending!")
      return
    }
    if (itemType === 'problem' && !customSolution && !selectedFile) {
       toast.error("Please provide either a textual solution plan or attach a PDF documentation.")
       return
    }

    try {
      setIsLoading(true)
      const formData = new FormData()

      if (selectedFile) formData.append('cv', selectedFile)

      if (itemType === 'problem') {
          if (customTime) formData.append('time', customTime)
          if (customBudget) formData.append('budget', customBudget)
          if (customSolution) formData.append('solution', customSolution)
      }

      let apiCall
      if (itemType === 'internship') apiCall = applyForInternship
      else if (itemType === 'job') apiCall = applyForJob
      else apiCall = applyForProblem

      await apiCall(itemId, formData)

      toast.success("Application successfully sent!")
      setSelectedFile(null)
      setIsModalOpen(false)
      setJustApplied(true)
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send application")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={handleApplyClick}
        disabled={isActuallyApplied}
        className="listing-apply"
      >
        {isActuallyApplied ? <><FaCheck /> Applied</> : 'Apply Now'}
      </button>

      {isModalOpen && (
        <div style={modalBackdropStyle}>
          <div style={modalCardStyle}>
            <h2 style={{ marginTop: 0, color: 'var(--text-h)' }}>Submit Application</h2>

            {!selectedFile ? (
              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.9 }}>Select PDF file (Optional if text solution provided):</label>
                <input type="file" accept="application/pdf" onChange={handleFileChange} />
              </div>
            ) : (
              <div style={{ marginBottom: '1.2rem', padding: '0.75rem', backgroundColor: 'var(--accent-bg)', borderRadius: '8px' }}>
                <p style={{ margin: '0 0 0.5rem 0', wordBreak: 'break-all' }}><strong>Selected PDF:</strong> {selectedFile.name}</p>
                <button
                  onClick={() => setSelectedFile(null)}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#ef4444', border: '1px solid #ef4444',
                    padding: '0.2rem 0.5rem', borderRadius: '6px', cursor: 'pointer'
                  }}
                >
                  Clear File
                </button>
              </div>
            )}

            {itemType === 'problem' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem', color: 'var(--text)' }}>Estimated Time (e.g. 5 days)</label>
                    <input
                      type="text"
                      value={customTime}
                      onChange={(e) => setCustomTime(e.target.value)}
                      style={modalInputStyle}
                      placeholder="3 Days"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem', color: 'var(--text)' }}>Requested Budget ($)</label>
                    <input
                      type="number"
                      value={customBudget}
                      onChange={(e) => setCustomBudget(e.target.value)}
                      style={modalInputStyle}
                      placeholder="500"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem', color: 'var(--text)' }}>Short Solution Layout (Text)</label>
                    <textarea
                      value={customSolution}
                      onChange={(e) => setCustomSolution(e.target.value)}
                      rows={3}
                      style={{ ...modalInputStyle, resize: 'vertical' }}
                      placeholder="My plan involves..."
                    />
                  </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button onClick={() => setIsModalOpen(false)} style={btnOutlineStyle}>
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={isLoading}
                style={{ ...btnPrimaryStyle, cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1 }}
              >
                {isLoading ? 'Sending...' : 'Send Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
