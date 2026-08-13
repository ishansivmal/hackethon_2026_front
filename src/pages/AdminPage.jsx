import { useCallback, useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import {
  createCompany as createCompanyApi,
  createUser,
  deleteCompany as deleteCompanyApi,
  deleteUser,
  getCompanies,
  getUsers,
  updateCompany as updateCompanyApi,
  updateCompanyStatus as updateCompanyStatusApi,
  updateUser,
} from '../api/admin'
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

  // Companies state
  const [companies, setCompanies] = useState([])

  // Notifications state
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'System Maintenance Scheduled', audience: 'All Users', priority: 'High', date: '2026-08-12', message: 'Platform will undergo maintenance on Sunday from 02:00 UTC to 04:00 UTC.' },
    { id: 2, title: 'Company Verification Reminder', audience: 'Companies', priority: 'Normal', date: '2026-08-11', message: 'Please update your tax clearance documentation before the month end.' }
  ])
  const [notifForm, setNotifForm] = useState({ title: '', audience: 'All Users', priority: 'Normal', message: '' })

  const fetchUsers = useCallback(async () => {
    try {
      const response = await getUsers()
      setUsers(response.data.users || [])
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load users'
      toast.error(msg)
    }
  }, [])

  const fetchCompanies = useCallback(async () => {
    try {
      const response = await getCompanies()
      setCompanies(response.data.companies || [])
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load companies'
      toast.error(msg)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
    fetchCompanies()
  }, [fetchUsers, fetchCompanies])

  const handleCreateUser = async (userData) => {
    try {
      const response = await createUser(userData)
      setUsers((prev) => [...prev, response.data.user])
      toast.success(`User ${response.data.user.name} created successfully!`)
      Swal.fire({
        title: 'User Created!',
        text: `${response.data.user.name} (${response.data.user.email}) added to MySQL database.`,
        icon: 'success',
        confirmButtonColor: '#2196F3',
      })
      return true
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create user'
      toast.error(msg)
      Swal.fire({
        title: 'Creation Error',
        text: msg,
        icon: 'error',
        confirmButtonColor: '#2196F3',
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
        confirmButtonColor: '#2196F3',
      })
      return true
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update user'
      toast.error(msg)
      Swal.fire({
        title: 'Update Error',
        text: msg,
        icon: 'error',
        confirmButtonColor: '#2196F3',
      })
      return false
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
        confirmButtonColor: '#2196F3',
      })
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete user'
      toast.error(msg)
      Swal.fire({
        title: 'Error',
        text: msg,
        icon: 'error',
        confirmButtonColor: '#2196F3',
      })
    }
  }

  const handleCreateCompany = async (companyData) => {
    try {
      const response = await createCompanyApi(companyData)
      setCompanies((prev) => [...prev, response.data.company])
      toast.success(`Company "${response.data.company.name}" created successfully!`)
      Swal.fire({
        title: 'Company Created!',
        text: `${response.data.company.name} added to database.`,
        icon: 'success',
        confirmButtonColor: '#2196F3',
      })
      return true
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create company'
      toast.error(msg)
      Swal.fire({ title: 'Error', text: msg, icon: 'error', confirmButtonColor: '#2196F3' })
      return false
    }
  }

  const handleUpdateCompany = async (id, companyData) => {
    try {
      const response = await updateCompanyApi(id, companyData)
      setCompanies((prev) =>
        prev.map((c) => (c.id === id ? response.data.company : c)),
      )
      toast.success(`Company details updated!`)
      Swal.fire({
        title: 'Company Saved!',
        text: `Details updated in database.`,
        icon: 'success',
        confirmButtonColor: '#2196F3',
      })
      return true
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update company'
      toast.error(msg)
      Swal.fire({ title: 'Error', text: msg, icon: 'error', confirmButtonColor: '#2196F3' })
      return false
    }
  }

  const handleDeleteCompany = async (company) => {
    const result = await Swal.fire({
      title: 'Delete company record?',
      text: `Are you sure you want to delete "${company.name}"?`,
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
      await deleteCompanyApi(company.id)
      setCompanies((prev) => prev.filter((c) => c.id !== company.id))
      toast.success(`Company "${company.name}" deleted`)
      Swal.fire({
        title: 'Deleted!',
        text: `Company "${company.name}" was removed from database.`,
        icon: 'success',
        confirmButtonColor: '#2196F3',
      })
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete company'
      toast.error(msg)
      Swal.fire({ title: 'Error', text: msg, icon: 'error', confirmButtonColor: '#2196F3' })
    }
  }

  const handleUpdateCompanyStatus = async (id, status) => {
    try {
      const response = await updateCompanyStatusApi(id, status)
      setCompanies((prev) =>
        prev.map((c) => (c.id === id ? response.data.company : c)),
      )
      toast.success(`Company status updated to ${status}`)
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update company status'
      toast.error(msg)
    }
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
                handleCreateCompany={handleCreateCompany}
                handleUpdateCompany={handleUpdateCompany}
                handleDeleteCompany={handleDeleteCompany}
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
