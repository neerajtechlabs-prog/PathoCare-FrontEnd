import test from 'node:test';
import assert from 'node:assert/strict';
import { buildBookingCreatePayload } from './bookingService';
import type { BookingFormData } from '../features/bookings/bookingSlice';

test('buildBookingCreatePayload maps booking form values to the backend contract', () => {
  const bookingData: BookingFormData = {
    centre: 'MAIN',
    regNo: 'REG-001',
    barcode: 'BC-001',
    date: '2026-07-18',
    time: '10:30',
    recordNo: 'REC-1',
    uid: 'UID-1',
    patientName: 'Jane Doe',
    patientTitle: 'Ms.',
    age: 30,
    ageUnit: 'Year',
    sex: 'Female',
    mobile: '9876543210',
    email: 'jane@example.com',
    area: 'Downtown',
    doctor: 'Dr. Sharma',
    doctorEmail: 'dr@example.com',
    doctorType: 'Consultant',
    bookingType: 'WalkIn',
    sample: 'Blood',
    takenBy: 'Nurse',
    panel: 'Panel 1',
    fileNo: 'FILE-1',
    userRate: 'Standard',
    resultType: 'Routine',
    tests: [
      {
        id: 'test-local-1',
        backendId: '11111111-1111-4111-8111-111111111111',
        code: 'CBC',
        test: 'CBC',
        reportDays: 1,
        rate: 250,
      },
    ],
    moveAllColumns: false,
    bookingPlusResult: false,
    bookingPlusReceipt: false,
    printWorkingSlip: false,
    extraBy: '',
    discountBy: '',
    payType: 'Cash',
    amount: 250,
    discount: 0,
    discountPercent: 0,
    total: 250,
    net: 250,
    paid: 0,
    cancelRemark: 'Please call before arrival',
  };

  const payload = buildBookingCreatePayload(bookingData);

  assert.equal(payload.patientId, '');
  assert.deepEqual(payload.testIds, ['11111111-1111-4111-8111-111111111111']);
  assert.equal(payload.preferredDate, '2026-07-18');
  assert.equal(payload.paymentMode, 'CASH');
  assert.equal(payload.amount, 250);
  assert.equal(payload.notes, 'Please call before arrival');
});
