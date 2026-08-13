import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import { deleteInternship, deleteJob, deleteProblem } from '../api/company'

const TYPES = {
  internship: {
    label: 'internship',
    api: deleteInternship,
    name: (item) => item.title,
  },
  job: {
    label: 'job',
    api: deleteJob,
    name: (item) => item.position,
  },
  problem: {
    label: 'problem',
    api: deleteProblem,
    name: (item) => item.description,
  },
}

// Asks the user to confirm, then deletes the posting. Returns true when deleted.
export default async function deletePosted(type, item) {
  const config = TYPES[type]

  if (!config) return false

  const label = config.label
  const name = config.name(item) || 'this posting'
  const id = item.id ?? item.job_ID ?? item.problem_ID

  const result = await Swal.fire({
    title: `Delete ${label}?`,
    text: `You are about to delete "${name}". This action cannot be undone.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, delete',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
  })

  if (!result.isConfirmed) return false

  try {
    await config.api(id)
    toast.success(`${label[0].toUpperCase() + label.slice(1)} deleted`)
    Swal.fire({
      title: 'Deleted!',
      text: `The ${label} was deleted.`,
      icon: 'success',
      confirmButtonColor: '#2196F3',
    })
    return true
  } catch (err) {
    const msg = err.response?.data?.message || `Failed to delete ${label}`
    toast.error(msg)
    Swal.fire({
      title: 'Error',
      text: msg,
      icon: 'error',
      confirmButtonColor: '#2196F3',
    })
    return false
  }
}
