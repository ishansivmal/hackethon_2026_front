import { useEffect, useState } from 'react'
import { getJobs, getAppliedRecord } from '../../api/customerapi'
import ItemCard from './ItemCard'
import Pagination from '../Pagination'
import AppliedJobs from './AppliedJobs'

export default function Jobs() {
  const [jobs, setJobs] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [appliedIds, setAppliedIds] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    setLoading(true)

    getJobs(page, pageSize)
      .then(({ data }) => {
        if (cancelled) return
        setJobs(data.rows ?? [])
        setTotal(data.total ?? 0)
        setTotalPages(data.totalPages ?? 1)
        setLoading(false)
      })
      .catch((error) => {
        if (cancelled) return
        console.error('Error fetching jobs:', error)
        setJobs([])
        setTotal(0)
        setTotalPages(1)
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [page, pageSize])

  useEffect(() => {
    const fetchApplied = async () => {
      try {
        const response = await getAppliedRecord()
        setAppliedIds(response.data.jobs || [])
      } catch (err) {
        console.error('Failed to fetch applied records', err)
      }
    }
    fetchApplied()
  }, [])

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value))
    setPage(1)
  }

  return (
    <section className="customer-page">
      <h2 className="listing-heading">
        Available Jobs
        {total > 0 && <span className="listing-count">{total} open</span>}
      </h2>

      {loading ? (
        <p className="listing-loading">Loading jobs...</p>
      ) : jobs.length > 0 ? (
        <>
          <div className="listing-grid">
            {jobs.map((job) => (
              <ItemCard key={job.job_ID || job.id} item={job} type="job" hasApplied={appliedIds.includes(job.job_ID || job.id)} />
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
          />
        </>
      ) : (
        <p className="listing-empty">No jobs available at the moment.</p>
      )}

      <hr className="listing-divider" />
      <AppliedJobs />
    </section>
  )
}
