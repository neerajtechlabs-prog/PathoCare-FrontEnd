import { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';

interface Master {
  id: string;
  name: string;
  type: string;
  value: string;
  description: string;
  status: 'active' | 'inactive';
}

const mockMasters: Master[] = [
  { id: '1', name: 'Report Template A', type: 'Report', value: 'Standard Template', description: 'Basic report template', status: 'active' },
  { id: '2', name: 'Reference Range Set 1', type: 'Reference', value: 'Standard Ranges', description: 'Standard lab reference ranges', status: 'active' },
  { id: '3', name: 'Test Category Group 1', type: 'Category', value: 'Routine Tests', description: 'Routine diagnostic tests', status: 'active' },
];

export default function MasterListPage() {
  const [masters, setMasters] = useState<Master[]>(mockMasters);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filteredMasters = masters.filter((m) => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Master List</h2>
          <p className="mt-2 text-sm text-slate-500">Manage laboratory system reference data and configurations.</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="gap-2">
          <Plus size={16} />
          Add Master
        </Button>
      </div>

      <Card>
        <div className="flex items-center gap-2">
          <Search size={16} className="text-slate-400" />
          <Input placeholder="Search masters..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border-0" />
        </div>
      </Card>

      <Card title={`System Masters (${filteredMasters.length})`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Type</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Value</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Description</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredMasters.map((master) => (
                <tr key={master.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{master.name}</td>
                  <td className="px-4 py-3 text-slate-600">
                    <span className="rounded bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700">{master.type}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{master.value}</td>
                  <td className="px-4 py-3 text-slate-600 text-xs">{master.description}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${master.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>
                      {master.status === 'active' ? 'Active' : 'Inactive'}
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
            <h3 className="text-lg font-semibold text-slate-900">Add Master</h3>
            <div className="space-y-3">
              <Input label="Name" placeholder="Master name" />
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Type</label>
                <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                  <option>Report</option>
                  <option>Reference</option>
                  <option>Category</option>
                </select>
              </div>
              <Input label="Value" placeholder="Master value" />
              <Input label="Description" placeholder="Description" />
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button>Save</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
