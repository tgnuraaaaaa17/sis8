import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { savePlace } from '../features/places/placesSlice.js';
import { EMPTY_DRAFT } from '../utils/constants.js';

/**
 * State and submit logic of the create / edit form.
 * `onSaved(savedPlace, mode)` runs after the API confirms the change.
 */
export default function usePlaceForm({ onSaved }) {
  const dispatch = useDispatch();
  const [mode, setMode] = useState(null); // null | 'create' | 'edit'
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [status, setStatus] = useState('idle'); // idle | saving | error
  const [error, setError] = useState('');

  function startCreate() {
    setDraft(EMPTY_DRAFT);
    setError('');
    setStatus('idle');
    setMode('create');
  }

  function startEdit(place) {
    if (!place) return;

    setDraft({
      id: place.id,
      name: place.name || '',
      description: place.description || '',
      category: place.category || 'Nature',
      city: place.city || '',
      region: place.region || '',
      price: String(place.price ?? ''),
      rating: String(place.rating ?? ''),
      visitHours: String(place.visitHours ?? ''),
      status: place.status || 'open',
      featured: Boolean(place.featured),
      tags: Array.isArray(place.tags) ? place.tags.join(', ') : String(place.tags || ''),
    });
    setError('');
    setStatus('idle');
    setMode('edit');
  }

  function change(field, value) {
    setDraft((previous) => ({ ...previous, [field]: value }));
  }

  function cancel() {
    setMode(null);
    setError('');
    setStatus('idle');
  }

  function submit(event) {
    event.preventDefault();
    if (status === 'saving') return;

    const values = {
      name: draft.name.trim(),
      description: draft.description.trim(),
      category: draft.category,
      city: draft.city.trim(),
      region: draft.region.trim(),
      price: Number(draft.price) || 0,
      rating: Number(draft.rating) || 0,
      visitHours: Number(draft.visitHours) || 0,
      status: draft.status,
      featured: Boolean(draft.featured),
      tags: draft.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    if (!values.name) {
      setStatus('error');
      setError('The name field is required.');
      return;
    }

    const savedMode = mode;
    setStatus('saving');
    setError('');

    dispatch(savePlace({ id: savedMode === 'edit' ? draft.id : null, values }))
      .unwrap()
      .then((saved) => {
        setStatus('idle');
        setMode(null);
        setDraft(EMPTY_DRAFT);
        onSaved(saved, savedMode);
      })
      .catch((requestError) => {
        setStatus('error');
        setError(requestError?.message || 'The place could not be saved.');
      });
  }

  return { mode, draft, status, error, startCreate, startEdit, change, cancel, submit };
}
