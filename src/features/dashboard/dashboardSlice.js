import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { getAllPlaces } from '../../services/service.js';

export const fetchDashboardPlaces = createAsyncThunk('dashboard/fetchPlaces', () => getAllPlaces());
const slice = createSlice({
  name: 'dashboard', initialState: { status: 'idle', places: [], error: null, currentRequestId: null }, reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchDashboardPlaces.pending, (state, action) => { state.status = 'loading'; state.error = null; state.currentRequestId = action.meta.requestId; })
      .addCase(fetchDashboardPlaces.fulfilled, (state, action) => { if (state.currentRequestId !== action.meta.requestId) return; state.status = action.payload.length ? 'success' : 'empty'; state.places = action.payload; state.currentRequestId = null; })
      .addCase(fetchDashboardPlaces.rejected, (state, action) => { if (state.currentRequestId !== action.meta.requestId) return; state.currentRequestId = null; if (action.meta.aborted) { state.status = state.places.length ? 'success' : 'idle'; return; } state.status = 'error'; state.error = action.error.message || 'Could not load dashboard'; });
  },
});
const selectDashboardPlaces = (state) => state.dashboard.places;
export const selectDashboardStatus = (state) => state.dashboard.status;
export const selectDashboardError = (state) => state.dashboard.error;
export const selectDashboardRegions = createSelector([selectDashboardPlaces], (places) => [...new Set(places.map((place) => place.region).filter(Boolean))].sort());
export const selectTopRatedPlaces = createSelector([selectDashboardPlaces], (places) => [...places].sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0) || a.name.localeCompare(b.name)).slice(0, 4));
export const selectFilteredTopRatedPlaces = createSelector(
  [selectDashboardPlaces, (_state, region) => region, (_state, _region, status) => status],
  (places, region, status) => places.filter((place) => (!region || place.region === region) && (!status || place.status === status))
    .sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0) || a.name.localeCompare(b.name)).slice(0, 4),
);
export default slice.reducer;
