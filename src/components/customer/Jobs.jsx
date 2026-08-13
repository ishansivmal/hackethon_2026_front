import { useEffect, useState } from 'react'
import { getJobs, getAppliedRecord } from '../../api/customerapi'
import ItemCard from './ItemCard'
import AppliedJobs from './AppliedJobs'

export default function Jobs() {
  const [jobs, setJobs] = useState([])
  const [appliedIds, setAppliedIds] = useState([])
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
    const fetchApplied = async () => {
      try {
        const response = await getAppliedRecord()
        setAppliedIds(response.data.jobs || [])
      } catch (err) {
        console.error("Failed to fetch applied records", err)
      }
    }
    fetchJobs()
    fetchApplied()
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
            <ItemCard key={job.job_ID || job.id} item={job} type="job" hasApplied={appliedIds.includes(job.job_ID || job.id)} />
          ))}
        </div>
      ) : (
        <p>No jobs available at the moment.</p>
      )}

      {/* Render the AppliedJobs component at the bottom of the Jobs tab */}
      <hr style={{ margin: '3rem 0', borderColor: '#444' }} />
      <AppliedJobs />

    </section>
  )
}
