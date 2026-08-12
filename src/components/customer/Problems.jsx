import { useEffect, useState } from 'react'
import { getProblems } from '../../api/customerapi'

export default function Problems() {
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await getProblems()
        setProblems(response.data)
      } catch (error) {
        console.error("Error fetching problems:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProblems()
  }, [])

  return (
    <section className="customer-page" style={{ padding: '2rem' }}>
      <h1>Available Problems to Solve</h1>
      
      {loading ? (
        <p>Loading problems...</p>
      ) : problems.length > 0 ? (
        <div
          className="grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginTop: '1rem',
          }}
        >
          {problems.map((problem) => (
            <div
              key={problem.problem_ID || problem.id}
              className="card"
              style={{
                border: '1px solid #444',
                padding: '1.5rem',
                borderRadius: '8px',
                backgroundColor: '#1a1a2e',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                textAlign: 'left'
              }}
            >
              <p style={{ margin: 0, fontSize: '1rem', color: '#fff' }}>
                {problem.description}
              </p>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#aaa', marginTop: 'auto' }}>
                <strong>Posted By:</strong> {problem.user?.name || 'Unknown User'}
              </p>
              {problem.pdf && (
                <a href={problem.pdf} target="_blank" rel="noreferrer" style={{ marginTop: '0.5rem', color: '#4da6ff' }}>
                  View Requirements PDF
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No problems posted at the moment.</p>
      )}
    </section>
  )
}
