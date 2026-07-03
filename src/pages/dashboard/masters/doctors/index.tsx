import { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';

interface DoctorEntry {
  id: string;
  code: string;
  centre: string;
  name: string;
  printName: string;
  designation: string;
  organization: string;
  religion: string;
  location: string;
  address: string;
  email: string;
  userId: string;
  password: string;
  phone1: string;
  phone2: string;
  mobile1: string;
  mobile2: string;
  bookingSms: boolean;
  resultSms: boolean;
  birthday: string;
  anniversary: string;
  complimentPercent: number;
  type: 'Referred' | 'Own';
  isActive: boolean;
}

const mockDoctors: DoctorEntry[] = [
  {
    id: '1',
    code: 'DR001',
    centre: 'JERATH PATH LAB',
    name: 'Dr. Vikash',
    printName: 'Dr. Vikash',
    designation: 'MD',
    organization: 'Path Lab',
    religion: 'Hindu',
    location: 'Meerut',
    address: '723/6 Jagrati Vihar',
    email: 'dr.vikash@example.com',
    userId: 'drvikash',
    password: 'password123',
    phone1: '+91-7512345678',
    phone2: '+91-7512345679',
    mobile1: '+91-8077805674',
    mobile2: '',
    bookingSms: true,
    resultSms: true,
    birthday: '1980-05-22',
    anniversary: '2006-05-22',
    complimentPercent: 5,
    type: 'Referred',
    isActive: true,
  },
];

type DoctorEntryForm = Omit<DoctorEntry, 'id'>;

export default function DoctorsMasterPage() {
  const [doctors, setDoctors] = useState<DoctorEntry[]>(mockDoctors);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const initialFormData: DoctorEntryForm = {
    code: '',
    centre: 'MAIN',
    name: '',
    printName: '',
    designation: '',
    organization: '',
    religion: '',
    location: '',
    address: '',
    email: '',
    userId: '',
    password: '',
    phone1: '',
    phone2: '',
    mobile1: '',
    mobile2: '',
    bookingSms: false,
    resultSms: false,
    birthday: '',
    anniversary: '',
    complimentPercent: 0,
    type: 'Referred',
    isActive: true,
  };
  const [formData, setFormData] = useState<DoctorEntryForm>(initialFormData);

  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    setEditingId(null);
    setFormData(initialFormData);
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingId) {
      setDoctors((prev) => prev.map((doc) => (doc.id === editingId ? { ...doc, ...formData } : doc)));
    } else {
      setDoctors((prev) => [...prev, { id: Date.now().toString(), ...formData }]);
    }
    setShowModal(false);
  };

  const handleEdit = (doctor: DoctorEntry) => {
    setEditingId(doctor.id);
    const { id, ...data } = doctor;
    setFormData(data);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this doctor?')) {
      setDoctors((prev) => prev.filter((doc) => doc.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Doctor Registry</h2>
          <p className="mt-2 text-sm text-slate-500">Register referring physicians, rates, and communication preferences.</p>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus size={16} />
          New Doctor
        </Button>
      </div>

      <Card>
        <div className="flex items-center gap-2">
          <Search size={16} className="text-slate-400" />
          <Input placeholder="Search doctors..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border-0" />
        </div>
      </Card>

      <Card title={`Doctors (${filteredDoctors.length})`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Code</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Centre</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Designation</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Location</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredDoctors.map((doctor) => (
                <tr key={doctor.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{doctor.code}</td>
                  <td className="px-4 py-3 text-slate-600">{doctor.name}</td>
                  <td className="px-4 py-3 text-slate-600">{doctor.centre}</td>
                  <td className="px-4 py-3 text-slate-600">{doctor.designation}</td>
                  <td className="px-4 py-3 text-slate-600">{doctor.location}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="secondary" onClick={() => handleEdit(doctor)}>
                        <Edit2 size={14} />
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => handleDelete(doctor.id)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8">
          <Card className="w-full max-w-4xl space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{editingId ? 'Edit Doctor' : 'New Doctor'}</h3>
                <p className="text-sm text-slate-500">Enter physician registration data and communication preferences.</p>
              </div>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Exit
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Input
                label="Doctor Code"
                value={formData.code || ''}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="DR001"
              />
              <Input
                label="Centre"
                value={formData.centre || ''}
                onChange={(e) => setFormData({ ...formData, centre: e.target.value })}
                placeholder="Centre name"
              />
              <Input
                label="Doctor Name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Dr. Name"
              />
              <Input
                label="Print Name"
                value={formData.printName || ''}
                onChange={(e) => setFormData({ ...formData, printName: e.target.value })}
                placeholder="Print name"
              />
              <Input
                label="Designation"
                value={formData.designation || ''}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="Designation"
              />
              <Input
                label="Organisation"
                value={formData.organization || ''}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="Organisation"
              />
              <Input
                label="Religion"
                value={formData.religion || ''}
                onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                placeholder="Religion"
              />
              <Input
                label="Location"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Location"
              />
              <Input
                label="Address"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Address"
              />
              <Input
                label="Email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email address"
              />
              <Input
                label="User ID"
                value={formData.userId || ''}
                onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                placeholder="User ID"
              />
              <Input
                label="Password"
                type="password"
                value={formData.password || ''}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Password"
              />
              <Input
                label="Phone 1"
                value={formData.phone1 || ''}
                onChange={(e) => setFormData({ ...formData, phone1: e.target.value })}
                placeholder="Phone 1"
              />
              <Input
                label="Phone 2"
                value={formData.phone2 || ''}
                onChange={(e) => setFormData({ ...formData, phone2: e.target.value })}
                placeholder="Phone 2"
              />
              <Input
                label="Mobile 1"
                value={formData.mobile1 || ''}
                onChange={(e) => setFormData({ ...formData, mobile1: e.target.value })}
                placeholder="Mobile 1"
              />
              <Input
                label="Mobile 2"
                value={formData.mobile2 || ''}
                onChange={(e) => setFormData({ ...formData, mobile2: e.target.value })}
                placeholder="Mobile 2"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Doctor Type</label>
                <select
                  value={formData.type || 'Referred'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as DoctorEntry['type'] })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="Referred">Referred</option>
                  <option value="Own">Own</option>
                </select>
              </div>
              <Input
                label="Compliment %"
                type="number"
                value={formData.complimentPercent ?? 0}
                onChange={(e) => setFormData({ ...formData, complimentPercent: Number(e.target.value) })}
                placeholder="0"
              />
              <Input
                label="Birthday"
                type="date"
                value={formData.birthday || ''}
                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
              />
              <Input
                label="Anniversary"
                type="date"
                value={formData.anniversary || ''}
                onChange={(e) => setFormData({ ...formData, anniversary: e.target.value })}
              />
              <div className="flex items-center gap-3">
                <input
                  id="booking-sms"
                  type="checkbox"
                  checked={formData.bookingSms ?? false}
                  onChange={(e) => setFormData({ ...formData, bookingSms: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="booking-sms" className="text-sm text-slate-700">Booking SMS</label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  id="result-sms"
                  type="checkbox"
                  checked={formData.resultSms ?? false}
                  onChange={(e) => setFormData({ ...formData, resultSms: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="result-sms" className="text-sm text-slate-700">Result SMS</label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  id="doctor-active"
                  type="checkbox"
                  checked={formData.isActive ?? true}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="doctor-active" className="text-sm text-slate-700">Is Active</label>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-end">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
