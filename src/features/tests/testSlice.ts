import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LabTest {
  id: string;
  code: string;
  name: string;
  department: string;
  rate: number;
  reportDays: number;
}

interface TestState {
  availableTests: LabTest[];
  bookings: any[];
  loading: boolean;
}

const initialState: TestState = {
  availableTests: [
    { id: '1', code: 'CBC', name: 'Complete Blood Count', department: 'PATHOLOGY', rate: 300, reportDays: 1 },
    { id: '2', code: 'GLU', name: 'Glucose (Random)', department: 'BIOCHEMISTRY', rate: 100, reportDays: 0 },
    { id: '3', code: 'LIP', name: 'Lipid Profile', department: 'BIOCHEMISTRY', rate: 850, reportDays: 1 },
    { id: '4', code: 'THY', name: 'Thyroid Profile (T3, T4, TSH)', department: 'IMMUNOLOGY', rate: 1200, reportDays: 2 },
    { id: '5', code: 'URA', name: 'Urine Analysis', department: 'PATHOLOGY', rate: 150, reportDays: 0 },
    { id: '6', code: 'KFT', name: 'Kidney Function Test', department: 'BIOCHEMISTRY', rate: 750, reportDays: 1 },
  ],
  bookings: [],
  loading: false,
};

const testSlice = createSlice({
  name: 'tests',
  initialState,
  reducers: {
    addBooking: (state, action: PayloadAction<any>) => {
      state.bookings.push(action.payload);
    },
  },
});

export const { addBooking } = testSlice.actions;
export default testSlice.reducer;
