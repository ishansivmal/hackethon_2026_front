const GOOGLE_SCRIPT_SRC = 'https://accounts.google.com/gsi/client'

export function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts) {
      resolve()
      return
    }

    const existing = document.getElementById('google-gsi')
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('Failed to load Google script')))
      return
    }

    const script = document.createElement('script')
    script.id = 'google-gsi'
    script.src = GOOGLE_SCRIPT_SRC
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Google script'))
    document.head.appendChild(script)
  })
}
