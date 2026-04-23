import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, FieldArray } from 'formik';
import { Plus, Trash2, Save, Printer, Search, User } from 'lucide-react';
import { RootState, AppDispatch } from '../../app/store';
import { LabTest, addBooking } from './testSlice';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';

export default function TestBookingForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { availableTests } = useSelector((state: RootState) => state.tests);
  const { patients } = useSelector((state: RootState) => state.patients);
  
  const [selectedPatientId, setSelectedPatientId] = useState('');

  const selectedPatient = useMemo(() => 
    patients.find(p => p.id === selectedPatientId), 
    [selectedPatientId, patients]
  );

  const initialValues = {
    patientId: '',
    doctorId: 'Self',
    tests: [] as LabTest[],
    discount: 0,
    paidAmount: 0,
    remark: '',
  };

  const calculateTotal = (tests: LabTest[]) => tests.reduce((sum, t) => sum + t.rate, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">New Test Booking</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Printer size={16} />
            Print Last
          </Button>
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          const total = calculateTotal(values.tests);
          const net = total - values.discount;
          dispatch(addBooking({ ...values, total, net, date: new Date().toISOString() }));
          alert('Booking saved successfully!');
        }}
      >
        {({ values, setFieldValue }) => {
          const totalAmount = calculateTotal(values.tests);
          const netAmount = totalAmount - values.discount;
          const balance = netAmount - values.paidAmount;

          return (
            <Form className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Patient & Test Selection */}
              <div className="lg:col-span-2 space-y-6">
                <Card title="Patient & Referral" className="border-brand-100 shadow-brand-50/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">Select Patient</label>
                      <select 
                        className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                        onChange={(e) => {
                          setSelectedPatientId(e.target.value);
                          setFieldValue('patientId', e.target.value);
                        }}
                      >
                        <option value="">-- Choose Patient --</option>
                        {patients.map(p => (
                          <option key={p.id} value={p.id}>{p.name} ({p.regNo})</option>
                        ))}
                      </select>
                    </div>

                    <Input label="Doctor Name" name="doctorId" placeholder="Self / Referring Physician" />
                    
                    {selectedPatient && (
                      <div className="md:col-span-2 flex items-center gap-4 p-3 bg-brand-50 rounded-xl border border-brand-100">
                        <div className="h-10 w-10 rounded-full bg-brand-200 flex items-center justify-center text-brand-700">
                          <User size={20} />
                        </div>
                        <div className="flex-1 grid grid-cols-3 text-xs uppercase tracking-wider font-bold">
                          <div><span className="text-brand-400 block mb-0.5">Age/Sex</span> {selectedPatient.age} / {selectedPatient.gender}</div>
                          <div><span className="text-brand-400 block mb-0.5">Reg No.</span> {selectedPatient.regNo}</div>
                          <div><span className="text-brand-400 block mb-0.5">Mobile</span> {selectedPatient.mobile}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                <Card title="Add Lab Tests" className="overflow-visible">
                  <div className="mb-4">
                    <select
                      className="w-full h-12 rounded-xl border-2 border-slate-100 bg-slate-50 px-4 text-sm font-semibold text-slate-700 focus:border-brand-500 focus:bg-white outline-none transition-all shadow-sm"
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

                  <div className="overflow-hidden rounded-xl border border-slate-200">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 text-slate-500 font-bold text-[11px] uppercase tracking-widest">
                        <tr>
                          <th className="px-4 py-3 text-left">Code</th>
                          <th className="px-4 py-3 text-left">Test Name</th>
                          <th className="px-4 py-3 text-right">Report Days</th>
                          <th className="px-4 py-3 text-right">Rate</th>
                          <th className="px-4 py-3 text-center w-16"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {values.tests.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-12 text-center text-slate-400 italic">No tests assigned yet. Search above to add.</td>
                          </tr>
                        ) : (
                          values.tests.map((test, index) => (
                            <tr key={test.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-4 py-4 font-mono font-bold text-brand-600">{test.code}</td>
                              <td className="px-4 py-4 font-semibold text-slate-700">{test.name}</td>
                              <td className="px-4 py-4 text-right">{test.reportDays} Days</td>
                              <td className="px-4 py-4 text-right font-bold">₹{test.rate}</td>
                              <td className="px-4 py-4 text-center">
                                <button
                                  type="button"
                                  onClick={() => setFieldValue('tests', values.tests.filter((_, i) => i !== index))}
                                  className="text-slate-300 hover:text-red-500 transition-colors p-1"
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
                </Card>
              </div>

              {/* Right Column: Billing Summary */}
              <div className="space-y-6">
                <Card title="Billing Summary" className="bg-slate-900 text-white border-none shadow-xl border-slate-800">
                  <div className="space-y-6 py-2">
                    <div className="flex justify-between items-center text-slate-400 font-medium tracking-tight">
                      <span>Gross Amount</span>
                      <span className="text-xl font-bold text-white tracking-tight">₹{totalAmount}</span>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-800">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">Discount Amount</span>
                        <input
                          type="number"
                          className="w-24 bg-slate-800 border border-slate-700 rounded-lg py-1 px-2 text-right text-sm text-indigo-400 font-bold focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                          value={values.discount}
                          onChange={(e) => setFieldValue('discount', Number(e.target.value))}
                        />
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest text-[10px]">Net Payable</span>
                        <span className="text-3xl font-black text-indigo-400 tracking-tighter">₹{netAmount}</span>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-800">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">Paid Amount</span>
                        <input
                          type="number"
                          className="w-24 bg-slate-800 border border-slate-700 rounded-lg py-1 px-2 text-right text-sm text-white font-bold focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                          value={values.paidAmount}
                          onChange={(e) => setFieldValue('paidAmount', Number(e.target.value))}
                        />
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">Balance</span>
                        <span className={`font-bold ${balance > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                          ₹{balance}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <select className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-sm text-slate-300 outline-none focus:ring-1 focus:ring-indigo-500 mb-4 transition-all">
                        <option>Cash Payment</option>
                        <option>Card / UPI</option>
                        <option>Bank Transfer</option>
                      </select>
                      
                      <Button type="submit" className="w-full h-12 gap-2 text-lg font-bold bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-900/40" disabled={values.tests.length === 0 || !values.patientId}>
                        <Save size={20} />
                        Confirm Booking
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="bg-emerald-50 border-emerald-100">
                  <p className="text-xs text-emerald-800 leading-relaxed italic">
                    Note: A working slip will be printed automatically after confirmation. You can also send an SMS notification to the patient.
                  </p>
                </Card>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
