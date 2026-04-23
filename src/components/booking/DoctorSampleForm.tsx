import React from 'react';
import { FormikProps } from 'formik';
import { BookingFormData } from '../../features/bookings/bookingSlice';
import { FormInput, SelectInput, FormCheckbox } from '../form/FormInput';
import { Card } from '../ui/Card';

interface DoctorSampleFormProps {
  formik: FormikProps<BookingFormData>;
  doctors: Array<{ value: string; label: string }>;
  sampleTypes: Array<{ value: string; label: string }>;
  panels: Array<{ value: string; label: string }>;
}

export const DoctorSampleForm: React.FC<DoctorSampleFormProps> = ({
  formik,
  doctors,
  sampleTypes,
  panels,
}) => {
  const { values, errors, touched, handleChange, handleBlur } = formik;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Doctor & Sample Details
      </h3>

      <div className="space-y-4">
        {/* Row 1: Doctor, Dr. Type, Booking Type */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SelectInput
            label="Doctor"
            name="doctor"
            value={values.doctor}
            onChange={handleChange}
            onBlur={handleBlur}
            options={doctors}
            required
            touched={touched.doctor}
            error={errors.doctor}
          />

          <SelectInput
            label="Dr. Type"
            name="doctorType"
            value={values.doctorType}
            onChange={handleChange}
            onBlur={handleBlur}
            options={[
              { value: 'GP', label: 'General Practitioner' },
              { value: 'Specialist', label: 'Specialist' },
              { value: 'Surgeon', label: 'Surgeon' },
            ]}
            touched={touched.doctorType}
            error={errors.doctorType}
          />

          <SelectInput
            label="Booking Type"
            name="bookingType"
            value={values.bookingType}
            onChange={handleChange}
            onBlur={handleBlur}
            options={[
              { value: 'H', label: 'Home' },
              { value: 'L', label: 'Lab' },
              { value: 'C', label: 'Corporate' },
            ]}
            touched={touched.bookingType}
            error={errors.bookingType}
          />
        </div>

        {/* Row 2: Sample, Taken By, FileNo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SelectInput
            label="Sample Type"
            name="sample"
            value={values.sample}
            onChange={handleChange}
            onBlur={handleBlur}
            options={sampleTypes}
            required
            touched={touched.sample}
            error={errors.sample}
          />

          <FormInput
            label="Taken By"
            type="text"
            name="takenBy"
            value={values.takenBy}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Technician/Staff name"
            touched={touched.takenBy}
            error={errors.takenBy}
          />

          <FormInput
            label="File No"
            type="text"
            name="fileNo"
            value={values.fileNo}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter file number"
            touched={touched.fileNo}
            error={errors.fileNo}
          />
        </div>

        {/* Row 3: Panel, User Rate, Result Type */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SelectInput
            label="Panel"
            name="panel"
            value={values.panel}
            onChange={handleChange}
            onBlur={handleBlur}
            options={panels}
            touched={touched.panel}
            error={errors.panel}
          />

          <SelectInput
            label="User Rate"
            name="userRate"
            value={values.userRate}
            onChange={handleChange}
            onBlur={handleBlur}
            options={[
              { value: 'standard', label: 'Standard' },
              { value: 'employee', label: 'Employee' },
              { value: 'student', label: 'Student' },
              { value: 'corporate', label: 'Corporate' },
            ]}
            touched={touched.userRate}
            error={errors.userRate}
          />

          <SelectInput
            label="Result Type"
            name="resultType"
            value={values.resultType}
            onChange={handleChange}
            onBlur={handleBlur}
            options={[
              { value: 'Normal', label: 'Normal' },
              { value: 'Abnormal', label: 'Abnormal' },
              { value: 'Pending', label: 'Pending' },
            ]}
            touched={touched.resultType}
            error={errors.resultType}
          />
        </div>

        {/* Doctor Email (Optional) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            label="Doctor Email (Optional)"
            type="email"
            name="doctorEmail"
            value={values.doctorEmail || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="doctor@example.com"
            touched={touched.doctorEmail}
            error={errors.doctorEmail}
          />
        </div>
      </div>

      {/* Options */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Options</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormCheckbox
            name="moveAllColumns"
            label="Move All Columns"
            checked={values.moveAllColumns}
            onChange={handleChange}
          />
          <FormCheckbox
            name="bookingPlusResult"
            label="Booking + Result"
            checked={values.bookingPlusResult}
            onChange={handleChange}
          />
          <FormCheckbox
            name="bookingPlusReceipt"
            label="Booking + Receipt"
            checked={values.bookingPlusReceipt}
            onChange={handleChange}
          />
          <FormCheckbox
            name="printWorkingSlip"
            label="Print Working Slip"
            checked={values.printWorkingSlip}
            onChange={handleChange}
          />
        </div>
      </div>
    </Card>
  );
};
