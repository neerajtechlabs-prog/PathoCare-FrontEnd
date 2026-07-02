import { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, Search } from 'lucide-react';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import Table from '../../../../components/ui/Table';

interface Doctor {
  id: string;
  name: string;
  registrationNumber: string;
  specialization: string;
  phone: string;
  status: 'active' | 'inactive';
  rateCard?: string;
  notes?: string;
}

const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Priya Sharma',
    registrationNumber: 'MCI-45892',
    specialization: 'Cardiologist',
    phone: '+91-9876543210',
    status: 'active',
    rateCard: 'Standard',
    notes: 'Prefers afternoon samples',
  },
  {
    id: '2',
    name: 'Dr. Ajay Patel',
    registrationNumber: 'MCI-45893',
    specialization: 'Orthopedist',
    phone: '+91-9876543211',
    status: 'active',
    rateCard: 'Premium',
    notes: 'Requires urgent reports',
  },
  {
    id: '3',
    name: 'Dr. Meera Singh',
    registrationNumber: 'MCI-45894',
    specialization: 'Pediatrician',
    phone: '+91-9876543212',
    status: 'active',
    rateCard: 'Standard',
    notes: '',
  },
];

export default function DoctorMasterPage() {
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Doctor>>({
    name: '',
    registrationNumber: '',
    specialization: '',
    phone: '',
    status: 'active',
  });

  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.registrationNumber.includes(searchTerm)
  );

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({ name: '', registrationNumber: '', specialization: '', phone: '', status: 'active' });
    setShowModal(true);
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingId(doctor.id);
    setFormData(doctor);
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingId) {
      setDoctors((prev) =>
        prev.map((doc) => (doc.id === editingId ? { ...doc, ...formData } : doc))
      );
    } else {
      setDoctors((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          ...formData,
        } as Doctor,
      ]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this doctor?')) {
      setDoctors((prev) => prev.filter((doc) => doc.id !== id));
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'registrationNumber', label: 'Registration #' },
    { key: 'specialization', label: 'Specialization' },
    { key: 'phone', label: 'Phone' },
    { key: 'rateCard', label: 'Rate Card' },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
            value === 'active'
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-slate-100 text-slate-800'
          }`}
        >
          {value === 'active' ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Doctor Master</h2>
          <p className="mt-2 text-sm text-slate-500">Maintain referring doctors, specializations, and rate cards.</p>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus size={16} />
          Add Doctor
        </Button>
      </div>

      <Card>
        <div className="mb-4 flex items-center gap-2">
          <Search size={16} className="text-slate-400" />
          <Input
            placeholder="Search by name or registration number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-0 placeholder:text-slate-400"
          />
        </div>
      </Card>

      <Card title={`Doctors (${filteredDoctors.length})`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="px-4 py-3 text-left font-semibold text-slate-700">
                    {col.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-right font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredDoctors.map((doctor) => (
                <tr key={doctor.id} className="hover:bg-slate-50">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-slate-600">
                      {col.render ? col.render(doctor[col.key as keyof Doctor] as string) : doctor[col.key as keyof Doctor]}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="text-slate-400 hover:text-slate-600">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => handleEdit(doctor)} className="text-blue-600 hover:text-blue-700">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(doctor.id)} className="text-red-600 hover:text-red-700">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">
              {editingId ? 'Edit Doctor' : 'Add New Doctor'}
            </h3>
            <div className="space-y-3">
              <Input
                label="Doctor Name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full name"
              />
              <Input
                label="Registration Number"
                value={formData.registrationNumber || ''}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                placeholder="MCI registration"
              />
              <Input
                label="Specialization"
                value={formData.specialization || ''}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                placeholder="e.g., Cardiologist"
              />
              <Input
                label="Phone"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91-XXXXXXXXXX"
              />
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Status</label>
                <select
                  value={formData.status || 'active'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
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
