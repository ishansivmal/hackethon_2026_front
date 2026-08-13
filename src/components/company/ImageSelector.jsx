import { useRef } from 'react'
import { FaImage, FaTimes } from 'react-icons/fa'

export default function ImageSelector({ id, preview, onChange }) {
  const inputRef = useRef(null)

  const pick = () => inputRef.current?.click()

  const handleChange = (e) => {
    const file = e.target.files?.[0] || null
    onChange(file)
    e.target.value = ''
  }

  return (
    <div className="cd-upload">
      <input
        ref={inputRef}
        id={id}
        className="cd-upload-input"
        type="file"
        accept="image/*"
        onChange={handleChange}
        hidden
      />
      {preview ? (
        <div className="cd-upload-preview">
          <img src={preview} alt="Selected preview" />
          <button
            type="button"
            className="cd-upload-remove"
            onClick={() => onChange(null)}
          >
            <FaTimes /> Remove
          </button>
        </div>
      ) : (
        <button type="button" className="cd-upload-box" onClick={pick}>
          <span className="cd-upload-icon"><FaImage /></span>
          <span>Upload an image</span>
        </button>
      )}
    </div>
  )
}
