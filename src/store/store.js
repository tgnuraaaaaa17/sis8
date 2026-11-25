import { configureStore } from '@reduxjs/toolkit';
import placesReducer from '../features/places/placesSlice.js';
import placeDetailsReducer from '../features/placeDetails/placeDetailsSlice.js';
import dashboardReducer from '../features/dashboard/dashboardSlice.js';

export const store = configureStore({
  reducer: {
    places: placesReducer,
    placeDetails: placeDetailsReducer,
    dashboard: dashboardReducer,
  },
});
