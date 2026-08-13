import ApplyButton from './ApplyButton'

export default function ItemCard({ item, type, hasApplied }) {
  const isProblem = type === 'problem'
  const isJob = type === 'job'

  return (
    <div
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
      {!isProblem && item.photoUrl && (
        <img
          src={item.photoUrl}
          alt={item.title || item.position}
          style={{
            width: '100%',
            height: '150px',
            objectFit: 'cover',
            borderRadius: '4px',
            marginBottom: '0.5rem'
          }}
        />
      )}

      {isProblem ? (
        <>
          <p style={{ margin: 0, fontSize: '1rem', color: '#fff' }}>
            {item.description}
          </p>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#aaa', marginTop: 'auto' }}>
            <strong>Posted By:</strong> {item.user?.name || 'Unknown User'}
          </p>
          {item.pdf && (
            <a href={item.pdf} target="_blank" rel="noreferrer" style={{ marginTop: '0.5rem', color: '#4da6ff' }}>
              View Requirements PDF
            </a>
          )}
        </>
      ) : (
        <>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff' }}>
            {item.title || item.position}
          </h3>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Company:</strong> {item.user?.name || 'Unknown Company'}
          </p>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Location:</strong> {item.location} {item.internType ? `(${item.internType})` : item.jobType ? `(${item.jobType})` : ''}
          </p>

          {isJob && item.salary && (
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#4ade80' }}>
              <strong>Salary:</strong> ${item.salary}
            </p>
          )}

          {!isJob && (
            <>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                <strong>Duration:</strong> {item.duration}
              </p>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                <strong>Paid:</strong> {item.isPaid ? 'Yes' : 'No'}
              </p>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#aaa', marginBottom: '1rem' }}>
                <strong>Deadline:</strong> {new Date(item.deadline).toLocaleDateString()}
              </p>
            </>
          )}
        </>
      )}

      {/* Everyone gets an Apply Button, but tailored if needed */}
      <ApplyButton
        itemId={item.id || item.job_ID || item.problem_ID}
        itemType={type}
        hasApplied={hasApplied}
      />
    </div>
  )
}
