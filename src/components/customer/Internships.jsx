import { useEffect, useState } from 'react'
import { getInternships } from '../../api/customerapi'

export default function Internships() {
  const [internships, setInternships] = useState([])
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
    fetchInternships()
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
            <div
              key={internship.id}
              className="card"
              style={{
                border: '1px solid #444',
                padding: '1.5rem',
                borderRadius: '8px',
                backgroundColor: '#1a1a2e',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                textAlign: 'left'
              }}
            >
              {internship.photoUrl && (
                <img
                  src={internship.photoUrl}
                  alt={internship.title}
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    marginBottom: '0.5rem'
                  }}
                />
              )}
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff' }}>{internship.title}</h3>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                <strong>Company:</strong> {internship.user?.name || 'Unknown Company'}
              </p>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                <strong>Location:</strong> {internship.location} ({internship.internType})
              </p>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                <strong>Duration:</strong> {internship.duration}
              </p>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                <strong>Paid:</strong> {internship.isPaid ? 'Yes' : 'No'}
              </p>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#aaa' }}>
                <strong>Deadline:</strong> {new Date(internship.deadline).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No internships available at the moment.</p>
      )}
    </section>
  )
}
