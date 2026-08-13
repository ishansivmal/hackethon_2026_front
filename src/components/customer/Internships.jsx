import { useEffect, useState } from 'react'
import { getInternships, getAppliedRecord } from '../../api/customerapi'
import ItemCard from './ItemCard'

export default function Internships() {
  const [internships, setInternships] = useState([])
  const [appliedIds, setAppliedIds] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const response = await getInternships()
        setInternships(response.data)
      } catch (error) {
        console.error("Error fetching internships:", error)
      } finally {
        setLoading(false)
      }
    }
    const fetchApplied = async () => {
      try {
        const response = await getAppliedRecord()
        setAppliedIds(response.data.internships || [])
      } catch (err) {
        console.error("Failed to fetch applied records", err)
      }
    }
    fetchInternships()
    fetchApplied()
  }, [])

  return (
    <section className="customer-page">
      <h2 className="listing-heading">
        Available Internships
        {internships.length > 0 && <span className="listing-count">{internships.length} open</span>}
      </h2>

      {loading ? (
        <p className="listing-loading">Loading internships...</p>
      ) : internships.length > 0 ? (
        <div className="listing-grid">
          {internships.map((internship) => (
            <ItemCard key={internship.id} item={internship} type="internship" hasApplied={appliedIds.includes(internship.id)} />
          ))}
        </div>
      ) : (
        <p className="listing-empty">No internships available at the moment.</p>
      )}
    </section>
  )
}
