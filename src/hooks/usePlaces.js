import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlaces, selectPlaceCount, selectPlaceFacets, selectPlacesError, selectPlacesList, selectPlacesStatus } from '../features/places/placesSlice.js';

export default function usePlaces(query) {
  const dispatch = useDispatch();
  const [reloadToken, setReloadToken] = useState(0);
  const places = useSelector(selectPlacesList);
  const total = useSelector(selectPlaceCount);
  const facets = useSelector(selectPlaceFacets);
  const status = useSelector(selectPlacesStatus);
  const error = useSelector(selectPlacesError);

  useEffect(() => {
    const request = dispatch(fetchPlaces(query));
    return () => request.abort();
  }, [dispatch, query.search, query.category, query.region, query.status, query.sort, query.page, reloadToken]);

  const reload = useCallback(() => setReloadToken((token) => token + 1), []);
  const page = useSelector((state) => state.places.page);
  const totalPages = useSelector((state) => state.places.totalPages);
  const requestedPage = useSelector((state) => state.places.requestedPage);
  return { places, total, facets, status, error, page, totalPages, requestedPage, reload };
}
