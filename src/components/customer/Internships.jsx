import { useEffect, useState } from 'react'
import { getInternships, getAppliedRecord } from '../../api/customerapi'
import ItemCard from './ItemCard'
import Pagination from '../Pagination'

export default function Internships() {
  const [internships, setInternships] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [appliedIds, setAppliedIds] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    setLoading(true)

    getInternships(page, pageSize)
      .then(({ data }) => {
        if (cancelled) return
        setInternships(data.rows ?? [])
        setTotal(data.total ?? 0)
        setTotalPages(data.totalPages ?? 1)
        setLoading(false)
      })
      .catch((error) => {
        if (cancelled) return
        console.error('Error fetching internships:', error)
        setInternships([])
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
        setAppliedIds(response.data.internships || [])
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
        Available Internships
        {total > 0 && <span className="listing-count">{total} open</span>}
      </h2>

      {loading ? (
        <p className="listing-loading">Loading internships...</p>
      ) : internships.length > 0 ? (
        <>
          <div className="listing-grid">
            {internships.map((internship) => (
              <ItemCard key={internship.id} item={internship} type="internship" hasApplied={appliedIds.includes(internship.id)} />
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
        <p className="listing-empty">No internships available at the moment.</p>
      )}
    </section>
  )
}
