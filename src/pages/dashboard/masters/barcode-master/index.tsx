import { useState } from 'react';
import { Plus, Edit2, Trash2, Barcode, Printer, Eye } from 'lucide-react';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';

interface BarcodeTemplate {
  id: string;
  name: string;
  format: 'CODE128' | 'QR_CODE' | 'EAN13' | 'CODE39';
  width: number;
  height: number;
  includeData: string[];
  status: 'active' | 'inactive';
  createdDate: string;
}

interface BarcodeSequence {
  id: string;
  prefix: string;
  currentSequence: number;
  lastGenerated: string;
  template: string;
}

const mockTemplates: BarcodeTemplate[] = [
  {
    id: '1',
    name: 'Standard Sample Barcode',
    format: 'CODE128',
    width: 80,
    height: 30,
    includeData: ['Sample ID', 'Test Code', 'Date'],
    status: 'active',
    createdDate: '2024-01-15',
  },
  {
    id: '2',
    name: 'QR Code - Full Details',
    format: 'QR_CODE',
    width: 50,
    height: 50,
    includeData: ['Sample ID', 'Patient ID', 'Test Code', 'Collection Date', 'Centre Code'],
    status: 'active',
    createdDate: '2024-02-20',
  },
];

const mockSequences: BarcodeSequence[] = [
  { id: '1', prefix: 'HQ', currentSequence: 10245, lastGenerated: '2024-07-02 14:30', template: 'Standard Sample Barcode' },
  { id: '2', prefix: 'ANH', currentSequence: 5892, lastGenerated: '2024-07-02 10:15', template: 'Standard Sample Barcode' },
];

export default function BarcodeMatrixPage() {
  const [activeTab, setActiveTab] = useState<'templates' | 'sequences'>('templates');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Barcode Master</h2>
          <p className="mt-2 text-sm text-slate-500">Configure barcode formats and manage sample labeling sequences.</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="gap-2">
          <Plus size={16} />
          New Template
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 bg-white">
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === 'templates'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Barcode Templates ({mockTemplates.length})
        </button>
        <button
          onClick={() => setActiveTab('sequences')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === 'sequences'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Barcode Sequences ({mockSequences.length})
        </button>
      </div>

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          {mockTemplates.map((template) => (
            <Card key={template.id} className="flex flex-col">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-indigo-50 p-3">
                    <Barcode className="text-indigo-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{template.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Format: <span className="font-mono text-xs text-slate-600">{template.format}</span>
                    </p>
                    <p className="mt-1 text-xs text-slate-400">Created: {template.createdDate}</p>
                  </div>
                </div>
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    template.status === 'active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  {template.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="mt-4 grid gap-2 border-t border-slate-100 pt-4 text-sm md:grid-cols-3">
                <div>
                  <p className="text-xs text-slate-500">Size</p>
                  <p className="mt-1 font-mono text-sm text-slate-700">
                    {template.width}mm × {template.height}mm
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Data Fields</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {template.includeData.map((field, idx) => (
                      <span key={idx} className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Button size="sm" variant="secondary" className="gap-2">
                    <Printer size={14} />
                    Preview
                  </Button>
                  <Button size="sm" variant="secondary">
                    Edit
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Sequences Tab */}
      {activeTab === 'sequences' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Prefix</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Template</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Current Sequence</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Last Generated</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {mockSequences.map((seq) => (
                  <tr key={seq.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-indigo-100 px-3 py-1 font-mono text-sm font-semibold text-indigo-700">
                        {seq.prefix}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{seq.template}</td>
                    <td className="px-4 py-3">
                      <span className="font-mono font-semibold text-slate-900">{seq.currentSequence}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{seq.lastGenerated}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="secondary">
                          Edit
                        </Button>
                        <Button size="sm" variant="secondary">
                          Reset
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
