import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { createPlace, updatePlace } from '../../services/service.js';
import { getPlaces } from '../../services/service.js';

export const fetchPlaces = createAsyncThunk('places/fetchList', (query, { signal }) =>
  getPlaces(query, { signal }),
);

export const savePlace = createAsyncThunk('places/save', async ({ id, values }) => (
  id ? updatePlace(id, values) : createPlace(values)
));

const initialState = { status: 'idle', items: [], total: 0, totalPages: 1, page: 1, requestedPage: 1, facets: { categories: [], regions: [] }, error: null, currentRequestId: null };

const placesSlice = createSlice({
  name: 'places',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchPlaces.pending, (state, action) => {
        state.status = 'loading'; state.error = null; state.requestedPage = action.meta.arg.page;
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(fetchPlaces.fulfilled, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;
        state.status = action.payload.total ? 'success' : 'empty'; state.items = action.payload.data;
        state.total = action.payload.total; state.page = action.payload.page; state.totalPages = action.payload.totalPages;
        state.facets = action.payload.facets; state.currentRequestId = null;
      })
      .addCase(fetchPlaces.rejected, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;
        state.currentRequestId = null;
        if (action.meta.aborted) { state.status = state.items.length ? 'success' : 'idle'; return; }
        state.status = 'error'; state.items = []; state.total = 0; state.error = action.error.message || 'Could not load places';
      })
      .addCase(savePlace.rejected, (state, action) => { state.error = action.error.message || 'Could not save place'; });
  },
});

const selectPlacesState = (state) => state.places;
export const selectPlacesStatus = (state) => state.places.status;
export const selectPlacesError = (state) => state.places.error;
export const selectPlacesList = createSelector([selectPlacesState], (places) => places.items);
export const selectPlaceCount = createSelector([selectPlacesState], (places) => places.total);
export const selectPlaceFacets = createSelector([selectPlacesState], (places) => places.facets);

export default placesSlice.reducer;
