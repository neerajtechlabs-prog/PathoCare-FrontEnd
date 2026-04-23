import React from 'react';
import { FormikProps } from 'formik';
import { BookingFormData } from '../../features/bookings/bookingSlice';
import { FormInput, SelectInput } from '../form/FormInput';
import { Card } from '../ui/Card';

interface BookingDetailsFormProps {
  formik: FormikProps<BookingFormData>;
  centres: Array<{ value: string; label: string }>;
}

export const BookingDetailsForm: React.FC<BookingDetailsFormProps> = ({
  formik,
  centres,
}) => {
  const { values, errors, touched, handleChange, handleBlur } = formik;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Booking Information</h3>

      <div className="space-y-4">
        {/* Row 1: Centre, Barcode, Date */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SelectInput
            label="Centre"
            name="centre"
            value={values.centre}
            onChange={handleChange}
            onBlur={handleBlur}
            options={centres}
            required
            touched={touched.centre}
            error={errors.centre}
          />

          <FormInput
            label="Barcode"
            type="text"
            name="barcode"
            value={values.barcode}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Scan barcode"
            touched={touched.barcode}
            error={errors.barcode}
          />

          <FormInput
            label="Date"
            type="date"
            name="date"
            value={values.date}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            touched={touched.date}
            error={errors.date}
          />
        </div>

        {/* Row 2: Reg No, Record No, Time */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            label="Registration No"
            type="text"
            name="regNo"
            value={values.regNo}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter reg number"
            required
            touched={touched.regNo}
            error={errors.regNo}
          />

          <FormInput
            label="Record No"
            type="text"
            name="recordNo"
            value={values.recordNo}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter record number"
            touched={touched.recordNo}
            error={errors.recordNo}
          />

          <FormInput
            label="Time"
            type="time"
            name="time"
            value={values.time}
            onChange={handleChange}
            onBlur={handleBlur}
            touched={touched.time}
            error={errors.time}
          />
        </div>

        {/* Row 3: UID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            label="UID"
            type="text"
            name="uid"
            value={values.uid}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter UID"
            touched={touched.uid}
            error={errors.uid}
          />
        </div>
      </div>
    </Card>
  );
};
