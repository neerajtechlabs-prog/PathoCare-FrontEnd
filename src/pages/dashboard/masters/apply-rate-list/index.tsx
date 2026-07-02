import { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';

interface RateAssignment {
  id: string;
  doctorName: string;
  rateCard: string;
  discount: number;
  validFrom: string;
  status: 'active' | 'inactive';
}

const mockRateAssignments: RateAssignment[] = [
  { id: '1', doctorName: 'Dr. Priya Sharma', rateCard: 'Standard', discount: 5, validFrom: '2024-01-01', status: 'active' },
  { id: '2', doctorName: 'Dr. Ajay Patel', rateCard: 'Premium', discount: 15, validFrom: '2024-01-15', status: 'active' },
];

export default function ApplyRateListPage() {
  const [assignments, setAssignments] = useState<RateAssignment[]>(mockRateAssignments);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filteredAssignments = assignments.filter((a) => a.doctorName.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Apply Rate List</h2>
          <p className="mt-2 text-sm text-slate-500">Assign rate cards and pricing to doctors/customers.</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="gap-2">
          <Plus size={16} />
          Assign Rate
        </Button>
      </div>

      <Card>
        <div className="flex items-center gap-2">
          <Search size={16} className="text-slate-400" />
          <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border-0" />
        </div>
      </Card>

      <Card title={`Rate Assignments (${filteredAssignments.length})`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Doctor/Customer</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Rate Card</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Discount</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Valid From</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredAssignments.map((assign) => (
                <tr key={assign.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{assign.doctorName}</td>
                  <td className="px-4 py-3 text-slate-600">{assign.rateCard}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{assign.discount}%</td>
                  <td className="px-4 py-3 text-slate-600 text-xs">{assign.validFrom}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800">
                      Active
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="secondary">
                        <Edit2 size={14} />
                      </Button>
                      <Button size="sm" variant="secondary">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Assign Rate List</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Select Doctor/Customer</label>
                <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                  <option>Select...</option>
                  <option>Dr. Priya Sharma</option>
                  <option>Dr. Ajay Patel</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Rate Card</label>
                <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                  <option>Standard</option>
                  <option>Premium</option>
                  <option>Corporate</option>
                </select>
              </div>
              <Input label="Additional Discount %" type="number" placeholder="0" />
              <Input label="Valid From" type="date" />
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button>Assign</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
