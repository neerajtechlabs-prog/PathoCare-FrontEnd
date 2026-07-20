import React, { useCallback } from 'react';
import { FieldArray, FormikProps } from 'formik';
import { Trash2, Plus } from 'lucide-react';
import { FormInput, SelectInput } from '../form/FormInput';
import { BookingFormData, TestRow } from '../../features/bookings/bookingSlice';
import { Button } from '../ui/Button';

interface TestTableProps {
  formik: FormikProps<BookingFormData>;
  tests: Array<{ value: string; label: string; rate: number; backendId?: string; code?: string }>;
}

export const TestTable: React.FC<TestTableProps> = ({ formik, tests }) => {
  const { values, errors, touched, setFieldValue } = formik;

  const calculateTotal = useCallback((testRows: TestRow[]) => {
    return testRows.reduce((sum, test) => sum + (test.rate || 0), 0);
  }, []);

  const handleAddRow = useCallback((push: (obj: TestRow) => void) => {
    const newRow: TestRow = {
      id: `test-${Date.now()}`,
      code: '',
      test: '',
      reportDays: 0,
      rate: 0,
    };
    push(newRow);

    // Recalculate billing
    const newTotal = calculateTotal([...values.tests, newRow]);
    setFieldValue('total', newTotal);
  }, [values.tests, calculateTotal, setFieldValue]);

  const handleTestChange = useCallback(
    (index: number, testValue: string) => {
      const selectedTest = tests.find((t) => t.value === testValue);
      if (selectedTest) {
        const updatedTests = [...values.tests];
        updatedTests[index] = {
          ...updatedTests[index],
          backendId: selectedTest.backendId,
          test: selectedTest.label,
          code: selectedTest.code || selectedTest.value,
          rate: selectedTest.rate,
        };
        setFieldValue('tests', updatedTests);

        // Recalculate total
        const newTotal = calculateTotal(updatedTests);
        setFieldValue('total', newTotal);
      }
    },
    [tests, values.tests, calculateTotal, setFieldValue]
  );

  const handleDeleteRow = useCallback(
    (index: number) => {
      const updatedTests = values.tests.filter((_, i) => i !== index);
      setFieldValue('tests', updatedTests);

      // Recalculate total
      const newTotal = calculateTotal(updatedTests);
      setFieldValue('total', newTotal);
    },
    [values.tests, calculateTotal, setFieldValue]
  );

  const tableError =
    errors.tests && typeof errors.tests === 'string'
      ? errors.tests
      : undefined;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Test Selection</h3>
          {tableError && <p className="text-sm text-red-600 mt-1">{tableError}</p>}
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-12">
                SNo
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Code
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 flex-1">
                Test Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-24">
                Report Days
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 w-24">
                Rate (₹)
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 w-12">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <FieldArray name="tests">
              {(arrayHelpers) => (
                <>
                  {values.tests.map((test, index) => {
                    const testError =
                      errors.tests &&
                      Array.isArray(errors.tests) &&
                      errors.tests[index];

                    return (
                      <tr
                        key={test.id}
                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3">
                          <FormInput
                            value={test.code}
                            readOnly
                            disabled
                            className="text-sm bg-gray-100"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <SelectInput
                            value={test.test}
                            onChange={(e) =>
                              handleTestChange(index, e.target.value)
                            }
                            options={tests}
                            placeholder="Select test"
                            className="text-sm"
                            error={
                              testError && typeof testError === 'object'
                                ? testError.test
                                : ''
                            }
                            touched={
                              touched.tests &&
                              Array.isArray(touched.tests) &&
                              touched.tests[index]?.test
                            }
                          />
                        </td>
                        <td className="px-4 py-3">
                          <FormInput
                            type="number"
                            value={test.reportDays}
                            readOnly
                            disabled
                            className="text-sm bg-gray-100"
                          />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-sm font-medium text-gray-900">
                            ₹ {test.rate.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteRow(index)}
                            className="inline-flex items-center justify-center p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete test"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {values.tests.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center">
                        <p className="text-gray-500 text-sm">
                          No tests added. Click "Add Test" to add one.
                        </p>
                      </td>
                    </tr>
                  )}
                </>
              )}
            </FieldArray>
          </tbody>
        </table>
      </div>

      <div className="flex gap-2">
        <FieldArray name="tests">
          {(arrayHelpers) => (
            <Button
              type="button"
              onClick={() => handleAddRow(arrayHelpers.push)}
              variant="outline"
              className="gap-2"
            >
              <Plus size={18} /> Add Test
            </Button>
          )}
        </FieldArray>
      </div>

      {values.tests.length > 0 && (
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <div className="space-y-2">
            <div className="flex gap-4 items-center justify-end">
              <span className="text-sm font-medium text-gray-700">Total:</span>
              <span className="text-lg font-semibold text-gray-900 min-w-20 text-right">
                ₹ {values.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
