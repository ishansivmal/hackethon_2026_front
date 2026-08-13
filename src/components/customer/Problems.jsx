import { useEffect, useState } from 'react'
import { getProblems, getAppliedRecord } from '../../api/customerapi'
import ItemCard from './ItemCard'
import Pagination from '../Pagination'

export default function Problems() {
  const [problems, setProblems] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [appliedIds, setAppliedIds] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    setLoading(true)

    getProblems(page, pageSize)
      .then(({ data }) => {
        if (cancelled) return
        setProblems(data.rows ?? [])
        setTotal(data.total ?? 0)
        setTotalPages(data.totalPages ?? 1)
        setLoading(false)
      })
      .catch((error) => {
        if (cancelled) return
        console.error('Error fetching problems:', error)
        setProblems([])
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
        setAppliedIds(response.data.problems || [])
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
        Available Problems to Solve
        {total > 0 && <span className="listing-count">{total} open</span>}
      </h2>

      {loading ? (
        <p className="listing-loading">Loading problems...</p>
      ) : problems.length > 0 ? (
        <>
          <div className="listing-grid">
            {problems.map((problem) => (
              <ItemCard key={problem.problem_ID || problem.id} item={problem} type="problem" hasApplied={appliedIds.includes(problem.problem_ID || problem.id)} />
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
        <p className="listing-empty">No problems posted at the moment.</p>
      )}
    </section>
  )
}
