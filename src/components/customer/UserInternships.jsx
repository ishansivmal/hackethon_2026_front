  import { useState } from 'react'

  export default function UserInternships() {
    const [mockData] = useState([
      { id: 1, title: 'Frontend Developer Intern', company: 'Tech Solutions' },
      { id: 2, title: 'Data Analytics Intern', company: 'Data Corp' }
    ])

    return (
      <div>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.8rem' }}>Applied Internships</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mockData.map(item => (
            <div key={item.id} style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px', background: '#fff' }}>
              <h3 style={{ margin: '0 0 0.5rem', color: '#333' }}>{item.title}</h3>
              <p style={{ margin: 0, color: '#666' }}>{item.company}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }
