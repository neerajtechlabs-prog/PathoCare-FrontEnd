import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Please confirm your password'),
  tenantName: z.string().min(2, 'Lab or clinic name is required'),
  registrationNumber: z.string().optional(),
  gstNumber: z.string().optional(),
  mobileNumber: z.string().regex(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
  designation: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  pinCode: z.string().optional(),
  completeAddress: z.string().optional(),
  plan: z.string().optional(),
  terms: z.boolean().refine((value) => value, 'You must accept the terms and conditions'),
  privacy: z.boolean().refine((value) => value, 'You must accept the privacy policy'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const patientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.coerce.number().min(0).max(120),
  gender: z.enum(['Male', 'Female', 'Other']),
  mobile: z.string().regex(/^[0-9]{10}$/, 'Invalid mobile number (10 digits required)'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  doctor: z.string().min(2, 'Doctor name is required'),
  area: z.string().optional(),
});

export const testRowSchema = z.object({
  id: z.string(),
  backendId: z.string().optional(),
  code: z.string().min(1, 'Test code is required'),
  test: z.string().min(1, 'Test name is required'),
  reportDays: z.number().min(0, 'Report days must be at least 0'),
  rate: z.number().min(0, 'Rate must be non-negative'),
});

export const bookingFormSchema = z.object({
  centre: z.string().min(1, 'Centre is required'),
  regNo: z.string().min(1, 'Registration number is required'),
  barcode: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  time: z.string().optional(),
  recordNo: z.string().optional(),
  uid: z.string().optional(),
  patientName: z.string().min(2, 'Patient name must be at least 2 characters'),
  patientTitle: z.string().min(1, 'Patient title is required'),
  age: z.coerce.number().min(0, 'Age must be non-negative').max(150, 'Invalid age'),
  ageUnit: z.enum(['Year', 'Month', 'Day']),
  sex: z.enum(['Male', 'Female', 'Other']),
  mobile: z.string().regex(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
  email: z.string().trim().email('Invalid email address').optional().or(z.literal('')),
  area: z.string().optional(),
  doctor: z.string().min(1, 'Doctor is required'),
  doctorEmail: z.string().trim().email('Invalid email').optional().or(z.literal('')),
  doctorType: z.string().optional(),
  bookingType: z.string().optional(),
  sample: z.string().min(1, 'Sample type is required'),
  takenBy: z.string().optional(),
  panel: z.string().optional(),
  fileNo: z.string().optional(),
  userRate: z.string().optional(),
  resultType: z.string().optional(),
  tests: z.array(testRowSchema).min(1, 'At least one test must be selected'),
  moveAllColumns: z.boolean().default(false),
  bookingPlusResult: z.boolean().default(false),
  bookingPlusReceipt: z.boolean().default(false),
  printWorkingSlip: z.boolean().default(false),
  extraBy: z.string().optional(),
  discountBy: z.string().optional(),
  payType: z.string().min(1, 'Payment type is required'),
  amount: z.coerce.number().min(0, 'Amount must be non-negative'),
  discount: z.coerce.number().min(0, 'Discount must be non-negative'),
  discountPercent: z.coerce.number().min(0).max(100),
  total: z.coerce.number().min(0),
  net: z.coerce.number().min(0),
  paid: z.coerce.number().min(0),
  cancelRemark: z.string().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type PatientFormValues = z.infer<typeof patientSchema>;
export type BookingFormValues = z.infer<typeof bookingFormSchema>;
