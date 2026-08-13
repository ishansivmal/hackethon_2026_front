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
    <section className="customer-page">
      <h2 className="listing-heading">
        Available Jobs
        {jobs.length > 0 && <span className="listing-count">{jobs.length} open</span>}
      </h2>

      {loading ? (
        <p className="listing-loading">Loading jobs...</p>
      ) : jobs.length > 0 ? (
        <div className="listing-grid">
          {jobs.map((job) => (
            <ItemCard key={job.job_ID || job.id} item={job} type="job" hasApplied={appliedIds.includes(job.job_ID || job.id)} />
          ))}
        </div>
      ) : (
        <p className="listing-empty">No jobs available at the moment.</p>
      )}

      <hr className="listing-divider" />
      <AppliedJobs />
    </section>
  )
}
