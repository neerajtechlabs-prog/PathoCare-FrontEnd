import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { bookingFormSchema } from '../../schemas/bookingSchema';
import {
  updateBookingField,
  resetBookingForm,
  BookingFormData,
} from '../../features/bookings/bookingSlice';
import { BookingDetailsForm } from './BookingDetailsForm';
import { PatientDetailsForm } from './PatientDetailsForm';
import { DoctorSampleForm } from './DoctorSampleForm';
import { TestTable } from './TestTable';
import { BillingSection } from './BillingSection';
import { ActionButtons } from './ActionButtons';
import { bookingService } from '../../services/bookingService';
import { Card } from '../ui/Card';
import { FormTextArea } from '../form/FormInput';

interface BookingFormProps {
  bookingId?: string;
  mode?: 'create' | 'edit' | 'view';
}

// Mock data - replace with API calls
const MOCK_CENTRES = [
  { value: 'MAIN', label: 'SAI PATHOLOGY LAB - MAIN' },
  { value: 'BRANCH1', label: 'SAI PATHOLOGY LAB - BRANCH 1' },
  { value: 'BRANCH2', label: 'SAI PATHOLOGY LAB - BRANCH 2' },
];

const MOCK_DOCTORS = [
  { value: 'DR001', label: 'Dr. Sharma' },
  { value: 'DR002', label: 'Dr. Patel' },
  { value: 'DR003', label: 'Dr. Gupta' },
];

const MOCK_SAMPLE_TYPES = [
  { value: 'BLOOD', label: 'Blood' },
  { value: 'URINE', label: 'Urine' },
  { value: 'STOOL', label: 'Stool' },
  { value: 'SALIVA', label: 'Saliva' },
];

const MOCK_PANELS = [
  { value: 'BP001', label: 'Basic Health Panel' },
  { value: 'BP002', label: 'Comprehensive Panel' },
  { value: 'BP003', label: 'Thyroid Panel' },
];

const MOCK_TESTS = [
  { value: 'PATH', label: 'Pathology', rate: 500, reportDays: 1 },
  { value: 'US', label: 'Ultrasound', rate: 1000, reportDays: 0 },
  { value: 'XRAY', label: 'X-Ray', rate: 300, reportDays: 1 },
  { value: 'CBC', label: 'Complete Blood Count', rate: 250, reportDays: 1 },
  { value: 'LFT', label: 'Liver Function Test', rate: 400, reportDays: 1 },
  { value: 'RFT', label: 'Renal Function Test', rate: 400, reportDays: 1 },
];

const MOCK_PAYMENT_OPTIONS = [
  { value: 'Cash', label: 'Cash' },
  { value: 'Card', label: 'Debit/Credit Card' },
  { value: 'UPI', label: 'UPI' },
  { value: 'Cheque', label: 'Cheque' },
  { value: 'Online', label: 'Online Transfer' },
];

export const BookingFormContainer: React.FC<BookingFormProps> = ({
  bookingId,
  mode = 'create',
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const bookingData = useAppSelector((state) => state.bookings || {});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch existing booking if in edit mode
  useEffect(() => {
    if (mode === 'edit' && bookingId) {
      setIsLoading(true);
      bookingService
        .getBooking(bookingId)
        .then((data) => {
          dispatch(updateBookingField({ field: 'centre', value: data.centre }));
          // Load other fields...
        })
        .catch((err) => {
          setError('Failed to load booking details');
          console.error(err);
        })
        .finally(() => setIsLoading(false));
    }
  }, [bookingId, mode, dispatch]);

  const handleSubmit = async (values: BookingFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      if (mode === 'create') {
        await bookingService.createBooking(values);
        setSuccess(true);
        dispatch(resetBookingForm());
        setTimeout(() => {
          navigate('/bookings');
        }, 2000);
      } else if (mode === 'edit' && bookingId) {
        await bookingService.updateBooking(bookingId, values);
        setSuccess(true);
        setTimeout(() => {
          navigate(`/bookings/${bookingId}`);
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving the booking');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (bookingId && window.confirm('Are you sure you want to delete this booking?')) {
      try {
        setIsLoading(true);
        await bookingService.deleteBooking(bookingId);
        navigate('/bookings');
      } catch (err: any) {
        setError(err.message || 'Failed to delete booking');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePrint = async () => {
    try {
      setIsLoading(true);
      if (bookingId) {
        const blob = await bookingService.printBooking(bookingId);
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      } else {
        alert('Please save the booking first before printing');
      }
    } catch (err) {
      setError('Failed to print booking');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    dispatch(resetBookingForm());
    setError(null);
    setSuccess(false);
  };

  const handleExit = () => {
    if (
      window.confirm(
        'Are you sure you want to exit? Any unsaved changes will be lost.'
      )
    ) {
      navigate('/');
    }
  };

  const testOptions = MOCK_TESTS.map((test) => ({
    value: test.value,
    label: test.label,
    rate: test.rate,
  }));

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            SAI PATHOLOGY LAB
          </h1>
          <p className="text-gray-600 mt-2">
            {mode === 'create' && 'Create New Booking'}
            {mode === 'edit' && 'Edit Booking'}
            {mode === 'view' && 'View Booking'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 p-4 bg-red-50 border-red-200">
            <p className="text-red-700">{error}</p>
          </Card>
        )}

        {/* Success Message */}
        {success && (
          <Card className="mb-6 p-4 bg-green-50 border-green-200">
            <p className="text-green-700">
              Booking {mode === 'create' ? 'created' : 'updated'} successfully!
            </p>
          </Card>
        )}

        {/* Main Form */}
        <Formik
          initialValues={bookingData as BookingFormData}
          validationSchema={bookingFormSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {(formik) => (
            <Form className="space-y-6">
              {/* Booking Details */}
              <BookingDetailsForm
                formik={formik}
                centres={MOCK_CENTRES}
              />

              {/* Patient Details */}
              <PatientDetailsForm formik={formik} />

              {/* Doctor & Sample Details */}
              <DoctorSampleForm
                formik={formik}
                doctors={MOCK_DOCTORS}
                sampleTypes={MOCK_SAMPLE_TYPES}
                panels={MOCK_PANELS}
              />

              {/* Test Selection */}
              <TestTable formik={formik} tests={testOptions} />

              {/* Billing Section */}
              <BillingSection
                formik={formik}
                paymentOptions={MOCK_PAYMENT_OPTIONS}
              />

              {/* Cancel Remark */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Additional Information
                </h3>
                <FormTextArea
                  label="Cancel Remark / Notes"
                  name="cancelRemark"
                  value={formik.values.cancelRemark}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Add any remarks or notes"
                  rows={4}
                  touched={formik.touched.cancelRemark}
                  error={formik.errors.cancelRemark}
                />
              </Card>

              {/* Action Buttons */}
              <Card className="p-6">
                <ActionButtons
                  onSave={() => formik.handleSubmit()}
                  onDelete={mode === 'edit' ? handleDelete : undefined}
                  onPrint={mode === 'view' || mode === 'edit' ? handlePrint : undefined}
                  onRefresh={handleRefresh}
                  onExit={handleExit}
                  isLoading={isLoading}
                  isEditing={mode === 'edit'}
                />
              </Card>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default BookingFormContainer;
