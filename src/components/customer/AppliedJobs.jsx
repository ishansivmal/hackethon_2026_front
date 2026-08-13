import { useEffect, useState } from 'react'
import { getJOB } from '../../api/customerapi'
import ItemCard from './ItemCard'

export default function AppliedJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const response = await getJOB()
        setJobs(response.data)
      } catch (error) {
        console.error("Error fetching applied jobs:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchAppliedJobs()
  }, [])

  return (
    <div style={{ marginTop: '3rem' }}>
      <h2>My Applied Jobs</h2>
      
      {loading ? (
        <p>Loading your applications...</p>
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
            <ItemCard key={job.job_ID || job.id} item={job} type="job" hasApplied={true} />
          ))}
        </div>
      ) : (
        <p>You haven't applied to any jobs yet.</p>
      )}
    </div>
  )
}
