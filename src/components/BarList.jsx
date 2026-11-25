import { Link } from 'react-router';

/**
 * BarList — a breakdown as horizontal bars. Every row links to the
 * places list with the matching filter.
 */
export default function BarList({ title, items, getLink }) {
  const max = Math.max(1, ...items.map((item) => item.count));

  return (
    <section className="breakdown">
      <h2 className="breakdown__title">{title}</h2>
      {items.length === 0 ? (
        <p className="breakdown__empty">No data.</p>
      ) : (
        <ul className="breakdown__list">
          {items.map((item) => (
            <li key={item.label}>
              <Link to={getLink(item)} className="breakdown__row">
                <span className="breakdown__label">{item.label}</span>
                <span className="breakdown__track" aria-hidden="true">
                  <span className="breakdown__bar" style={{ width: `${(item.count / max) * 100}%` }} />
                </span>
                <span className="breakdown__count">{item.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
