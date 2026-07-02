import { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';

interface SampleType {
  id: string;
  name: string;
  code: string;
  collectionMethod: string;
  storageTemp: string;
  validityDays: number;
  status: 'active' | 'inactive';
}

const mockSampleTypes: SampleType[] = [
  { id: '1', name: 'Whole Blood', code: 'WB', collectionMethod: 'Venipuncture', storageTemp: '2-8°C', validityDays: 7, status: 'active' },
  { id: '2', name: 'Serum', code: 'SR', collectionMethod: 'Venipuncture (clotted tube)', storageTemp: '2-8°C', validityDays: 5, status: 'active' },
  { id: '3', name: 'Plasma', code: 'PL', collectionMethod: 'Venipuncture (anticoagulant)', storageTemp: '-20°C', validityDays: 30, status: 'active' },
  { id: '4', name: 'Urine', code: 'UR', collectionMethod: 'Mid-stream catch', storageTemp: '2-8°C', validityDays: 24, status: 'active' },
  { id: '5', name: 'Stool', code: 'ST', collectionMethod: 'Collection container', storageTemp: 'Room temp', validityDays: 2, status: 'active' },
  { id: '6', name: 'CSF', code: 'CSF', collectionMethod: 'Lumbar puncture', storageTemp: 'Room temp', validityDays: 1, status: 'active' },
];

export default function SampleListPage() {
  const [samples, setSamples] = useState<SampleType[]>(mockSampleTypes);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<SampleType>>({});

  const filteredSamples = samples.filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.code.includes(searchTerm.toUpperCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Sample List</h2>
          <p className="mt-2 text-sm text-slate-500">Manage sample types, collection methods, and storage requirements.</p>
        </div>
        <Button onClick={() => { setEditingId(null); setFormData({}); setShowModal(true); }} className="gap-2">
          <Plus size={16} />
          Add Sample
        </Button>
      </div>

      <Card>
        <div className="flex items-center gap-2">
          <Search size={16} className="text-slate-400" />
          <Input placeholder="Search sample types..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border-0" />
        </div>
      </Card>

      <Card title={`Sample Types (${filteredSamples.length})`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Code</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Collection</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Storage Temp</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Validity</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredSamples.map((sample) => (
                <tr key={sample.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{sample.name}</td>
                  <td className="px-4 py-3 text-slate-600">
                    <span className="rounded bg-slate-100 px-2 py-1 font-mono text-xs">{sample.code}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-xs">{sample.collectionMethod}</td>
                  <td className="px-4 py-3 text-slate-600 text-xs">{sample.storageTemp}</td>
                  <td className="px-4 py-3 text-slate-600">{sample.validityDays} days</td>
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
            <h3 className="text-lg font-semibold text-slate-900">{editingId ? 'Edit Sample Type' : 'Add Sample Type'}</h3>
            <div className="space-y-3">
              <Input label="Name" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Whole Blood" />
              <Input label="Code" value={formData.code || ''} onChange={(e) => setFormData({ ...formData, code: e.target.value })} placeholder="WB" />
              <Input label="Collection Method" value={formData.collectionMethod || ''} onChange={(e) => setFormData({ ...formData, collectionMethod: e.target.value })} placeholder="Venipuncture" />
              <Input label="Storage Temperature" value={formData.storageTemp || ''} onChange={(e) => setFormData({ ...formData, storageTemp: e.target.value })} placeholder="2-8°C" />
              <Input label="Validity (days)" type="number" value={formData.validityDays || 0} onChange={(e) => setFormData({ ...formData, validityDays: parseInt(e.target.value) })} placeholder="7" />
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
