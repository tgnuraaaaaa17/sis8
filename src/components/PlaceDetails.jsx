import {
  formatDate,
  formatHours,
  formatPrice,
  formatRating,
  formatStatus,
  formatTime,
} from '../utils/format.js';

/** PlaceDetails — the full record of one place (12 meaningful fields). */
export default function PlaceDetails({
  place,
  loadedAt,
  isPending,
  onToggleVisited,
  onEdit,
  onDelete,
  onReload,
}) {
  return (
    <article className="detail">
      <div className="detail__media">
        <img src={place.image} alt="" />
        <div className="detail__badges">
          <span className="badge badge--category">{place.category}</span>
          {place.featured ? <span className="badge badge--featured">Featured</span> : null}
          {place.completed ? <span className="badge badge--done">Visited</span> : null}
        </div>
      </div>

      <div className="detail__body">
        <h1 className="detail__title">{place.name}</h1>
        <p className="panel__subtitle">
          #{place.id} · loaded at {formatTime(loadedAt)}
        </p>
        <p className="panel__description">{place.description || 'No description provided.'}</p>

        <dl className="details">
          <div className="details__row">
            <dt>Category</dt>
            <dd>{place.category || '—'}</dd>
          </div>
          <div className="details__row">
            <dt>City / district</dt>
            <dd>{place.city || '—'}</dd>
          </div>
          <div className="details__row">
            <dt>Region</dt>
            <dd>{place.region || '—'}</dd>
          </div>
          <div className="details__row">
            <dt>Ticket price</dt>
            <dd>{formatPrice(place.price)}</dd>
          </div>
          <div className="details__row">
            <dt>Rating</dt>
            <dd>★ {formatRating(place.rating)} / 5</dd>
          </div>
          <div className="details__row">
            <dt>Time to visit</dt>
            <dd>{formatHours(place.visitHours)}</dd>
          </div>
          <div className="details__row">
            <dt>Status</dt>
            <dd>{formatStatus(place.status)}</dd>
          </div>
          <div className="details__row">
            <dt>Visited</dt>
            <dd>{place.completed ? 'Yes' : 'Not yet'}</dd>
          </div>
          <div className="details__row">
            <dt>Featured</dt>
            <dd>{place.featured ? 'Yes' : 'No'}</dd>
          </div>
          <div className="details__row">
            <dt>Tags</dt>
            <dd>
              {place.tags && place.tags.length > 0 ? (
                <span className="tags">
                  {place.tags.map((tag) => (
                    <span className="tags__item" key={tag}>
                      #{tag}
                    </span>
                  ))}
                </span>
              ) : (
                '—'
              )}
            </dd>
          </div>
          <div className="details__row">
            <dt>Added on</dt>
            <dd>{formatDate(place.createdAt)}</dd>
          </div>
        </dl>

        <div className="panel__actions">
          <button
            type="button"
            className="btn btn--primary"
            onClick={onToggleVisited}
            disabled={isPending}
          >
            {isPending ? 'Saving…' : place.completed ? 'Mark as not visited' : 'Mark as visited'}
          </button>
          <button type="button" className="btn" onClick={onEdit} disabled={isPending}>
            Edit
          </button>
          <button type="button" className="btn btn--danger" onClick={onDelete} disabled={isPending}>
            Remove
          </button>
          <button type="button" className="btn btn--ghost" onClick={onReload} disabled={isPending}>
            Reload details
          </button>
        </div>
      </div>
    </article>
  );
}
