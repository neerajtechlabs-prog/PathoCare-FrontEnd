import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import patientReducer from '../features/patients/patientSlice';
import testReducer from '../features/tests/testSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    patients: patientReducer,
    tests: testReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
