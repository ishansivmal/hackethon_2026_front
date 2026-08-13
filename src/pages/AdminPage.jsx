import { useCallback, useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { createUser, deleteUser, getUsers, updateUser, updateUserRole } from '../api/admin'
import { useAuth } from '../context/useAuth'

import AdminSidebar from '../components/admin/AdminSidebar'
import AdminDashboardView from '../components/admin/AdminDashboardView'
import AdminUsersPage from '../components/admin/AdminUsersPage'
import AdminCompaniesPage from '../components/admin/AdminCompaniesPage'
import AdminNotificationsPage from '../components/admin/AdminNotificationsPage'

export default function AdminPage() {
  const { user: currentUser } = useAuth()

  // Users state
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [pendingRoles, setPendingRoles] = useState({})

  // Companies state
  const [companies, setCompanies] = useState([
    { id: 101, name: 'TechCorp Solutions', email: 'contact@techcorp.io', status: 'Pending', category: 'Software & IT', registeredDate: '2026-08-10' },
    { id: 102, name: 'Apex Innovations', email: 'hr@apexinno.com', status: 'Approved', category: 'Engineering', registeredDate: '2026-08-08' },
    { id: 103, name: 'Quantum Cloud Ltd', email: 'jobs@quantumcloud.com', status: 'Approved', category: 'Cloud Infrastructure', registeredDate: '2026-08-05' },
    { id: 104, name: 'Nexus Logistics', email: 'careers@nexuslog.com', status: 'Pending', category: 'Supply Chain', registeredDate: '2026-08-11' },
    { id: 105, name: 'BioGenix Labs', email: 'info@biogenix.org', status: 'Suspended', category: 'Healthcare', registeredDate: '2026-07-29' },
  ])

  // Notifications state
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'System Maintenance Scheduled', audience: 'All Users', priority: 'High', date: '2026-08-12', message: 'Platform will undergo maintenance on Sunday from 02:00 UTC to 04:00 UTC.' },
    { id: 2, title: 'Company Verification Reminder', audience: 'Companies', priority: 'Normal', date: '2026-08-11', message: 'Please update your tax clearance documentation before the month end.' }
  ])
  const [notifForm, setNotifForm] = useState({ title: '', audience: 'All Users', priority: 'Normal', message: '' })

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true)
    try {
      const response = await getUsers()
      setUsers(response.data.users || [])
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load users'
      toast.error(msg)
    } finally {
      setLoadingUsers(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleCreateUser = async (userData) => {
    try {
      const response = await createUser(userData)
      setUsers((prev) => [...prev, response.data.user])
      toast.success(`User ${response.data.user.name} created successfully!`)
      Swal.fire({
        title: 'User Created!',
        text: `${response.data.user.name} (${response.data.user.email}) added to MySQL database.`,
        icon: 'success',
        confirmButtonColor: '#65DCD5',
      })
      return true
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create user'
      toast.error(msg)
      Swal.fire({
        title: 'Creation Error',
        text: msg,
        icon: 'error',
        confirmButtonColor: '#65DCD5',
      })
      return false
    }
  }

  const handleUserUpdate = async (id, userData) => {
    try {
      const response = await updateUser(id, userData)
      setUsers((prev) =>
        prev.map((item) => (item.id === id ? response.data.user : item)),
      )
      toast.success(`User updated successfully!`)
      Swal.fire({
        title: 'User Saved!',
        text: `${response.data.user.name} (${response.data.user.email}) stored in database.`,
        icon: 'success',
        confirmButtonColor: '#65DCD5',
      })
      return true
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update user'
      toast.error(msg)
      Swal.fire({
        title: 'Update Error',
        text: msg,
        icon: 'error',
        confirmButtonColor: '#65DCD5',
      })
      return false
    }
  }

  const handleRoleChange = async (id, role) => {
    const targetUser = users.find((item) => item.id === id)
    if (!targetUser || role === targetUser.role) {
      setPendingRoles((prev) => ({ ...prev, [id]: undefined }))
      return
    }

    setPendingRoles((prev) => ({ ...prev, [id]: role }))

    const result = await Swal.fire({
      title: 'Change user role?',
      html: `Set <strong>${targetUser.email}</strong> as <strong>${role}</strong>?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#65DCD5',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, update',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    })

    if (!result.isConfirmed) {
      setPendingRoles((prev) => ({ ...prev, [id]: undefined }))
      return
    }

    try {
      const response = await updateUserRole(id, role)
      setUsers((prev) =>
        prev.map((item) => (item.id === id ? response.data.user : item)),
      )
      setPendingRoles((prev) => ({ ...prev, [id]: undefined }))
      toast.success(`Role updated for ${response.data.user.email}`)
      Swal.fire({
        title: 'Role updated!',
        text: `${response.data.user.email} is now ${response.data.user.role}.`,
        icon: 'success',
        confirmButtonColor: '#65DCD5',
      })
    } catch (err) {
      setPendingRoles((prev) => ({ ...prev, [id]: undefined }))
      const msg = err.response?.data?.message || 'Failed to update role'
      toast.error(msg)
      Swal.fire({
        title: 'Error',
        text: msg,
        icon: 'error',
        confirmButtonColor: '#65DCD5',
      })
    }
  }

  const handleDelete = async (user) => {
    const result = await Swal.fire({
      title: 'Delete user?',
      text: `You are about to delete "${user.email}". This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    })

    if (!result.isConfirmed) return

    try {
      await deleteUser(user.id)
      setUsers((prev) => prev.filter((item) => item.id !== user.id))
      toast.success(`User "${user.email}" deleted`)
      Swal.fire({
        title: 'Deleted!',
        text: `User "${user.email}" was deleted from database.`,
        icon: 'success',
        confirmButtonColor: '#65DCD5',
      })
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete user'
      toast.error(msg)
      Swal.fire({
        title: 'Error',
        text: msg,
        icon: 'error',
        confirmButtonColor: '#65DCD5',
      })
    }
  }

  const handleUpdateCompanyStatus = (id, status) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c)),
    )
    toast.success(`Company status updated to ${status}`)
  }

  const handleSendNotification = (e) => {
    e.preventDefault()
    if (!notifForm.title || !notifForm.message) {
      toast.error('Please fill in title and message')
      return
    }
    const newNotif = {
      id: Date.now(),
      title: notifForm.title,
      audience: notifForm.audience,
      priority: notifForm.priority,
      date: new Date().toISOString().split('T')[0],
      message: notifForm.message,
    }
    setNotifications((prev) => [newNotif, ...prev])
    setNotifForm({ title: '', audience: 'All Users', priority: 'Normal', message: '' })
    toast.success('Broadcast notification sent successfully!')
  }

  const handleDeleteNotif = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    toast.info('Notification removed')
  }

  return (
    <div className="admin-layout">
      {/* Admin Sidebar Component */}
      <AdminSidebar
        users={users}
        companies={companies}
        notifications={notifications}
        currentUser={currentUser}
      />

      {/* Nested Route Views */}
      <main className="admin-content">
        <Routes>
          <Route
            path="/"
            element={
              <AdminDashboardView
                users={users}
                companies={companies}
                fetchUsers={fetchUsers}
                currentUser={currentUser}
              />
            }
          />
          <Route
            path="/users"
            element={
              <AdminUsersPage
                users={users}
                loadingUsers={loadingUsers}
                currentUser={currentUser}
                handleCreateUser={handleCreateUser}
                handleUserUpdate={handleUserUpdate}
                handleDelete={handleDelete}
              />
            }
          />
          <Route
            path="/companies"
            element={
              <AdminCompaniesPage
                companies={companies}
                handleUpdateCompanyStatus={handleUpdateCompanyStatus}
              />
            }
          />
          <Route
            path="/notifications"
            element={
              <AdminNotificationsPage
                notifications={notifications}
                handleSendNotification={handleSendNotification}
                handleDeleteNotif={handleDeleteNotif}
                notifForm={notifForm}
                setNotifForm={setNotifForm}
              />
            }
          />
        </Routes>
      </main>
    </div>
  )
}
