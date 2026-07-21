export const APP_NAME = 'PathoCare Pro';

export const ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/',
  PATIENTS: '/patients',
  PATIENT_ADD: '/patients/add',
  PATIENT_EDIT: (id: string) => `/patients/edit/${id}`,
  TESTS: '/tests',
  REPORTS: '/reports',
  BILLING: '/billing',
};

export const API_BASE_URL = '/api'; // In a real app this would come from env
