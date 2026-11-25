/** PlaceListSkeleton — placeholder cards shown while the list is loading. */
export default function PlaceListSkeleton({ count = 6 }) {
  const blocks = Array.from({ length: count }, (_, index) => index);

  return (
    <ul className="card-list card-list--grid" aria-hidden="true">
      {blocks.map((index) => (
        <li className="card card--skeleton" key={index}>
          <span className="skeleton__media" />
          <span className="card__body">
            <span className="skeleton__row skeleton__row--title" />
            <span className="skeleton__row" />
            <span className="skeleton__row skeleton__row--short" />
          </span>
        </li>
      ))}
    </ul>
  );
}
