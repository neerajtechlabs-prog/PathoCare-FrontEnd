import { z } from 'zod';

export const patientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.coerce.number().min(0).max(120),
  gender: z.enum(['Male', 'Female', 'Other']),
  mobile: z.string().regex(/^[0-9]{10}$/, 'Invalid mobile number (10 digits required)'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  doctor: z.string().min(2, 'Doctor name is required'),
  area: z.string().optional(),
});

export type PatientFormValues = z.infer<typeof patientSchema>;

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
