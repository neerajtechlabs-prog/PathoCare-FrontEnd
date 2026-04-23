import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import { z } from 'zod';
import { Plus, Trash2, Save, Printer, Search, User, RefreshCw, LogOut, Trash, Copy, Download } from 'lucide-react';
import { RootState, AppDispatch } from '../../app/store';
import { LabTest, addBooking } from './testSlice';
import { bookingFormSchema } from '../../schemas/bookingSchema';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';

// Helper function to convert Zod errors to Formik errors
function toFormikErrors(error: z.ZodError<any>) {
  const errors: Record<string, string> = {};
  error.issues.forEach((err: any) => {
    const path = err.path.join('.');
    errors[path] = err.message;
  });
  return errors;
}

// Validation function for Formik
const validate = (values: any) => {
  try {
    bookingFormSchema.parse(values);
    return {};
  } catch (error) {
    if (error instanceof z.ZodError) {
      return toFormikErrors(error);
    }
    return {};
  }
};

export default function TestBookingForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { availableTests } = useSelector((state: RootState) => state.tests);
  const { patients } = useSelector((state: RootState) => state.patients);
  
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any>(null);
  const [showJsonModal, setShowJsonModal] = useState(false);

  const selectedPatient = useMemo(() => 
    patients.find(p => p.id === selectedPatientId), 
    [selectedPatientId, patients]
  );

  const initialValues = {
    // Booking Details
    centre: '',
    regNo: '',
    barcode: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    recordNo: '',
    uid: '',

    // Patient Details
    patientTitle: 'Mr.',
    patientName: '',
    age: 0,
    ageUnit: 'Year',
    sex: '',
    mobile: '',
    email: '',
    area: '',

    // Doctor & Sample
    doctor: '',
    doctorEmail: '',
    doctorType: '',
    bookingType: '',
    sample: '',
    takenBy: '',
    panel: '',
    fileNo: '',
    userRate: 'Standard',
    resultType: 'Normal',

    // Tests
    tests: [] as LabTest[],

    // Options
    moveAllColumns: false,
    bookingPlusResult: false,
    bookingPlusReceipt: false,
    printWorkingSlip: false,

    // Billing
    extraBy: '',
    discountBy: '',
    payType: 'Cash',
    amount: 0,
    discount: 0,
    discountPercent: 0,
    total: 0,
    net: 0,
    paid: 0,

    // Additional
    cancelRemark: '',
  };

  const calculateTotal = (tests: LabTest[]) => tests.reduce((sum, t) => sum + t.rate, 0);

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">📋 New Test Booking</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Search size={16} />
            Search
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Printer size={16} />
            Print
          </Button>
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          console.clear(); // Clear previous logs
          setValidationError(null);
          setSuccessData(null);

          // 🔥 Debug: Form submitted
          console.log('%c🚀 FORM SUBMISSION INITIATED', 'background: #0066ff; color: #fff; font-size: 14px; font-weight: bold; padding: 8px;');

          try {
            // Validate using Zod schema
            const validatedData = bookingFormSchema.parse(values);
            
            // Calculate totals
            const total = calculateTotal(validatedData.tests as any);
            const discount = (total * validatedData.discountPercent) / 100;
            const net = total - discount;

            // Prepare final data
            const bookingData = {
              ...validatedData,
              total,
              discount,
              net,
              amount: total,
              date: new Date().toISOString(),
              patientId: selectedPatientId,
            };

            // ✅ SUCCESS LOGS
            console.log('%c✅ BOOKING FORM DATA SUBMITTED SUCCESSFULLY', 'background: #00cc00; color: #000; font-size: 16px; font-weight: bold; padding: 10px;');
            console.log('%c' + '='.repeat(80), 'color: #00cc00; font-weight: bold;');
            console.log('📋 COMPLETE FORM DATA:');
            console.table(bookingData);
            console.log('%c' + '='.repeat(80), 'color: #00cc00; font-weight: bold;');
            console.log('✅ Validation Status: PASSED');
            console.log('📅 Submission Time:', new Date().toLocaleString());
            console.log('💾 Data ready for API submission');
            console.log('%c' + '='.repeat(80), 'color: #00cc00; font-weight: bold;');

            // Show success with JSON modal
            setSuccessData(bookingData);
            setShowJsonModal(true);

            // Dispatch to Redux
            dispatch(addBooking(bookingData as any));
          } catch (error) {
            // ❌ ERROR HANDLING
            if (error instanceof z.ZodError) {
              const firstError = error.issues[0];
              const fieldName = firstError.path.join('.');
              
              // 🔴 ERROR LOGS
              console.log('%c❌ BOOKING FORM VALIDATION FAILED', 'background: #ff0000; color: #fff; font-size: 16px; font-weight: bold; padding: 10px;');
              console.log('%c' + '='.repeat(80), 'color: #ff0000; font-weight: bold;');
              console.log('❌ Error Field:', fieldName);
              console.log('❌ Error Message:', firstError.message);
              console.log('⏰ Error Time:', new Date().toLocaleString());
              console.log('%c' + '='.repeat(80), 'color: #ff0000; font-weight: bold;');
              console.log('📋 All Validation Issues:');
              console.table(error.issues.map(e => ({
                field: e.path.join('.'),
                message: e.message,
                code: e.code
              })));
              console.log('%c' + '='.repeat(80), 'color: #ff0000; font-weight: bold;');
              
              // Set validation error message
              setValidationError(`❌ ${firstError.message}`);

              // Try to focus the first error field
              const errorElement = document.querySelector(
                `input[name="${fieldName}"], select[name="${fieldName}"], textarea[name="${fieldName}"]`
              ) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
              
              if (errorElement) {
                setTimeout(() => {
                  errorElement.focus();
                  errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
              }
            }
          }
        }}
      >
        {({ values, setFieldValue, errors, touched, submitForm }) => {
          const totalAmount = calculateTotal(values.tests);
          const discountAmount = (totalAmount * values.discountPercent) / 100;
          const netAmount = totalAmount - discountAmount;
          const balance = netAmount - values.paid;

          return (
            <Form className="space-y-6">
              {/* VALIDATION ERROR ALERT */}
              {validationError && (
                <Card className="bg-red-50 border-2 border-red-300 shadow-md">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-bold text-red-700 mb-1">Validation Failed</h4>
                      <p className="text-red-600 text-sm">{validationError}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setValidationError(null)}
                      className="text-red-400 hover:text-red-600 font-bold text-xl"
                    >
                      ✕
                    </button>
                  </div>
                </Card>
              )}

              {/* SUCCESS NOTIFICATION */}
              {successData && (
                <Card className="bg-green-50 border-2 border-green-300 shadow-md">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-bold text-green-700 mb-1">✅ Booking Validation Successful!</h4>
                      <p className="text-green-600 text-sm">All fields are valid. JSON data ready to save.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSuccessData(null);
                        setShowJsonModal(false);
                      }}
                      className="text-green-400 hover:text-green-600 font-bold text-xl"
                    >
                      ✕
                    </button>
                  </div>
                </Card>
              )}
              {/* 1. BOOKING DETAILS SECTION */}
              <Card title="📅 Booking Details" className="border-blue-100 shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Centre *</label>
                    <select 
                      name="centre"
                      value={values.centre}
                      onChange={(e) => setFieldValue('centre', e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="">Select Centre</option>
                      <option value="MAIN">SAI PATHOLOGY LAB - MAIN</option>
                      <option value="BRANCH1">SAI PATHOLOGY LAB - BRANCH 1</option>
                      <option value="BRANCH2">SAI PATHOLOGY LAB - BRANCH 2</option>
                    </select>
                    {errors.centre && touched.centre && <p className="text-red-500 text-xs mt-1">{errors.centre}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Reg No *</label>
                    <input
                      type="text"
                      name="regNo"
                      value={values.regNo}
                      onChange={(e) => setFieldValue('regNo', e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Registration number"
                    />
                    {errors.regNo && touched.regNo && <p className="text-red-500 text-xs mt-1">{errors.regNo}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Barcode</label>
                    <input
                      type="text"
                      name="barcode"
                      value={values.barcode}
                      onChange={(e) => setFieldValue('barcode', e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Scan barcode"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date *</label>
                    <input
                      type="date"
                      name="date"
                      value={values.date}
                      onChange={(e) => setFieldValue('date', e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    {errors.date && touched.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Time</label>
                    <input
                      type="time"
                      name="time"
                      value={values.time}
                      onChange={(e) => setFieldValue('time', e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Record No</label>
                    <input
                      type="text"
                      name="recordNo"
                      value={values.recordNo}
                      onChange={(e) => setFieldValue('recordNo', e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Record number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">UID</label>
                    <input
                      type="text"
                      name="uid"
                      value={values.uid}
                      onChange={(e) => setFieldValue('uid', e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Unique identifier"
                    />
                  </div>

                  <div></div>
                </div>
              </Card>

              {/* 2. PATIENT DETAILS SECTION */}
              <Card title="👤 Patient Information" className="border-green-100 shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                    <select
                      name="patientTitle"
                      value={values.patientTitle}
                      onChange={(e) => setFieldValue('patientTitle', e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                    >
                      <option value="Mr.">Mr.</option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Ms.">Ms.</option>
                      <option value="Dr.">Dr.</option>
                    </select>
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Patient Name *</label>
                    <input
                      type="text"
                      name="patientName"
                      value={values.patientName}
                      onChange={(e) => setFieldValue('patientName', e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                      placeholder="Full name"
                    />
                    {errors.patientName && touched.patientName && <p className="text-red-500 text-xs mt-1">{errors.patientName}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Age *</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        name="age"
                        value={values.age}
                        onChange={(e) => setFieldValue('age', e.target.value)}
                        className="flex-1 h-10 rounded-lg border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                        placeholder="Age"
                      />
                      <select
                        name="ageUnit"
                        value={values.ageUnit}
                        onChange={(e) => setFieldValue('ageUnit', e.target.value)}
                        className="w-20 h-10 rounded-lg border border-gray-300 px-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                      >
                        <option value="Year">Year</option>
                        <option value="Month">Month</option>
                        <option value="Day">Day</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Sex *</label>
                    <select
                      name="sex"
                      value={values.sex}
                      onChange={(e) => setFieldValue('sex', e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile *</label>
                    <input
                      type="text"
                      name="mobile"
                      value={values.mobile}
                      onChange={(e) => setFieldValue('mobile', e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                      placeholder="10-digit mobile"
                    />
                    {errors.mobile && touched.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Area/Locality</label>
                    <input
                      type="text"
                      name="area"
                      value={values.area}
                      onChange={(e) => setFieldValue('area', e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                      placeholder="Area"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={values.email}
                      onChange={(e) => setFieldValue('email', e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                      placeholder="Email (optional)"
                    />
                  </div>
                </div>
              </Card>

              {/* 3. DOCTOR & SAMPLE SECTION */}
              <Card title="👨‍⚕️ Doctor & Sample Details" className="border-purple-100 shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Doctor *</label>
                    <select
                      name="doctor"
                      value={values.doctor}
                      onChange={(e) => setFieldValue('doctor', e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                    >
                      <option value="">Select Doctor</option>
                      <option value="DR001">Dr. Sharma</option>
                      <option value="DR002">Dr. Patel</option>
                      <option value="DR003">Dr. Gupta</option>
                    </select>
                    {errors.doctor && touched.doctor && <p className="text-red-500 text-xs mt-1">{errors.doctor}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Doctor Email</label>
                    <input
                      type="email"
                      name="doctorEmail"
                      value={values.doctorEmail}
                      onChange={(e) => setFieldValue('doctorEmail', e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                      placeholder="Doctor email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Doctor Type</label>
                    <select
                      name="doctorType"
                      value={values.doctorType}
                      onChange={(e) => setFieldValue('doctorType', e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                    >
                      <option value="">Select</option>
                      <option value="GP">GP</option>
                      <option value="Specialist">Specialist</option>
                      <option value="Surgeon">Surgeon</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Sample Type *</label>
                    <select
                      name="sample"
                      value={values.sample}
                      onChange={(e) => setFieldValue('sample', e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                    >
                      <option value="">Select</option>
                      <option value="BLOOD">Blood</option>
                      <option value="URINE">Urine</option>
                      <option value="STOOL">Stool</option>
                      <option value="SALIVA">Saliva</option>
                    </select>
                    {errors.sample && touched.sample && <p className="text-red-500 text-xs mt-1">{errors.sample}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Taken By</label>
                    <input
                      type="text"
                      name="takenBy"
                      value={values.takenBy}
                      onChange={(e) => setFieldValue('takenBy', e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                      placeholder="Technician name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Panel</label>
                    <select
                      name="panel"
                      value={values.panel}
                      onChange={(e) => setFieldValue('panel', e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                    >
                      <option value="">Select Panel</option>
                      <option value="BP001">Basic Health Panel</option>
                      <option value="BP002">Comprehensive Panel</option>
                      <option value="BP003">Thyroid Panel</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">File No</label>
                    <input
                      type="text"
                      name="fileNo"
                      value={values.fileNo}
                      onChange={(e) => setFieldValue('fileNo', e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                      placeholder="File number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">User Rate</label>
                    <select
                      name="userRate"
                      value={values.userRate}
                      onChange={(e) => setFieldValue('userRate', e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                    >
                      <option value="Standard">Standard</option>
                      <option value="Employee">Employee</option>
                      <option value="Student">Student</option>
                      <option value="Corporate">Corporate</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Result Type</label>
                    <select
                      name="resultType"
                      value={values.resultType}
                      onChange={(e) => setFieldValue('resultType', e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                    >
                      <option value="Normal">Normal</option>
                      <option value="Abnormal">Abnormal</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </div>
              </Card>

              {/* 4. TESTS & OPTIONS SECTION */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card title="🧪 Lab Tests" className="overflow-visible">
                    <div className="mb-4">
                      <select
                        className="w-full h-12 rounded-xl border-2 border-blue-200 bg-blue-50 px-4 text-sm font-semibold text-blue-900 focus:border-blue-500 focus:bg-white outline-none transition-all shadow-sm"
                        onChange={(e) => {
                          const test = availableTests.find(t => t.id === e.target.value);
                          if (test && !values.tests.some(t => t.id === test.id)) {
                            setFieldValue('tests', [...values.tests, test]);
                          }
                          e.target.value = '';
                        }}
                      >
                        <option value="">🔍 Search and Select Test From Master...</option>
                        {availableTests.map(t => (
                          <option key={t.id} value={t.id}>{t.code} - {t.name} (₹{t.rate})</option>
                        ))}
                      </select>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                      <table className="w-full text-sm">
                        <thead className="bg-blue-50 text-blue-700 font-bold text-xs uppercase tracking-widest">
                          <tr>
                            <th className="px-4 py-3 text-left">Code</th>
                            <th className="px-4 py-3 text-left">Test Name</th>
                            <th className="px-4 py-3 text-right">Report Days</th>
                            <th className="px-4 py-3 text-right">Rate</th>
                            <th className="px-4 py-3 text-center w-16">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {values.tests.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="py-12 text-center text-gray-400 italic">No tests assigned yet. Search above to add.</td>
                            </tr>
                          ) : (
                            values.tests.map((test, index) => (
                              <tr key={test.id} className="hover:bg-blue-50/50 transition-colors">
                                <td className="px-4 py-4 font-mono font-bold text-blue-600">{test.code}</td>
                                <td className="px-4 py-4 font-semibold text-gray-700">{test.name}</td>
                                <td className="px-4 py-4 text-right">{test.reportDays} Days</td>
                                <td className="px-4 py-4 text-right font-bold">₹{test.rate}</td>
                                <td className="px-4 py-4 text-center">
                                  <button
                                    type="button"
                                    onClick={() => setFieldValue('tests', values.tests.filter((_, i) => i !== index))}
                                    className="text-gray-300 hover:text-red-500 transition-colors p-1"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                    {errors.tests && typeof errors.tests === 'string' && <p className="text-red-500 text-xs mt-2">{errors.tests}</p>}
                  </Card>

                  {/* OPTIONS SECTION */}
                  <Card title="⚙️ Options" className="bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="moveAllColumns"
                          checked={values.moveAllColumns}
                          onChange={(e) => setFieldValue('moveAllColumns', e.target.checked)}
                          className="w-5 h-5 rounded border-gray-300"
                        />
                        <span className="text-sm font-medium text-gray-700">Move All Columns</span>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="bookingPlusResult"
                          checked={values.bookingPlusResult}
                          onChange={(e) => setFieldValue('bookingPlusResult', e.target.checked)}
                          className="w-5 h-5 rounded border-gray-300"
                        />
                        <span className="text-sm font-medium text-gray-700">Booking + Result</span>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="bookingPlusReceipt"
                          checked={values.bookingPlusReceipt}
                          onChange={(e) => setFieldValue('bookingPlusReceipt', e.target.checked)}
                          className="w-5 h-5 rounded border-gray-300"
                        />
                        <span className="text-sm font-medium text-gray-700">Booking + Receipt</span>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="printWorkingSlip"
                          checked={values.printWorkingSlip}
                          onChange={(e) => setFieldValue('printWorkingSlip', e.target.checked)}
                          className="w-5 h-5 rounded border-gray-300"
                        />
                        <span className="text-sm font-medium text-gray-700">Print Working Slip</span>
                      </label>
                    </div>
                  </Card>

                  {/* ADDITIONAL INFORMATION */}
                  <Card title="📝 Additional Information">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Cancel/Remarks</label>
                    <textarea
                      name="cancelRemark"
                      value={values.cancelRemark}
                      onChange={(e) => setFieldValue('cancelRemark', e.target.value)}
                      className="w-full h-24 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                      placeholder="Enter any remarks or cancellation reasons..."
                    />
                  </Card>
                </div>

                {/* RIGHT COLUMN: BILLING */}
                <div className="space-y-6">
                  <Card title="💰 Billing Summary" className="bg-linear-to-b from-slate-900 to-slate-800 text-white border-none shadow-xl">
                    <div className="space-y-6 py-2">
                      <div className="flex justify-between items-center text-gray-300 font-medium">
                        <span>Gross Amount</span>
                        <span className="text-2xl font-bold text-white">₹{totalAmount}</span>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-slate-700">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-300">Discount %</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              name="discountPercent"
                              value={values.discountPercent}
                              onChange={(e) => setFieldValue('discountPercent', Number(e.target.value))}
                              className="w-20 bg-slate-700 border border-slate-600 rounded-lg py-1 px-2 text-right text-sm text-blue-300 font-bold focus:ring-1 focus:ring-blue-500 outline-none"
                              min="0"
                              max="100"
                            />
                            <span>%</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-xs text-gray-400">
                          <span>Discount Amount</span>
                          <span className="text-lg font-bold text-yellow-400">₹{discountAmount.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-slate-700">
                          <span className="text-sm font-bold text-gray-300 uppercase tracking-wide">Net Payable</span>
                          <span className="text-3xl font-black text-green-400 tracking-tight">₹{netAmount.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-slate-700">
                        <div>
                          <label className="block text-sm text-gray-300 mb-2">Extra By</label>
                          <select
                            name="extraBy"
                            value={values.extraBy}
                            onChange={(e) => setFieldValue('extraBy', e.target.value)}
                            className="w-full h-9 bg-slate-700 border border-slate-600 rounded px-2 text-sm text-gray-100 outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="">Select</option>
                            <option value="Cost">Cost</option>
                            <option value="Percentage">Percentage</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm text-gray-300 mb-2">Discount By</label>
                          <select
                            name="discountBy"
                            value={values.discountBy}
                            onChange={(e) => setFieldValue('discountBy', e.target.value)}
                            className="w-full h-9 bg-slate-700 border border-slate-600 rounded px-2 text-sm text-gray-100 outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="">Select</option>
                            <option value="Staff">Staff</option>
                            <option value="Senior">Senior</option>
                            <option value="Corporate">Corporate</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm text-gray-300 mb-2">Payment Type *</label>
                          <select
                            name="payType"
                            value={values.payType}
                            onChange={(e) => setFieldValue('payType', e.target.value)}
                            className="w-full h-9 bg-slate-700 border border-slate-600 rounded px-2 text-sm text-gray-100 outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="Cash">Cash</option>
                            <option value="Card">Card / UPI</option>
                            <option value="Cheque">Cheque</option>
                            <option value="Online">Online Transfer</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-slate-700">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-300">Paid Amount</span>
                          <input
                            type="number"
                            name="paid"
                            value={values.paid}
                            onChange={(e) => setFieldValue('paid', Number(e.target.value))}
                            className="w-24 bg-slate-700 border border-slate-600 rounded-lg py-1 px-2 text-right text-sm text-white font-bold focus:ring-1 focus:ring-blue-500 outline-none"
                          />
                        </div>

                        <div className="flex justify-between items-center pt-2">
                          <span className="text-sm text-gray-300">Balance</span>
                          <span className={`font-bold text-lg ${balance > 0 ? 'text-amber-400' : balance < 0 ? 'text-red-400' : 'text-green-400'}`}>
                            ₹{balance.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-emerald-50 border-emerald-200">
                    <p className="text-xs text-emerald-800 leading-relaxed italic">
                      ✓ A working slip will be printed automatically after confirmation. SMS notification will be sent to patient.
                    </p>
                  </Card>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <Card className="bg-white border-gray-200 shadow-md sticky bottom-0 z-10">
                <div className="flex gap-3 flex-wrap">
                  <Button 
                    type="button"
                    onClick={submitForm}
                    className="gap-2 text-base font-bold bg-blue-600 hover:bg-blue-700" 
                    disabled={values.tests.length === 0}
                  >
                    <Save size={18} />
                    Save Booking
                  </Button>
                  
                  <Button variant="outline" className="gap-2">
                    <Trash size={18} />
                    Delete
                  </Button>

                  <Button variant="outline" className="gap-2">
                    <Printer size={18} />
                    Print
                  </Button>

                  <Button 
                    type="button"
                    onClick={() => {
                      setValidationError(null);
                      setSuccessData(null);
                      setShowJsonModal(false);
                      // Reset form values
                      const newValues = {
                        ...initialValues,
                        date: new Date().toISOString().split('T')[0],
                      };
                      Object.keys(initialValues).forEach(key => {
                        if (typeof newValues[key as keyof typeof initialValues] !== 'undefined') {
                          // Reset form
                        }
                      });
                    }}
                    className="gap-2"
                  >
                    <RefreshCw size={18} />
                    Refresh
                  </Button>

                  <Button variant="outline" className="gap-2 text-red-600 hover:bg-red-50 ml-auto">
                    <LogOut size={18} />
                    Exit
                  </Button>
                </div>
              </Card>
            </Form>
          );
        }}
      </Formik>

      {/* JSON MODAL */}
      {showJsonModal && successData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-auto bg-white shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-4 border-b">
              <h3 className="text-2xl font-bold text-gray-900">📊 Booking Data JSON</h3>
              <button
                onClick={() => {
                  setShowJsonModal(false);
                  setSuccessData(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <p className="text-green-700 font-semibold">✅ All validations passed successfully!</p>
              </div>

              {/* JSON Display */}
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{JSON.stringify(successData, null, 2)}</pre>
              </div>

              {/* Copy Button */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(successData, null, 2));
                    alert('✅ JSON copied to clipboard!');
                  }}
                >
                  <Copy size={18} />
                  Copy JSON
                </Button>

                <Button
                  type="button"
                  className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    const dataStr = JSON.stringify(successData, null, 2);
                    const dataBlob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(dataBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `booking-${new Date().getTime()}.json`;
                    link.click();
                  }}
                >
                  <Download size={18} />
                  Download JSON
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="gap-2"
                  onClick={() => {
                    setShowJsonModal(false);
                    setSuccessData(null);
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
