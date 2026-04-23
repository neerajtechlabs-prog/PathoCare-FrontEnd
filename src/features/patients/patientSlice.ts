import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Patient {
  id: string;
  regNo: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  mobile: string;
  email?: string;
  doctor?: string;
  createdAt: string;
}

interface PatientState {
  patients: Patient[];
  loading: boolean;
  error: string | null;
}

const initialState: PatientState = {
  patients: [
    {
      id: '1',
      regNo: 'PAT-001',
      name: 'John Doe',
      age: 45,
      gender: 'Male',
      mobile: '9876543210',
      email: 'john@example.com',
      doctor: 'Dr. Smith',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      regNo: 'PAT-002',
      name: 'Jane Roe',
      age: 32,
      gender: 'Female',
      mobile: '8877665544',
      email: 'jane@example.com',
      doctor: 'Dr. Adams',
      createdAt: new Date().toISOString(),
    }
  ],
  loading: false,
  error: null,
};

// Mock async thunks
export const fetchPatients = createAsyncThunk('patients/fetchAll', async () => {
  // In reality: await api.get('/patients')
  return initialState.patients;
});

export const addPatient = createAsyncThunk('patients/add', async (patient: Omit<Patient, 'id' | 'regNo' | 'createdAt'>) => {
  const newPatient: Patient = {
    ...patient,
    id: Math.random().toString(36).substr(2, 9),
    regNo: `PAT-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
  };
  return newPatient;
});

const patientSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.patients = action.payload;
      })
      .addCase(addPatient.fulfilled, (state, action) => {
        state.patients.unshift(action.payload);
      });
  },
});

export default patientSlice.reducer;
