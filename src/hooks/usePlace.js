import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlace } from '../features/placeDetails/placeDetailsSlice.js';

export default function usePlace(id) {
  const dispatch = useDispatch();
  const [reloadToken, setReloadToken] = useState(0);
  const { status, place, error, loadedAt } = useSelector((state) => state.placeDetails);
  useEffect(() => {
    const request = dispatch(fetchPlace(id));
    return () => request.abort();
  }, [dispatch, id, reloadToken]);
  const reload = useCallback(() => setReloadToken((token) => token + 1), []);
  return { status, place, error, loadedAt, reload };
}
