import { useState } from 'react';
import { Edit2, Search } from 'lucide-react';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';

const mockTests = [
  { id: '1', name: 'Complete Blood Count', code: 'CBC', price: 250, tat: 2, status: 'active' },
  { id: '2', name: 'Blood Sugar', code: 'BS', price: 150, tat: 2, status: 'active' },
  { id: '3', name: 'Lipid Profile', code: 'LP', price: 500, tat: 4, status: 'active' },
];

export default function ReviseTestPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTests = mockTests.filter((t) => t.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Revise Test</h2>
        <p className="mt-2 text-sm text-slate-500">Update test details, pricing, and turnaround time.</p>
      </div>

      <Card>
        <div className="flex items-center gap-2">
          <Search size={16} className="text-slate-400" />
          <Input placeholder="Search tests..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border-0" />
        </div>
      </Card>

      <Card title={`Tests (${filteredTests.length})`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Code</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Price</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">TAT (hrs)</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredTests.map((test) => (
                <tr key={test.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{test.name}</td>
                  <td className="px-4 py-3 text-slate-600">
                    <span className="rounded bg-slate-100 px-2 py-1 font-mono text-xs">{test.code}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900">₹{test.price}</td>
                  <td className="px-4 py-3 text-slate-600">{test.tat}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800">
                      Active
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
