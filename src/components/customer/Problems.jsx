import { useEffect, useState } from 'react'
import { getProblems, getAppliedRecord } from '../../api/customerapi'
import ItemCard from './ItemCard'

export default function Problems() {
  const [problems, setProblems] = useState([])
  const [appliedIds, setAppliedIds] = useState([])
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
    const fetchApplied = async () => {
      try {
        const response = await getAppliedRecord()
        setAppliedIds(response.data.problems || [])
      } catch (err) {
        console.error("Failed to fetch applied records", err)
      }
    }
    fetchProblems()
    fetchApplied()
  }, [])

  return (
    <section className="customer-page">
      <h2 className="listing-heading">
        Available Problems to Solve
        {problems.length > 0 && <span className="listing-count">{problems.length} open</span>}
      </h2>

      {loading ? (
        <p className="listing-loading">Loading problems...</p>
      ) : problems.length > 0 ? (
        <div className="listing-grid">
          {problems.map((problem) => (
            <ItemCard key={problem.problem_ID || problem.id} item={problem} type="problem" hasApplied={appliedIds.includes(problem.problem_ID || problem.id)} />
          ))}
        </div>
      ) : (
        <p className="listing-empty">No problems posted at the moment.</p>
      )}
    </section>
  )
}
