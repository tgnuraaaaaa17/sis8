import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardPlaces, selectDashboardError, selectDashboardStatus } from '../features/dashboard/dashboardSlice.js';

export default function useAllPlaces() {
  const dispatch = useDispatch();
  const [reloadToken, setReloadToken] = useState(0);
  const places = useSelector((state) => state.dashboard.places);
  const status = useSelector(selectDashboardStatus);
  const error = useSelector(selectDashboardError);
  useEffect(() => {
    const request = dispatch(fetchDashboardPlaces());
    return () => request.abort();
  }, [dispatch, reloadToken]);
  const reload = useCallback(() => setReloadToken((token) => token + 1), []);
  return { status, places, error, reload };
}
