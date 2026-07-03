import { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';

interface NumberingSeries {
  prefix: string;
  suffix: string;
  startCounter: number;
  format: string;
}

interface ReceiptConfig extends NumberingSeries {
  counterType: 'Daily' | 'Monthly' | 'Yearly';
}

interface BillType {
  id: string;
  billType: string;
  billSeries: NumberingSeries;
  receiptSeries: ReceiptConfig;
  description: string;
}

type BillTypeForm = Omit<BillType, 'id'>;

const mockBillTypes: BillType[] = [
  {
    id: '1',
    billType: 'OPD',
    description: 'Out Patient Department billing',
    billSeries: {
      prefix: 'OPD',
      suffix: '',
      startCounter: 1000,
      format: 'OPD-{yyyy}-{count:05}',
    },
    receiptSeries: {
      prefix: 'R-OPD',
      suffix: '',
      startCounter: 1,
      counterType: 'Daily',
      format: 'RCPT-{ddMMyy}-{count:04}',
    },
  },
  {
    id: '2',
    billType: 'HSC',
    description: 'Home Sample Collection package',
    billSeries: {
      prefix: 'HSC',
      suffix: '',
      startCounter: 200,
      format: 'HSC-{yyyy}-{count:04}',
    },
    receiptSeries: {
      prefix: 'R-HSC',
      suffix: '',
      startCounter: 1,
      counterType: 'Monthly',
      format: 'RCPT-{MM-yyyy}-{count:04}',
    },
  },
];

export default function BillTypePage() {
  const [billTypes, setBillTypes] = useState<BillType[]>(mockBillTypes);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const initialFormData: BillTypeForm = {
    billType: '',
    description: '',
    billSeries: {
      prefix: '',
      suffix: '',
      startCounter: 1,
      format: 'BILL-{yyyy}-{count:04}',
    },
    receiptSeries: {
      prefix: '',
      suffix: '',
      startCounter: 1,
      counterType: 'Daily',
      format: 'RCPT-{ddMMyy}-{count:04}',
    },
  };
  const [formData, setFormData] = useState<BillTypeForm>(initialFormData);

  const filteredTypes = billTypes.filter(
    (type) =>
      type.billType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    setEditingId(null);
    setFormData(initialFormData);
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingId) {
      setBillTypes((prev) => prev.map((type) => (type.id === editingId ? { ...type, ...formData } : type)));
    } else {
      setBillTypes((prev) => [...prev, { id: Date.now().toString(), ...formData }]);
    }

    setShowModal(false);
  };

  const handleEdit = (type: BillType) => {
    setEditingId(type.id);
    const { id, ...data } = type;
    setFormData(data);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this bill type configuration?')) {
      setBillTypes((prev) => prev.filter((type) => type.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Bill Type Setup</h2>
          <p className="mt-2 text-sm text-slate-500">Configure billing series and receipt numbering formats for the laboratory.</p>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus size={16} />
          New Bill Type
        </Button>
      </div>

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-slate-500">
            <Search size={16} />
            <span className="text-sm">Search</span>
          </div>
          <Input
            placeholder="Search bill types or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-0"
          />
        </div>
      </Card>

      <Card title={`Bill Type Configurations (${filteredTypes.length})`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Bill Type</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Bill Format</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Receipt Format</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Counter</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Description</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredTypes.map((type) => (
                <tr key={type.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{type.billType}</td>
                  <td className="px-4 py-3 text-slate-600">{type.billSeries.format}</td>
                  <td className="px-4 py-3 text-slate-600">{type.receiptSeries.format}</td>
                  <td className="px-4 py-3 text-slate-600">{type.receiptSeries.counterType}</td>
                  <td className="px-4 py-3 text-slate-600">{type.description}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="secondary" onClick={() => handleEdit(type)}>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8">
          <Card className="w-full max-w-3xl space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{editingId ? 'Edit Bill Type' : 'New Bill Type Configuration'}</h3>
                <p className="text-sm text-slate-500">Define bill and receipt numbering rules for the selected billing category.</p>
              </div>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Exit
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Input
                label="Bill Type"
                value={formData.billType || ''}
                onChange={(e) => setFormData({ ...formData, billType: e.target.value })}
                placeholder="e.g., OPD"
              />
              <Input
                label="Description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Billing description"
              />
            </div>

            <Card title="Bill Number Series" subtitle="Numbering rules for bill generation">
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Prefix"
                  value={formData.billSeries?.prefix || ''}
                  onChange={(e) => setFormData({ ...formData, billSeries: { ...formData.billSeries, prefix: e.target.value } })}
                  placeholder="e.g., OPD"
                />
                <Input
                  label="Suffix"
                  value={formData.billSeries?.suffix || ''}
                  onChange={(e) => setFormData({ ...formData, billSeries: { ...formData.billSeries, suffix: e.target.value } })}
                  placeholder="e.g., A"
                />
                <Input
                  label="Start Counter"
                  type="number"
                  value={formData.billSeries?.startCounter ?? 1}
                  onChange={(e) => setFormData({ ...formData, billSeries: { ...formData.billSeries, startCounter: Number(e.target.value) } })}
                  placeholder="1000"
                />
                <Input
                  label="Format"
                  value={formData.billSeries?.format || ''}
                  onChange={(e) => setFormData({ ...formData, billSeries: { ...formData.billSeries, format: e.target.value } })}
                  placeholder="e.g., OPD-{yyyy}-{count:05}"
                />
              </div>
            </Card>

            <Card title="Receipt Numbering" subtitle="Receipt rules are configured separately">
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Prefix"
                  value={formData.receiptSeries?.prefix || ''}
                  onChange={(e) => setFormData({ ...formData, receiptSeries: { ...formData.receiptSeries, prefix: e.target.value } })}
                  placeholder="e.g., R-OPD"
                />
                <Input
                  label="Suffix"
                  value={formData.receiptSeries?.suffix || ''}
                  onChange={(e) => setFormData({ ...formData, receiptSeries: { ...formData.receiptSeries, suffix: e.target.value } })}
                  placeholder="e.g., -A"
                />
                <Input
                  label="Start Counter"
                  type="number"
                  value={formData.receiptSeries?.startCounter ?? 1}
                  onChange={(e) => setFormData({ ...formData, receiptSeries: { ...formData.receiptSeries, startCounter: Number(e.target.value) } })}
                  placeholder="1"
                />
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-700">Counter Type</label>
                  <select
                    value={formData.receiptSeries?.counterType || 'Daily'}
                    onChange={(e) => setFormData({ ...formData, receiptSeries: { ...formData.receiptSeries, counterType: e.target.value as ReceiptConfig['counterType'] } })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>
                <Input
                  label="Format"
                  value={formData.receiptSeries?.format || ''}
                  onChange={(e) => setFormData({ ...formData, receiptSeries: { ...formData.receiptSeries, format: e.target.value } })}
                  placeholder="e.g., RCPT-{ddMMyy}-{count:04}"
                />
              </div>
            </Card>

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
