import '../styles/Pagination.css'

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50]

export default function Pagination({ page, totalPages, total, pageSize, onPageChange, onPageSizeChange }) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  const pages = []
  for (let p = 1; p <= totalPages; p += 1) {
    if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) {
      pages.push(p)
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…')
    }
  }

  return (
    <div className="cd-pagination">
      <div className="cd-pagination-info">
        Showing <strong>{from}–{to}</strong> of <strong>{total}</strong>
      </div>
      <div className="cd-pagination-pages">
        <button
          type="button"
          className="cd-pagination-btn"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          ‹
        </button>
        {pages.map((p, idx) =>
          p === '…' ? (
            <span key={`ellipsis-${idx}`} className="cd-pagination-ellipsis">…</span>
          ) : (
            <button
              key={p}
              type="button"
              className={`cd-pagination-btn${p === page ? ' cd-pagination-btn--active' : ''}`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          )
        )}
        <button
          type="button"
          className="cd-pagination-btn"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          ›
        </button>
      </div>
      <label className="cd-pagination-size">
        Rows per page
        <select value={pageSize} onChange={onPageSizeChange}>
          {PAGE_SIZE_OPTIONS.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </label>
    </div>
  )
}
