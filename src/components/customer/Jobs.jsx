import { useEffect, useState } from 'react'
import { getJobs } from '../../api/customerapi'

export default function Jobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await getJobs()
        setJobs(response.data)
      } catch (error) {
        console.error("Error fetching jobs:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  return (
    <section className="customer-page" style={{ padding: '2rem' }}>
      <h1>Available Jobs</h1>
      
      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length > 0 ? (
        <div
          className="grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginTop: '1rem',
          }}
        >
          {jobs.map((job) => (
            <div
              key={job.job_ID || job.id}
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
              {job.photoUrl && (
                <img
                  src={job.photoUrl}
                  alt={job.position}
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    marginBottom: '0.5rem'
                  }}
                />
              )}
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff' }}>{job.position}</h3>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                <strong>Company:</strong> {job.user?.name || 'Unknown Company'}
              </p>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                <strong>Location:</strong> {job.location} ({job.jobType})
              </p>
              {job.salary && (
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#4ade80' }}>
                  <strong>Salary:</strong> ${job.salary}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No jobs available at the moment.</p>
      )}
    </section>
  )
}
