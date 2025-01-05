import { configureStore } from '@reduxjs/toolkit';
import energyReducer from './slices/energySlice';

export const store = configureStore({
  reducer: {
    energy: energyReducer,
  },
}); 