import { Link } from 'react-router';
import { formatPrice, formatRating } from '../utils/format.js';

/** PlaceCard — reusable card. The whole card is a link to /places/:id. */
export default function PlaceCard({ place }) {
  return (
    <li className="card">
      <Link to={`/places/${place.id}`} className="card__button">
        <span className="card__media">
          <img src={place.image} alt="" loading="lazy" />
          <span className="badge badge--category">{place.category}</span>
          {place.featured ? <span className="badge badge--featured">Featured</span> : null}
        </span>

        <span className="card__body">
          <span className="card__title">{place.name}</span>
          <span className="card__place">{place.city}</span>

          <span className="card__meta">
            <span className="card__rating" title={`Rating ${formatRating(place.rating)} / 5`}>
              ★ {formatRating(place.rating)}
            </span>
            <span className="card__price">{formatPrice(place.price)}</span>
            <span className={`card__status card__status--${place.status}`}>{place.status}</span>
            {place.completed ? <span className="card__done">visited</span> : null}
          </span>
        </span>
      </Link>
    </li>
  );
}
