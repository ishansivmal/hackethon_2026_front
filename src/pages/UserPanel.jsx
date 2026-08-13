import { Routes, Route, Link } from 'react-router-dom'
import UserInternships from '../components/customer/UserInternships'
import UserJobs from '../components/customer/UserJobs'
import UserProblems from '../components/customer/UserProblems'

export default function UserPanel() {
  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', backgroundColor: '#1a1a1a', color: '#fff' }}>
      
      {/* Sidebar Navigation */}
      <div style={{ width: '250px', padding: '2rem 1rem', borderRight: '1px solid #333', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2 style={{ marginBottom: '2rem', textAlign: 'center', color: '#4da6ff' }}>User Dashboard</h2>
        
        <Link 
          to="/user-panel/internships" 
          style={{ padding: '1rem', textDecoration: 'none', color: '#ddd', borderRadius: '8px', border: '1px solid #333', background: '#242424', display: 'block' }}
        >
          My Internships
        </Link>
        <Link 
          to="/user-panel/jobs" 
          style={{ padding: '1rem', textDecoration: 'none', color: '#ddd', borderRadius: '8px', border: '1px solid #333', background: '#242424', display: 'block' }}
        >
          My Jobs
        </Link>
        <Link 
          to="/user-panel/problems" 
          style={{ padding: '1rem', textDecoration: 'none', color: '#ddd', borderRadius: '8px', border: '1px solid #333', background: '#242424', display: 'block' }}
        >
          My Problems
        </Link>
      </div>

      {/* Main Content Outlet Area */}
      <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <Routes>
           <Route path="/" element={<h2 style={{ color: '#aaa' }}>Select a category from the sidebar to view your applications.</h2>} />
           <Route path="internships" element={<UserInternships />} />
           <Route path="jobs" element={<UserJobs />} />
           <Route path="problems" element={<UserProblems />} />
        </Routes>
      </div>
      
    </div>
  )
}
