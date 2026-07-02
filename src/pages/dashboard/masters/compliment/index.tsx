import { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';

interface Compliment {
  id: string;
  name: string;
  percentage: number;
  type: 'percentage' | 'fixed';
  amount: number;
  applicable: string;
  status: 'active' | 'inactive';
}

const mockCompliments: Compliment[] = [
  { id: '1', name: 'Doctor Referral Bonus', percentage: 5, type: 'percentage', amount: 0, applicable: 'Referred patients', status: 'active' },
  { id: '2', name: 'Fixed Incentive', percentage: 0, type: 'fixed', amount: 500, applicable: 'Per booking via referral', status: 'active' },
  { id: '3', name: 'Volume Discount', percentage: 10, type: 'percentage', amount: 0, applicable: 'Bulk bookings', status: 'active' },
];

export default function ComplimentPage() {
  const [compliments, setCompliments] = useState<Compliment[]>(mockCompliments);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Compliment>>({});

  const filteredCompliments = compliments.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({});
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingId) {
      setCompliments((prev) => prev.map((c) => (c.id === editingId ? { ...c, ...formData } : c)));
    } else {
      setCompliments((prev) => [...prev, { id: Date.now().toString(), ...formData } as Compliment]);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Compliment Master</h2>
          <p className="mt-2 text-sm text-slate-500">Define referral bonuses, incentives, and compliment schemes.</p>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus size={16} />
          Add Compliment
        </Button>
      </div>

      <Card>
        <div className="flex items-center gap-2">
          <Search size={16} className="text-slate-400" />
          <Input placeholder="Search compliments..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border-0" />
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredCompliments.map((compliment) => (
          <Card key={compliment.id} className="flex flex-col">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">{compliment.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{compliment.applicable}</p>
              </div>
              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${compliment.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>
                {compliment.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Value</span>
                <span className="font-semibold text-slate-900">
                  {compliment.type === 'percentage' ? `${compliment.percentage}%` : `₹${compliment.amount}`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Type</span>
                <span className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">{compliment.type === 'percentage' ? 'Percentage' : 'Fixed'}</span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => { setEditingId(compliment.id); setFormData(compliment); setShowModal(true); }}>
                Edit
              </Button>
              <Button size="sm" variant="secondary">Delete</Button>
            </div>
          </Card>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">{editingId ? 'Edit Compliment' : 'Add Compliment'}</h3>
            <div className="space-y-3">
              <Input label="Name" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Compliment name" />
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Type</label>
                <select value={formData.type || 'percentage'} onChange={(e) => setFormData({ ...formData, type: e.target.value as 'percentage' | 'fixed' })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
              {formData.type === 'percentage' ? (
                <Input label="Percentage" type="number" value={formData.percentage || 0} onChange={(e) => setFormData({ ...formData, percentage: parseFloat(e.target.value) })} placeholder="5" />
              ) : (
                <Input label="Amount (₹)" type="number" value={formData.amount || 0} onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })} placeholder="500" />
              )}
              <Input label="Applicable To" value={formData.applicable || ''} onChange={(e) => setFormData({ ...formData, applicable: e.target.value })} placeholder="e.g., Referred patients" />
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
