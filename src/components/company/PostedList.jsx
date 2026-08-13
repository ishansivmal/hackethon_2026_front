export default function PostedList({ icon, title, subtitle, emptyText, items, renderItem }) {
  return (
    <section className="cd-posted">
      <div className="cd-posted-header">
        <span className="cd-posted-emoji">{icon}</span>
        <div>
          <h3 className="cd-posted-title">{title}</h3>
          <p className="cd-posted-sub">{subtitle}</p>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="cd-posted-grid">
          {items.map((item) => renderItem(item))}
        </div>
      ) : (
        <p className="cd-posted-empty">{emptyText}</p>
      )}
    </section>
  )
}
