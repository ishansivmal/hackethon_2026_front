import { useEffect, useState } from 'react'
import { getAppliedProblems } from '../../api/customerapi'
import AppliedItemCard from './AppliedItemCard'

export default function UserProblems() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplied = async () => {
      try {
        const response = await getAppliedProblems()
        setApplications(response.data || [])
      } catch (error) {
        console.error("Error fetching applied problems:", error)
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
            <h2 className="cd-view-title">My Problems</h2>
            <p className="cd-view-sub">Problems you have applied to, your submitted solution and status.</p>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="cd-posted-empty">Loading your applications...</p>
      ) : applications.length > 0 ? (
        <div className="up-view-grid">
          {applications.map((application) => (
            <AppliedItemCard key={application.applied_problem_ID} application={application} type="problem" />
          ))}
        </div>
      ) : (
        <p className="cd-posted-empty">You haven't applied to any problems yet.</p>
      )}
    </div>
  )
}
