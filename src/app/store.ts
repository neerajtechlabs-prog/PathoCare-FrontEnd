import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from '../features/auth/authSlice';
import patientReducer from '../features/patients/patientSlice';
import testReducer from '../features/tests/testSlice';
import bookingReducer from '../features/bookings/bookingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    patients: patientReducer,
    tests: testReducer,
    bookings: bookingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export pre-typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
