import { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';

interface BillType {
  id: string;
  name: string;
  code: string;
  description: string;
  status: 'active' | 'inactive';
}

const mockBillTypes: BillType[] = [
  { id: '1', name: 'OPD', code: 'OPD', description: 'Out Patient Department billing', status: 'active' },
  { id: '2', name: 'Home Sample Collection', code: 'HSC', description: 'Home visit sample collection charges', status: 'active' },
  { id: '3', name: 'Urgent Processing', code: 'UP', description: 'Express/urgent report generation', status: 'active' },
  { id: '4', name: 'Corporate Package', code: 'CORP', description: 'Bulk corporate billing', status: 'active' },
];

export default function BillTypePage() {
  const [billTypes, setBillTypes] = useState<BillType[]>(mockBillTypes);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<BillType>>({});

  const filteredTypes = billTypes.filter(
    (type) => type.name.toLowerCase().includes(searchTerm.toLowerCase()) || type.code.includes(searchTerm.toUpperCase())
  );

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({});
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingId) {
      setBillTypes((prev) => prev.map((t) => (t.id === editingId ? { ...t, ...formData } : t)));
    } else {
      setBillTypes((prev) => [...prev, { id: Date.now().toString(), ...formData } as BillType]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this bill type?')) {
      setBillTypes((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Bill Type Master</h2>
          <p className="mt-2 text-sm text-slate-500">Define billing categories and invoice types.</p>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus size={16} />
          Add Type
        </Button>
      </div>

      <Card>
        <div className="flex items-center gap-2">
          <Search size={16} className="text-slate-400" />
          <Input
            placeholder="Search bill types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-0"
          />
        </div>
      </Card>

      <Card title={`Bill Types (${filteredTypes.length})`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Code</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Description</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredTypes.map((type) => (
                <tr key={type.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{type.name}</td>
                  <td className="px-4 py-3 text-slate-600">
                    <span className="rounded bg-slate-100 px-2 py-1 font-mono text-xs">{type.code}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{type.description}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        type.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {type.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="secondary" onClick={() => { setEditingId(type.id); setFormData(type); setShowModal(true); }}>
                        <Edit2 size={14} />
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => handleDelete(type.id)}>
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
            <h3 className="text-lg font-semibold text-slate-900">{editingId ? 'Edit Bill Type' : 'Add Bill Type'}</h3>
            <div className="space-y-3">
              <Input label="Name" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., OPD" />
              <Input label="Code" value={formData.code || ''} onChange={(e) => setFormData({ ...formData, code: e.target.value })} placeholder="e.g., OPD" />
              <Input label="Description" value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description" />
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Status</label>
                <select value={formData.status || 'active'} onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
