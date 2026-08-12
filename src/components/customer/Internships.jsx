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
    <section className="customer-page" style={{ padding: '2rem' }}>
      <h1>Available Internships</h1>
      
      {loading ? (
        <p>Loading internships...</p>
      ) : internships.length > 0 ? (
        <div
          className="grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginTop: '1rem',
          }}
        >
          {internships.map((internship) => (
            <ItemCard key={internship.id} item={internship} type="internship" hasApplied={appliedIds.includes(internship.id)} />
          ))}
        </div>
      ) : (
        <p>No internships available at the moment.</p>
      )}
    </section>
  )
}
