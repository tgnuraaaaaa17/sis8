import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { deletePlace, getPlace, isValidPlaceId, setVisited } from '../../services/service.js';

export const fetchPlace = createAsyncThunk('placeDetails/fetchOne', async (id, { rejectWithValue }) => {
  try { return await getPlace(id); }
  catch (error) { return rejectWithValue({ message: error.message, notFound: !isValidPlaceId(id) || error.name === 'PlaceNotFoundError' }); }
});
export const toggleVisited = createAsyncThunk('placeDetails/toggleVisited', ({ id, completed }) => setVisited(id, completed));
export const removePlace = createAsyncThunk('placeDetails/remove', (id) => deletePlace(id));

const initialState = { status: 'idle', place: null, error: null, loadedAt: '', currentRequestId: null };
const slice = createSlice({
  name: 'placeDetails', initialState, reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchPlace.pending, (state, action) => { state.status = 'loading'; state.error = null; state.currentRequestId = action.meta.requestId; })
      .addCase(fetchPlace.fulfilled, (state, action) => { if (state.currentRequestId !== action.meta.requestId) return; state.status = 'success'; state.place = action.payload; state.loadedAt = new Date().toISOString(); state.currentRequestId = null; })
      .addCase(fetchPlace.rejected, (state, action) => { if (state.currentRequestId !== action.meta.requestId) return; state.currentRequestId = null; state.place = null; state.status = action.payload?.notFound ? 'notfound' : 'error'; state.error = action.payload?.message || action.error.message; })
      .addCase(toggleVisited.fulfilled, (state, action) => { if (state.place?.id === action.payload.id) state.place = action.payload; })
      .addCase(removePlace.fulfilled, (state) => { state.place = null; state.status = 'idle'; });
  },
});
export default slice.reducer;
