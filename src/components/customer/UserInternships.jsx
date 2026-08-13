import { useEffect, useState } from 'react'
import { getAppliedInternships } from '../../api/customerapi'
import AppliedItemCard from './AppliedItemCard'

export default function UserInternships() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplied = async () => {
      try {
        const response = await getAppliedInternships()
        setApplications(response.data || [])
      } catch (error) {
        console.error("Error fetching applied internships:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchApplied()
  }, [])

  return (
    <div className="cd-view">
      <div className="cd-view-header">
        <div className="cd-view-heading">
          <div>
            <h2 className="cd-view-title">My Internships</h2>
            <p className="cd-view-sub">Internships you have applied to and their current status.</p>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="cd-posted-empty">Loading your applications...</p>
      ) : applications.length > 0 ? (
        <div className="up-view-grid">
          {applications.map((application) => (
            <AppliedItemCard key={application.applied_internship_ID} application={application} type="internship" />
          ))}
        </div>
      ) : (
        <p className="cd-posted-empty">You haven't applied to any internships yet.</p>
      )}
    </div>
  )
}
