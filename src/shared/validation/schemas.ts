import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
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
  code: z.string().min(1, 'Test code is required'),
  name: z.string().min(1, 'Test name is required'),
  department: z.string().min(1, 'Department is required'),
  reportDays: z.number().min(1, 'Report days must be at least 1'),
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
  age: z.number().min(0, 'Age must be non-negative').max(150, 'Invalid age'),
  ageUnit: z.enum(['Year', 'Month', 'Day']),
  sex: z.enum(['Male', 'Female', 'Other']),
  mobile: z.string().regex(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
  email: z.string().email('Invalid email address').optional().or(z.string().length(0)),
  area: z.string().optional(),
  doctor: z.string().min(1, 'Doctor is required'),
  doctorEmail: z.string().email('Invalid email').optional().or(z.string().length(0)),
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
  amount: z.number().min(0, 'Amount must be non-negative'),
  discount: z.number().min(0, 'Discount must be non-negative'),
  discountPercent: z.number().min(0).max(100),
  total: z.number().min(0),
  net: z.number().min(0),
  paid: z.number().min(0),
  cancelRemark: z.string().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type PatientFormValues = z.infer<typeof patientSchema>;
export type BookingFormValues = z.infer<typeof bookingFormSchema>;
