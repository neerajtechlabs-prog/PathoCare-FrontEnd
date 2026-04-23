# 📋 Modern Pathology Lab Booking Form

A comprehensive, production-ready React.js booking form for SAI PATHOLOGY LAB, built with modern technologies and best practices.

## 🏗️ Architecture Overview

### Component Structure

```
src/
├── components/
│   ├── booking/                    # Booking form components
│   │   ├── BookingFormContainer.tsx    # Main container component
│   │   ├── BookingDetailsForm.tsx      # Booking info (Centre, Reg No, Date, etc.)
│   │   ├── PatientDetailsForm.tsx      # Patient info (Name, Age, Mobile, Email, etc.)
│   │   ├── DoctorSampleForm.tsx        # Doctor & sample details
│   │   ├── TestTable.tsx               # Dynamic test selection table
│   │   ├── BillingSection.tsx          # Billing & payment calculations
│   │   ├── ActionButtons.tsx           # Save, Delete, Print, Refresh, Exit
│   │   └── index.ts                    # Barrel export
│   ├── form/
│   │   ├── FormInput.tsx               # Reusable input components
│   │   └── index.ts
│   └── ui/
│       ├── Button.tsx                  # Button component
│       └── Card.tsx                    # Card wrapper
├── features/
│   ├── bookings/
│   │   └── bookingSlice.ts             # Redux slice for booking state
│   └── ...other features
├── schemas/
│   ├── bookingSchema.ts                # Zod validation schema
│   └── ...other schemas
├── services/
│   ├── bookingService.ts               # API service for bookings
│   └── api.ts
├── pages/
│   ├── BookingPage.tsx                 # Page wrapper for routes
│   └── ...other pages
└── routes/
    └── index.tsx                       # Route definitions
```

## 🎯 Features Implemented

### 1. **Booking Details Form**
- Centre selection (dropdown)
- Registration number
- Barcode scanning
- Date & time picker
- Record number
- UID (Unique Identifier)

### 2. **Patient Information Form**
- Patient name with title dropdown (Mr., Ms., Mrs., Dr.)
- Age with unit selection (Year, Month, Day)
- Sex (Male, Female, Other)
- Mobile number (10-digit validation)
- Email (optional)
- Area/Locality

### 3. **Doctor & Sample Details**
- Doctor selection
- Doctor email
- Doctor type (GP, Specialist, Surgeon)
- Sample type (Blood, Urine, Stool, Saliva)
- Taken by (technician/staff name)
- Panel selection
- File number
- User rate (Standard, Employee, Student, Corporate)
- Result type (Normal, Abnormal, Pending)

### 4. **Dynamic Test Table**
- Add/remove test rows
- Auto-populated test code from database
- Test name selection
- Report days (auto-filled)
- Rate per test (auto-filled)
- **Auto-calculation**: Total amount updates as tests are added

### 5. **Options Section**
- Move All Columns (checkbox)
- Booking + Result (checkbox)
- Booking + Receipt (checkbox)
- Print Working Slip (checkbox)

### 6. **Billing & Payment Section**
- Extra By (dropdown)
- Discount By (dropdown)
- Payment Type (Cash, Card, UPI, Cheque, Online)
- Amount display
- Discount percentage input
- Automatic discount calculation
- Net total calculation
- Paid amount input
- Balance calculation with color-coded status

### 7. **Additional Information**
- Cancel/Remarks text area

### 8. **Action Buttons**
- Save Booking / Update Booking
- Delete (edit mode only)
- Print
- Search
- Refresh/Reset
- Exit

## 📦 Technology Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| React.js | UI Framework | 19.0.0 |
| TypeScript | Type Safety | 5.8.2 |
| Tailwind CSS | Styling | 4.1.14 |
| Formik | Form State Management | 2.4.9 |
| Zod | Schema Validation | 4.3.6 |
| Redux Toolkit | Global State | 2.11.2 |
| Axios | API Client | 1.15.2 |
| Lucide React | Icons | 0.546.0 |

## 🔄 State Management (Redux)

### Booking Slice (`bookingSlice.ts`)

```typescript
interface BookingFormData {
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
  patientTitle: string;
  age: number;
  ageUnit: string;
  sex: string;
  mobile: string;
  email: string;
  area: string;

  // Doctor & Sample
  doctor: string;
  doctorEmail?: string;
  doctorType: string;
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
```

### Available Actions
- `updateBookingField` - Update a single field
- `addTestRow` - Add a test to the table
- `updateTestRow` - Update a test in the table
- `deleteTestRow` - Remove a test from the table
- `updateBillingCalculations` - Update billing amounts
- `resetBookingForm` - Reset form to initial state
- `setBookingData` - Set multiple fields at once

## ✅ Validation (Zod Schema)

The `bookingFormSchema` validates:
- Required fields (Centre, Reg No, Patient Name, Doctor, Sample, Tests)
- Email format validation
- Mobile number format (10 digits)
- Age range (0-150)
- Test rows must have code, name, and rate
- Minimum 1 test must be selected

## 🔌 API Integration (Axios)

### BookingService Methods

```typescript
// Fetch dropdowns
getCentres() → Array
getDoctors() → Array
getTests() → Array
getSampleTypes() → Array
getPanels() → Array

// CRUD Operations
createBooking(data: BookingFormData) → Promise
updateBooking(id: string, data: Partial<BookingFormData>) → Promise
getBooking(id: string) → Promise
deleteBooking(id: string) → Promise

// Additional Features
searchBookings(query: string) → Promise
printBooking(id: string) → Promise (Blob)
generateBookingReport(data: BookingFormData) → Promise (Blob)
```

## 🎨 UI Components

### Form Components (`FormInput.tsx`)

1. **FormInput** - Text input with validation
2. **SelectInput** - Dropdown select with validation
3. **FormCheckbox** - Checkbox component
4. **FormTextArea** - Multi-line text input

### Reusable UI Components
- **Button** - Variants: primary, secondary, outline, danger, ghost
- **Card** - Container for sections

## 📱 Responsive Design

All components are fully responsive:
- Mobile-first approach
- Tailwind CSS grid system
- Flexible layouts
- Touch-friendly inputs

## 🚀 Usage

### Basic Implementation

```typescript
import { BookingFormContainer } from '@/components/booking';

export const MyPage = () => {
  return (
    <BookingFormContainer 
      mode="create" 
    />
  );
};
```

### With Booking ID (Edit Mode)

```typescript
<BookingFormContainer 
  bookingId="BOOKING123" 
  mode="edit" 
/>
```

### Route Integration

```typescript
// In routes/index.tsx
<Route path="bookings" element={<BookingPage />} />
<Route path="bookings/:id" element={<BookingPage />} />
```

## 🔄 Form Workflow

1. **User fills form** → Fields are captured by Formik
2. **Tests are added** → Table updates and total is calculated
3. **Discount is applied** → Net amount auto-calculates
4. **Form is submitted** → Zod validates all fields
5. **API request** → Data is sent to backend
6. **Success/Error** → User sees confirmation or error message
7. **Form resets** → Ready for new entry or shows details

## 💾 Billing Logic

```
Total = Sum of all test rates
Discount Amount = (Total × Discount %) / 100
Net Amount = Total - Discount Amount
Balance = Net Amount - Paid Amount

Balance Status:
- Green: Fully paid (Balance = 0)
- Orange: Pending (Balance > 0)
- Red: Overpaid (Balance < 0)
```

## 🔒 Form States

- **Create Mode**: New booking form
- **Edit Mode**: Update existing booking, shows delete button
- **View Mode**: Read-only display of booking details
- **Loading**: Async operations in progress
- **Success**: Green confirmation message
- **Error**: Red error message with details

## 📊 Mock Data

For development, mock data is provided:
- 3 Centre options
- 3 Doctor options
- 4 Sample types
- 3 Panels
- 6 Test options with rates
- 5 Payment methods

**To replace with real API:**
1. Update `MOCK_*` constants in `BookingFormContainer.tsx`
2. Or implement backend endpoints per `BookingService`

## 🧪 Testing

### Test the Form

```bash
npm run dev
```

Navigate to: `http://localhost:3000/bookings`

### Test TypeScript

```bash
npm run lint
```

### Build for Production

```bash
npm run build
```

## 🔐 Security Considerations

1. **CSRF Protection**: Ensure backend has CSRF tokens
2. **Input Validation**: Zod schema validates all inputs
3. **Auth Token**: Automatically attached to API requests via interceptor
4. **Email Validation**: Format validated by Zod
5. **Data Sanitization**: Consider DOMPurify for user-generated text

## 🐛 Debugging

### Redux DevTools
Install Redux DevTools browser extension to inspect state changes

### Formik Debugging
- Check formik.errors for validation errors
- Check formik.touched for field interaction
- Use formik.isSubmitting to track submission status

### API Debugging
- Check bookingService logs in console
- Network tab in DevTools shows API requests
- API responses are logged on errors

## 📈 Performance Optimizations

1. **Memoized Components**: ActionButtons, FormInput components
2. **Lazy Loading**: Can add React.lazy for route-based splitting
3. **Debouncing**: Consider debouncing calculation-heavy operations
4. **Optimization**: Tests table uses proper React keys
5. **CSS**: Tailwind purges unused styles in production

## 🚀 Future Enhancements

- [ ] Real-time sync with backend
- [ ] Multi-step form wizard
- [ ] File upload for medical records
- [ ] Signature capture
- [ ] SMS/Email notifications
- [ ] Print template customization
- [ ] Batch booking operations
- [ ] Advanced search & filters

## 📚 References

- [React Documentation](https://react.dev)
- [Formik](https://formik.org)
- [Zod](https://zod.dev)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Axios](https://axios-http.com)

## 📄 License

This component is part of PathoCarePro project.

---

**Last Updated**: April 23, 2026
**Version**: 1.0.0
**Status**: Production Ready
