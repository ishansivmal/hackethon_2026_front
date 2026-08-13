import ApplyButton from './ApplyButton'

function DetailRow({ label, value }) {
  if (value === undefined || value === null || value === '') return null
  return (
    <div className="listing-row">
      <span className="listing-row-label">{label}</span>
      <span className="listing-row-value">{value}</span>
    </div>
  )
}

export default function ItemCard({ item, type, hasApplied }) {
  const isProblem = type === 'problem'
  const isJob = type === 'job'

  return (
    <div className="listing-card">
      {!isProblem && item.photoUrl && (
        <img
          className="listing-card-image"
          src={item.photoUrl}
          alt={item.title || item.position}
        />
      )}

      {isProblem ? (
        <>
          <p className="listing-card-title">{item.description}</p>
          <p className="listing-company">Posted by: {item.user?.name || 'Unknown User'}</p>
          {item.pdf && (
            <a className="listing-link" href={item.pdf} target="_blank" rel="noreferrer">
              View Requirements PDF
            </a>
          )}
        </>
      ) : (
        <>
          <h3 className="listing-card-title">{item.title || item.position}</h3>
          <p className="listing-company">{item.user?.name || 'Unknown Company'}</p>

          <div className="listing-details">
            <DetailRow label="Location" value={item.location} />
            <DetailRow label="Type" value={item.internType || item.jobType} />
            {isJob && <DetailRow label="Salary" value={item.salary ? `$${item.salary}` : undefined} />}
            {!isJob && <DetailRow label="Duration" value={item.duration} />}
            {!isJob && <DetailRow label="Paid" value={item.isPaid ? 'Yes' : 'No'} />}
            {!isJob && (
              <DetailRow
                label="Deadline"
                value={item.deadline ? new Date(item.deadline).toLocaleDateString() : undefined}
              />
            )}
          </div>

          <p className="listing-note">{item.description}</p>
        </>
      )}

      <ApplyButton
        itemId={item.id || item.job_ID || item.problem_ID}
        itemType={type}
        hasApplied={hasApplied}
      />
    </div>
  )
}
