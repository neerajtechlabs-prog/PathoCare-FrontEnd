import { useState } from 'react';
import { Plus, Edit2, Trash2, Building2, MapPin } from 'lucide-react';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';

interface OutsourceLab {
  id: string;
  name: string;
  code: string;
  location: string;
  contact: string;
  tests: string;
  turnaroundDays: number;
  costPerTest: number;
  status: 'active' | 'inactive';
}

const mockLabs: OutsourceLab[] = [
  { id: '1', name: 'Advanced Diagnostics Ltd', code: 'ADL-001', location: 'Delhi', contact: '+91-9876543210', tests: 'Genetic Tests, Molecular', turnaroundDays: 5, costPerTest: 800, status: 'active' },
  { id: '2', name: 'Precision Labs', code: 'PL-001', location: 'Mumbai', contact: '+91-9876543211', tests: 'Cytology, Histology', turnaroundDays: 7, costPerTest: 1200, status: 'active' },
  { id: '3', name: 'Reference Lab India', code: 'RLI-001', location: 'Bangalore', contact: '+91-9876543212', tests: 'Mass Spec, Rare Tests', turnaroundDays: 10, costPerTest: 2500, status: 'active' },
];

export default function OutsourceLabPage() {
  const [labs, setLabs] = useState<OutsourceLab[]>(mockLabs);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Outsource Lab</h2>
          <p className="mt-2 text-sm text-slate-500">Manage outsourced laboratory partners and test forwarding.</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="gap-2">
          <Plus size={16} />
          Add Lab
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {labs.map((lab) => (
          <Card key={lab.id} className="flex flex-col">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-blue-50 p-2">
                  <Building2 size={18} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{lab.name}</h3>
                  <p className="mt-1 text-xs text-slate-500">{lab.code}</p>
                </div>
              </div>
              <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${lab.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>
                {lab.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="mt-3 space-y-2 border-t border-slate-100 pt-3 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin size={14} />
                <span>{lab.location}</span>
              </div>
              <p className="text-slate-600">{lab.contact}</p>
              <p className="text-xs text-slate-500">Tests: {lab.tests}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">TAT: {lab.turnaroundDays} days</span>
                <span className="font-semibold text-slate-900">₹{lab.costPerTest}/test</span>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="secondary">
                <Edit2 size={14} />
              </Button>
              <Button size="sm" variant="secondary">
                <Trash2 size={14} />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Add Outsource Lab</h3>
            <div className="space-y-3">
              <Input label="Lab Name" placeholder="Laboratory name" />
              <Input label="Lab Code" placeholder="ADL-001" />
              <Input label="Location" placeholder="City/State" />
              <Input label="Contact" placeholder="+91-XXXXXXXXXX" />
              <Input label="Tests Offered" placeholder="e.g., Genetic Tests, Molecular" />
              <Input label="Turnaround Days" type="number" placeholder="5" />
              <Input label="Cost Per Test (₹)" type="number" placeholder="800" />
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button>Add Lab</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
