import { useState } from 'react';
import { Edit2, Search } from 'lucide-react';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';

const mockDoctors = [
  { id: '1', name: 'Dr. Priya Sharma', spec: 'Cardiologist', phone: '+91-9876543210', status: 'active' },
  { id: '2', name: 'Dr. Ajay Patel', spec: 'Orthopedist', phone: '+91-9876543211', status: 'active' },
  { id: '3', name: 'Dr. Meera Singh', spec: 'Pediatrician', phone: '+91-9876543212', status: 'active' },
];

export default function ReviseDoctorPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDoctors = mockDoctors.filter((d) => d.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Revise Doctor</h2>
        <p className="mt-2 text-sm text-slate-500">Update doctor profiles and contact information.</p>
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
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Specialization</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Phone</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredDoctors.map((doctor) => (
                <tr key={doctor.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{doctor.name}</td>
                  <td className="px-4 py-3 text-slate-600">{doctor.spec}</td>
                  <td className="px-4 py-3 text-slate-600">{doctor.phone}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800">
                      {doctor.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="secondary">
                      <Edit2 size={14} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
