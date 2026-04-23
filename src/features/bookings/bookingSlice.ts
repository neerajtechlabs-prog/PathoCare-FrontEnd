import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TestRow {
  id: string;
  code: string;
  test: string;
  reportDays: number;
  rate: number;
}

export interface BookingFormData {
  // Booking Info
  centre: string;
  regNo: string;
  barcode: string;
  date: string;
  time: string;
  recordNo: string;
  uid: string;

  // Patient Info
  patientName: string;
  patientTitle: string; // Mr., Ms., etc.
  age: number;
  ageUnit: string; // Year, Month
  sex: string;
  mobile: string;
  email: string;
  area: string;

  // Doctor & Sample
  doctor: string;
  doctorEmail?: string;
  doctorType: string;
  bookingType: string;
  sample: string;
  takenBy: string;
  panel: string;
  fileNo: string;
  userRate: string;
  resultType: string;

  // Test Table
  tests: TestRow[];

  // Options
  moveAllColumns: boolean;
  bookingPlusResult: boolean;
  bookingPlusReceipt: boolean;
  printWorkingSlip: boolean;

  // Billing
  extraBy: string;
  discountBy: string;
  payType: string;
  amount: number;
  discount: number;
  discountPercent: number;
  total: number;
  net: number;
  paid: number;

  // Cancel Remark
  cancelRemark: string;
}

const initialState: BookingFormData = {
  centre: 'MAIN',
  regNo: '',
  barcode: '',
  date: new Date().toISOString().split('T')[0],
  time: new Date().toTimeString().slice(0, 5),
  recordNo: '',
  uid: '',

  patientName: '',
  patientTitle: 'Mr.',
  age: 0,
  ageUnit: 'Year',
  sex: 'Male',
  mobile: '',
  email: '',
  area: '',

  doctor: '',
  doctorEmail: '',
  doctorType: '',
  bookingType: '',
  sample: '',
  takenBy: '',
  panel: '',
  fileNo: '',
  userRate: '',
  resultType: '',

  tests: [],

  moveAllColumns: false,
  bookingPlusResult: false,
  bookingPlusReceipt: false,
  printWorkingSlip: false,

  extraBy: '',
  discountBy: '',
  payType: 'Cash',
  amount: 0,
  discount: 0,
  discountPercent: 0,
  total: 0,
  net: 0,
  paid: 0,

  cancelRemark: '',
};

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    updateBookingField: (
      state,
      action: PayloadAction<{ field: keyof BookingFormData; value: any }>
    ) => {
      const { field, value } = action.payload;
      (state as any)[field] = value;
    },

    addTestRow: (state, action: PayloadAction<TestRow>) => {
      state.tests.push(action.payload);
    },

    updateTestRow: (
      state,
      action: PayloadAction<{ id: string; data: Partial<TestRow> }>
    ) => {
      const index = state.tests.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tests[index] = { ...state.tests[index], ...action.payload.data };
      }
    },

    deleteTestRow: (state, action: PayloadAction<string>) => {
      state.tests = state.tests.filter((t) => t.id !== action.payload);
    },

    updateBillingCalculations: (
      state,
      action: PayloadAction<{
        total: number;
        discount: number;
        net: number;
      }>
    ) => {
      state.total = action.payload.total;
      state.discount = action.payload.discount;
      state.net = action.payload.net;
    },

    resetBookingForm: () => initialState,

    setBookingData: (state, action: PayloadAction<Partial<BookingFormData>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  updateBookingField,
  addTestRow,
  updateTestRow,
  deleteTestRow,
  updateBillingCalculations,
  resetBookingForm,
  setBookingData,
} = bookingSlice.actions;

export default bookingSlice.reducer;
