import { CATEGORIES } from '../utils/constants.js';

/** PlaceForm — create / edit form. Its values live in the parent (see hooks/usePlaceForm.js). */
export default function PlaceForm({ mode, draft, status, error, onChange, onSubmit, onCancel }) {
  const isCreate = mode === 'create';
  const isSaving = status === 'saving';

  function update(field, value) {
    onChange(field, value);
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <h3 className="form__title">{isCreate ? 'Add a new place' : `Edit “${draft.name}”`}</h3>

      {error ? <p className="form__error">{error}</p> : null}

      <div className="form__grid">
        <label className="field">
          <span className="field__label">Name *</span>
          <input
            className="field__input"
            type="text"
            value={draft.name}
            onChange={(event) => update('name', event.target.value)}
            placeholder="Charyn Canyon"
            required
          />
        </label>

        <label className="field">
          <span className="field__label">Category</span>
          <select
            className="field__input"
            value={draft.category}
            onChange={(event) => update('category', event.target.value)}
          >
            {CATEGORIES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field__label">City / district</span>
          <input
            className="field__input"
            type="text"
            value={draft.city}
            onChange={(event) => update('city', event.target.value)}
            placeholder="Almaty region"
          />
        </label>

        <label className="field">
          <span className="field__label">Region</span>
          <input
            className="field__input"
            type="text"
            value={draft.region}
            onChange={(event) => update('region', event.target.value)}
            placeholder="Almaty"
          />
        </label>

        <label className="field">
          <span className="field__label">Ticket price ($)</span>
          <input
            className="field__input"
            type="number"
            min="0"
            step="100"
            value={draft.price}
            onChange={(event) => update('price', event.target.value)}
            placeholder="4500"
          />
        </label>

        <label className="field">
          <span className="field__label">Rating (0–5)</span>
          <input
            className="field__input"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={draft.rating}
            onChange={(event) => update('rating', event.target.value)}
            placeholder="4.8"
          />
        </label>

        <label className="field">
          <span className="field__label">Time to visit (hours)</span>
          <input
            className="field__input"
            type="number"
            min="0"
            step="1"
            value={draft.visitHours}
            onChange={(event) => update('visitHours', event.target.value)}
            placeholder="4"
          />
        </label>

        <label className="field">
          <span className="field__label">Status</span>
          <select
            className="field__input"
            value={draft.status}
            onChange={(event) => update('status', event.target.value)}
          >
            <option value="open">Open to visit</option>
            <option value="seasonal">Seasonal only</option>
            <option value="closed">Closed</option>
          </select>
        </label>

        <label className="field field--wide">
          <span className="field__label">Description</span>
          <textarea
            className="field__input"
            rows="3"
            value={draft.description}
            onChange={(event) => update('description', event.target.value)}
            placeholder="Red sandstone canyon carved by the Kengaryk river…"
          />
        </label>

        <label className="field field--wide">
          <span className="field__label">Tags (comma separated)</span>
          <input
            className="field__input"
            type="text"
            value={draft.tags}
            onChange={(event) => update('tags', event.target.value)}
            placeholder="canyon, hiking, photography"
          />
        </label>

        <label className="field field--checkbox">
          <input
            type="checkbox"
            checked={Boolean(draft.featured)}
            onChange={(event) => update('featured', event.target.checked)}
          />
          <span className="field__label">Featured</span>
        </label>
      </div>

      <div className="form__actions">
        <button type="submit" className="btn btn--primary" disabled={isSaving}>
          {isSaving ? 'Saving…' : isCreate ? 'Create place' : 'Save changes'}
        </button>
        <button type="button" className="btn btn--ghost" onClick={onCancel} disabled={isSaving}>
          Cancel
        </button>
      </div>
    </form>
  );
}
