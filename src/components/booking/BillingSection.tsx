import React, { useEffect } from 'react';
import { FormikProps } from 'formik';
import { BookingFormData } from '../../features/bookings/bookingSlice';
import { FormInput, SelectInput } from '../form/FormInput';
import { Card } from '../ui/Card';

interface BillingSectionProps {
  formik: FormikProps<BookingFormData>;
  paymentOptions: Array<{ value: string; label: string }>;
}

export const BillingSection: React.FC<BillingSectionProps> = ({
  formik,
  paymentOptions,
}) => {
  const { values, errors, touched, setFieldValue } = formik;

  // Auto-calculate net amount and other billing values
  useEffect(() => {
    const total = values.total || 0;
    const discountPercent = values.discountPercent || 0;
    const discountAmount = (total * discountPercent) / 100;
    const net = total - discountAmount;

    setFieldValue('discount', discountAmount);
    setFieldValue('net', net);
    setFieldValue('amount', total);
  }, [values.total, values.discountPercent, setFieldValue]);

  const handleDiscountPercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const percent = parseFloat(e.target.value) || 0;
    setFieldValue('discountPercent', percent);
  };

  const handlePaidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const paid = parseFloat(e.target.value) || 0;
    setFieldValue('paid', paid);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Billing Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <SelectInput
            label="Extra By"
            name="extraBy"
            value={values.extraBy}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            options={[
              { value: 'none', label: 'None' },
              { value: 'doctor', label: 'Doctor' },
              { value: 'staff', label: 'Staff' },
            ]}
            touched={touched.extraBy}
            error={errors.extraBy}
          />

          <SelectInput
            label="Discount By"
            name="discountBy"
            value={values.discountBy}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            options={[
              { value: 'none', label: 'None' },
              { value: 'percentage', label: 'Percentage' },
              { value: 'fixed', label: 'Fixed Amount' },
            ]}
            touched={touched.discountBy}
            error={errors.discountBy}
          />

          <SelectInput
            label="Payment Type"
            name="payType"
            value={values.payType}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            options={paymentOptions}
            required
            touched={touched.payType}
            error={errors.payType}
          />
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (₹)
            </label>
            <div className="text-2xl font-bold text-gray-900">
              ₹ {values.amount.toFixed(2)}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={values.discountPercent}
              onChange={handleDiscountPercentChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Amount (₹)
            </label>
            <div className="text-lg font-semibold text-blue-600">
              - ₹ {values.discount.toFixed(2)}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Net Total (₹)
            </label>
            <div className="text-2xl font-bold text-gray-900 text-right">
              ₹ {values.net.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Paid Amount */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Paid Amount (₹)"
          type="number"
          name="paid"
          value={values.paid}
          onChange={handlePaidChange}
          onBlur={formik.handleBlur}
          min="0"
          step="0.01"
          placeholder="Enter paid amount"
          touched={touched.paid}
          error={errors.paid}
        />

        {/* Balance */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Balance (₹)
          </label>
          <div
            className={`px-3 py-2 text-lg font-semibold rounded-lg border-2 ${
              values.net - values.paid === 0
                ? 'border-green-500 bg-green-50 text-green-900'
                : values.net - values.paid > 0
                ? 'border-orange-500 bg-orange-50 text-orange-900'
                : 'border-red-500 bg-red-50 text-red-900'
            }`}
          >
            ₹ {(values.net - values.paid).toFixed(2)}
          </div>
        </div>
      </div>
    </Card>
  );
};
