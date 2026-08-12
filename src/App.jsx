import { Navigate, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './components/Navbar'
import AdminRoute from './components/AdminRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ConfirmEmail from './pages/ConfirmEmail'
import CompanyDashboard from './pages/CompanyDashboard'
import JobSeekerDashboard from './pages/JobSeekerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import { useAuth } from './context/useAuth'
import { homePathFor } from './utils/homePath'
import './App.css'

function DashboardRedirect() {
  const { user, loading } = useAuth()

  if (loading) {
    return <p className="page-message">Loading...</p>
  }

  return <Navigate to={homePathFor(user)} replace />
}

function App() {
  return (
    <>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="dark" />
      <main className="page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/confirm-email" element={<ConfirmEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="/company/dashboard" element={<CompanyDashboard />} />
          <Route path="/jobseeker/dashboard" element={<JobSeekerDashboard />} />
          <Route path="/admin" element={<AdminRoute />}>
            <Route index element={<AdminDashboard />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  )
}

export default App
