import { useCallback, useEffect, useState } from 'react'
import { deleteUser, getUsers, updateUserRole } from '../api/admin'
import { useAuth } from '../context/useAuth'

export default function AdminDashboard() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

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
    setError('')
    setMessage('')
    try {
      const response = await updateUserRole(id, role)
      setUsers((prev) =>
        prev.map((user) => (user.id === id ? response.data.user : user)),
      )
      setMessage(`Role updated for ${response.data.user.email}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update role')
    }
  }

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete user "${user.email}"? This cannot be undone.`)) {
      return
    }

    setError('')
    setMessage('')
    try {
      await deleteUser(user.id)
      setUsers((prev) => prev.filter((item) => item.id !== user.id))
      setMessage(`User "${user.email}" deleted`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user')
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
                    <td>{user.email}</td>
                    <td>
                      <select
                        className="role-select"
                        value={user.role}
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
