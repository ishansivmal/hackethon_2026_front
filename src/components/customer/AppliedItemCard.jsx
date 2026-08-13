function DetailRow({ label, value }) {
  if (value === undefined || value === null || value === '') return null
  return (
    <div className="up-detail-row">
      <span className="up-detail-label">{label}</span>
      <span className="up-detail-value">{value}</span>
    </div>
  )
}

function FullNote({ label, value }) {
  if (!value) return null
  return (
    <p className="up-full-note">
      <strong>{label}:</strong> {value}
    </p>
  )
}

export default function AppliedItemCard({ application, type }) {
  const isProblem = type === 'problem'
  const isJob = type === 'job'
  const item = isProblem
    ? application.problem
    : isJob
      ? application.job
      : application.internship

  const companyName = item?.user?.name || 'Unknown Company'
  const title = isProblem
    ? item?.description || 'Applied Problem'
    : item?.title || item?.position || 'Untitled'
  const photoUrl = item?.photoUrl
  const cvUrl = application.cv_url
  const solution = application.solution
  const selected = application.isSelected

  return (
    <article className="cd-app-card up-card">
      <div className="cd-app-card-head">
        <span className="cd-app-avatar">{title.charAt(0).toUpperCase()}</span>
        <div className="cd-app-who">
          <h4 className="cd-app-name">{title}</h4>
          <p className="cd-app-email">{companyName}</p>
        </div>
      </div>

      {!isProblem && photoUrl && (
        <img className="cd-posted-photo" src={photoUrl} alt={title} />
      )}

      <div className="up-detail-list">
        {!isProblem && <DetailRow label="Location" value={item?.location} />}
        {!isProblem && <DetailRow label="Type" value={item?.internType || item?.jobType} />}
        {!isJob && <DetailRow label="Duration" value={item?.duration} />}
        {!isJob && <DetailRow label="Paid" value={item?.isPaid ? 'Yes' : 'No'} />}
        {isJob && <DetailRow label="Salary" value={item?.salary ? `$${item.salary}` : undefined} />}
        {!isJob && item?.deadline && (
          <DetailRow label="Deadline" value={new Date(item.deadline).toLocaleDateString()} />
        )}

        {isProblem && (
          <>
            <DetailRow label="Est. time" value={solution?.time || 'Not provided'} />
            <DetailRow label="Budget" value={solution?.budget ? `$${solution.budget}` : 'Not provided'} />
          </>
        )}
      </div>

      {!isProblem && <FullNote label="Requirements" value={item?.requirements} />}
      {!isProblem && <FullNote label="Description" value={item?.description} />}
      {isProblem && (
        <FullNote label="My solution" value={solution?.solution || 'No solution submitted yet.'} />
      )}

      {isProblem && item?.pdf && (
        <a className="cd-app-cv" href={item.pdf} target="_blank" rel="noreferrer">
          View problem PDF
        </a>
      )}
      {isProblem && solution?.pdf && (
        <a className="cd-app-cv" href={solution.pdf} target="_blank" rel="noreferrer">
          View my submitted document
        </a>
      )}

      <div className="up-card-footer">
        <span className={`up-status${selected ? ' up-status--selected' : ''}`}>
          {selected ? 'Selected / Hired' : 'Pending Review'}
        </span>
        {cvUrl && (
          <a className="cd-app-cv" href={cvUrl} target="_blank" rel="noreferrer">
            View my submitted CV
          </a>
        )}
      </div>
    </article>
  )
}
