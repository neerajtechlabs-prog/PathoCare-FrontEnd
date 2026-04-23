import React from 'react';
import { FormikProps } from 'formik';
import { BookingFormData } from '../../features/bookings/bookingSlice';
import { FormInput, SelectInput } from '../form/FormInput';
import { Card } from '../ui/Card';

interface PatientDetailsFormProps {
  formik: FormikProps<BookingFormData>;
}

export const PatientDetailsForm: React.FC<PatientDetailsFormProps> = ({ formik }) => {
  const { values, errors, touched, handleChange, handleBlur } = formik;

  return (
    <Card className="p-6 background-red-50">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Patient Information</h3>

      <div className="space-y-4">
        {/* Row 1: Title + Name, Mobile, Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2 grid grid-cols-3 gap-2">
            <SelectInput
              label="Title"
              name="patientTitle"
              value={values.patientTitle}
              onChange={handleChange}
              onBlur={handleBlur}
              options={[
                { value: 'Mr.', label: 'Mr.' },
                { value: 'Ms.', label: 'Ms.' },
                { value: 'Mrs.', label: 'Mrs.' },
                { value: 'Dr.', label: 'Dr.' },
              ]}
              required
              touched={touched.patientTitle}
              error={errors.patientTitle}
            />

            <FormInput
              label="Patient Name"
              type="text"
              name="patientName"
              value={values.patientName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter name"
              required
              touched={touched.patientName}
              error={errors.patientName}
              className="col-span-2"
            />
          </div>

          <FormInput
            label="Mobile"
            type="tel"
            name="mobile"
            value={values.mobile}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="10 digit"
            required
            touched={touched.mobile}
            error={errors.mobile}
          />

          <FormInput
            label="Email"
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter email"
            touched={touched.email}
            error={errors.email}
          />
        </div>

        {/* Row 2: Age + Unit, Sex, Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2 grid grid-cols-2 gap-2">
            <FormInput
              label="Age"
              type="number"
              name="age"
              value={values.age}
              onChange={handleChange}
              onBlur={handleBlur}
              min="0"
              max="150"
              placeholder="Enter age"
              required
              touched={touched.age}
              error={errors.age}
            />

            <SelectInput
              label="Unit"
              name="ageUnit"
              value={values.ageUnit}
              onChange={handleChange}
              onBlur={handleBlur}
              options={[
                { value: 'Day', label: 'Day' },
                { value: 'Month', label: 'Month' },
                { value: 'Year', label: 'Year' },
              ]}
              required
              touched={touched.ageUnit}
              error={errors.ageUnit}
            />
          </div>

          <SelectInput
            label="Sex"
            name="sex"
            value={values.sex}
            onChange={handleChange}
            onBlur={handleBlur}
            options={[
              { value: 'Male', label: 'Male' },
              { value: 'Female', label: 'Female' },
              { value: 'Other', label: 'Other' },
            ]}
            required
            touched={touched.sex}
            error={errors.sex}
          />

          <FormInput
            label="Area"
            type="text"
            name="area"
            value={values.area}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter area"
            touched={touched.area}
            error={errors.area}
          />
        </div>
      </div>
    </Card>
  );
};
