import { useCallback, useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { deleteUser, getUsers, updateUserRole } from '../api/admin'
import { useAuth } from '../context/useAuth'

export default function AdminDashboard() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [pendingRoles, setPendingRoles] = useState({})

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await getUsers()
      setUsers(response.data.users)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleRoleChange = async (id, role) => {
    const user = users.find((item) => item.id === id)
    if (!user || role === user.role) {
      setPendingRoles((prev) => ({ ...prev, [id]: undefined }))
      return
    }

    setPendingRoles((prev) => ({ ...prev, [id]: role }))

    const result = await Swal.fire({
      title: 'Change role?',
      html: `Set <strong>${user.email}</strong> as <strong>${role}</strong>?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#aa3bff',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, update',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    })

    if (!result.isConfirmed) {
      setPendingRoles((prev) => ({ ...prev, [id]: undefined }))
      return
    }

    setError('')
    setMessage('')
    try {
      const response = await updateUserRole(id, role)
      setUsers((prev) =>
        prev.map((item) => (item.id === id ? response.data.user : item)),
      )
      setPendingRoles((prev) => ({ ...prev, [id]: undefined }))
      setMessage(`Role updated for ${response.data.user.email}`)

      Swal.fire({
        title: 'Role updated!',
        text: `${response.data.user.email} is now ${response.data.user.role}.`,
        icon: 'success',
        confirmButtonColor: '#aa3bff',
      })
    } catch (err) {
      setPendingRoles((prev) => ({ ...prev, [id]: undefined }))
      setError(err.response?.data?.message || 'Failed to update role')

      Swal.fire({
        title: 'Error',
        text: err.response?.data?.message || 'Failed to update role',
        icon: 'error',
        confirmButtonColor: '#aa3bff',
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

    setError('')
    setMessage('')
    try {
      await deleteUser(user.id)
      setUsers((prev) => prev.filter((item) => item.id !== user.id))
      setMessage(`User "${user.email}" deleted`)

      Swal.fire({
        title: 'Deleted!',
        text: `User "${user.email}" was deleted.`,
        icon: 'success',
        confirmButtonColor: '#aa3bff',
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user')

      Swal.fire({
        title: 'Error',
        text: err.response?.data?.message || 'Failed to delete user',
        icon: 'error',
        confirmButtonColor: '#aa3bff',
      })
    }
  }

  return (
    <section className="admin">
      <h1>Admin Panel</h1>
      <p className="auth-subtitle">Manage users and roles</p>

      <div className="admin-tabs">
        <button type="button" className="admin-tab active">
          User Management
        </button>
      </div>

      {error && <div className="auth-error">{error}</div>}
      {message && <div className="auth-success">{message}</div>}

      {loading ? (
        <p className="page-message">Loading users...</p>
      ) : (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const isSelf = user.id === currentUser.id
                return (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td className="email-col">{user.email}</td>
                    <td>
                      <select
                        className="role-select"
                        value={pendingRoles[user.id] ?? user.role}
                        disabled={isSelf}
                        onChange={(event) =>
                          handleRoleChange(user.id, event.target.value)
                        }
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger"
                        disabled={isSelf}
                        onClick={() => handleDelete(user)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
