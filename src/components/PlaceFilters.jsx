import { SORT_OPTIONS, STATUS_OPTIONS } from '../utils/constants.js';

/** Makes sure the value taken from the URL is always one of the options. */
function withSelected(options, selected) {
  return selected && !options.includes(selected) ? [...options, selected] : options;
}

/**
 * PlaceFilters — search, category / region / status filters, sorting.
 * Everything is controlled by the URL (see PlacesPage).
 */
export default function PlaceFilters({
  values,
  facets,
  isLoading,
  hasActiveFilters,
  onChange,
  onReset,
  onReload,
  onCreate,
}) {
  return (
    <section className="toolbar" aria-label="Search and filters">
      <div className="toolbar__row">
        <label className="search">
          <span className="search__icon" aria-hidden="true">
            ⌕
          </span>
          <input
            className="search__input"
            type="search"
            value={values.q}
            placeholder="Search by name or description…"
            onChange={(event) => onChange('q', event.target.value)}
          />
        </label>

        <button type="button" className="btn btn--ghost" onClick={onReload} disabled={isLoading}>
          {isLoading ? '⟳ Loading…' : '⟳ Reload'}
        </button>
        <button type="button" className="btn btn--primary" onClick={onCreate}>
          + Add place
        </button>
      </div>

      <div className="toolbar__row toolbar__row--filters">
        <label className="select">
          <span className="select__label">Category</span>
          <select
            className="select__input"
            value={values.category}
            onChange={(event) => onChange('category', event.target.value)}
          >
            <option value="">All</option>
            {withSelected(facets.categories, values.category).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="select">
          <span className="select__label">Region</span>
          <select
            className="select__input"
            value={values.region}
            onChange={(event) => onChange('region', event.target.value)}
          >
            <option value="">All</option>
            {withSelected(facets.regions, values.region).map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </label>

        <label className="select">
          <span className="select__label">Status</span>
          <select
            className="select__input"
            value={values.status}
            onChange={(event) => onChange('status', event.target.value)}
          >
            <option value="">All</option>
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="select">
          <span className="select__label">Sort</span>
          <select
            className="select__input"
            value={values.sort}
            onChange={(event) => onChange('sort', event.target.value)}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        {hasActiveFilters ? (
          <button type="button" className="btn btn--ghost btn--small" onClick={onReset}>
            Reset filters
          </button>
        ) : null}
      </div>
    </section>
  );
}
