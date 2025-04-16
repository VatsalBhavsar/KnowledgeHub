// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import walletReducer from './slices/walletSlice';

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

// Infer types for usage
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
