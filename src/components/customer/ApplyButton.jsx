import { useState } from 'react'
import { toast } from 'react-toastify'
import { applyForInternship, applyForJob, applyForProblem } from '../../api/customerapi'
import { useAuth } from '../../context/useAuth'

export default function ApplyButton({ itemId, itemType, hasApplied }) {
  const { user } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  
  // Custom states for Solution submissions
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
        style={{
          marginTop: 'auto',
          backgroundColor: isActuallyApplied ? '#444' : '#4da6ff',
          color: isActuallyApplied ? '#aaa' : '#1a1a2e',
          border: 'none',
          borderRadius: '4px',
          padding: '0.5rem 1rem',
          fontWeight: 'bold',
          cursor: isActuallyApplied ? 'not-allowed' : 'pointer',
          alignSelf: 'flex-start'
        }}
      >
        {isActuallyApplied ? 'Applied' : 'Apply Now'}
      </button>

      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#1a1a2e', padding: '2rem', borderRadius: '8px', 
            width: '90%', maxWidth: '400px', border: '1px solid #444',
            maxHeight: '90vh', overflowY: 'auto'
          }}>
            <h2 style={{marginTop: 0}}>Submit Application</h2>
            
            {!selectedFile ? (
              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.9 }}>Select PDF file (Optional if text solution provided):</label>
                <input type="file" accept="application/pdf" onChange={handleFileChange} />
              </div>
            ) : (
              <div style={{ marginBottom: '1.2rem', padding: '1rem', backgroundColor: '#0f0f1c', borderRadius: '4px' }}>
                <p style={{ margin: '0 0 0.5rem 0', wordBreak: 'break-all' }}><strong>Selected PDF:</strong> {selectedFile.name}</p>
                <button 
                  onClick={() => setSelectedFile(null)}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#ff4d4d', border: '1px solid #ff4d4d',
                    padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer'
                  }}
                >
                  Clear File
                </button>
              </div>
            )}

            {itemType === 'problem' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #333' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem', color: '#ccc' }}>Estimated Time (e.g. 5 days)</label>
                    <input 
                      type="text" 
                      value={customTime}
                      onChange={(e) => setCustomTime(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#0f0f1c', color: '#fff', boxSizing: 'border-box' }}
                      placeholder="3 Days"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem', color: '#ccc' }}>Requested Budget ($)</label>
                    <input 
                      type="number" 
                      value={customBudget}
                      onChange={(e) => setCustomBudget(e.target.value)}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#0f0f1c', color: '#fff', boxSizing: 'border-box' }}
                      placeholder="500"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem', color: '#ccc' }}>Short Solution Layout (Text)</label>
                    <textarea 
                      value={customSolution}
                      onChange={(e) => setCustomSolution(e.target.value)}
                      rows={3}
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#0f0f1c', color: '#fff', boxSizing: 'border-box', resize: 'vertical' }}
                      placeholder="My plan involves..."
                    />
                  </div>
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{
                  backgroundColor: 'transparent', border: '1px solid #aaa',
                  color: '#aaa', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleSend}
                disabled={isLoading}
                style={{
                  backgroundColor: '#4da6ff', border: 'none',
                  color: '#1a1a2e', padding: '0.5rem 1.5rem', borderRadius: '4px', 
                  fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.7 : 1
                }}
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
