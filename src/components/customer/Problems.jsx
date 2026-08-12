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
            <ItemCard key={problem.problem_ID || problem.id} item={problem} type="problem" hasApplied={appliedIds.includes(problem.problem_ID || problem.id)} />
          ))}
        </div>
      ) : (
        <p>No problems posted at the moment.</p>
      )}
    </section>
  )
}
