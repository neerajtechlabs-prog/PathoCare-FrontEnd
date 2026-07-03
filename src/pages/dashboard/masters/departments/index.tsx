import { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';

interface Department {
  id: string;
  code: string;
  name: string;
  mainHead: string;
  billSeries: string;
  counterType: 'Daily' | 'Monthly' | 'Yearly';
  counterStart: number;
  prefix: string;
  suffix: string;
  customFormat: string;
  helpKey: string;
  preview: string;
  priority: 'Service' | 'OPD';
  header: string;
  footer: string;
  isActive: boolean;
}

type DepartmentForm = Omit<Department, 'id'>;

const mockDepartments: Department[] = [
  {
    id: '1',
    code: 'PATH',
    name: 'Pathology',
    mainHead: 'Pathology',
    billSeries: 'Bill',
    counterType: 'Daily',
    counterStart: 1,
    prefix: 'P',
    suffix: '',
    customFormat: 'dd/mmm/yyyy',
    helpKey: 'F1',
    preview: 'Header',
    priority: 'OPD',
    header: 'Pathology Header',
    footer: 'Pathology Footer',
    isActive: true,
  },
  {
    id: '2',
    code: 'US',
    name: 'Ultra Sound',
    mainHead: 'Radiology',
    billSeries: 'Bill',
    counterType: 'Daily',
    counterStart: 1,
    prefix: 'US',
    suffix: '',
    customFormat: 'dd/mmm/yyyy',
    helpKey: 'F2',
    preview: 'Header',
    priority: 'OPD',
    header: 'US Header',
    footer: 'US Footer',
    isActive: true,
  },
  {
    id: '3',
    code: 'X-RAY',
    name: 'X-Ray',
    mainHead: 'Radiology',
    billSeries: 'Bill',
    counterType: 'Daily',
    counterStart: 1,
    prefix: 'XR',
    suffix: '',
    customFormat: 'dd/mmm/yyyy',
    helpKey: 'F3',
    preview: 'Header',
    priority: 'OPD',
    header: 'X-Ray Header',
    footer: 'X-Ray Footer',
    isActive: true,
  },
];

export default function DepartmentsMasterPage() {
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const initialFormData: DepartmentForm = {
    code: '',
    name: '',
    mainHead: '',
    billSeries: 'Bill',
    counterType: 'Daily',
    counterStart: 1,
    prefix: '',
    suffix: '',
    customFormat: 'dd/mmm/yyyy',
    helpKey: '',
    preview: '',
    priority: 'OPD',
    header: '',
    footer: '',
    isActive: true,
  };
  const [formData, setFormData] = useState<DepartmentForm>(initialFormData);

  const filteredDepartments = departments.filter(
    (dept) =>
      dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.mainHead.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      code: '',
      name: '',
      mainHead: '',
      billSeries: 'Bill',
      counterType: 'Daily',
      counterStart: 1,
      prefix: '',
      suffix: '',
      customFormat: 'dd/mmm/yyyy',
      helpKey: '',
      preview: '',
      priority: 'OPD',
      header: '',
      footer: '',
      isActive: true,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    const normalized = {
      ...formData,
      billSeries: formData.billSeries || 'Bill',
      counterType: formData.counterType || 'Daily',
      counterStart: formData.counterStart ?? 1,
      customFormat: formData.customFormat || 'dd/mmm/yyyy',
      priority: formData.priority || 'OPD',
      isActive: formData.isActive ?? true,
    } as DepartmentForm;

    if (editingId) {
      setDepartments((prev) => prev.map((dept) => (dept.id === editingId ? { ...dept, ...normalized } : dept)));
    } else {
      setDepartments((prev) => [...prev, { id: Date.now().toString(), ...normalized }]);
    }
    setShowModal(false);
  };

  const handleEdit = (dept: Department) => {
    setEditingId(dept.id);
    setFormData(dept);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this department?')) {
      setDepartments((prev) => prev.filter((dept) => dept.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Department Master</h2>
          <p className="mt-2 text-sm text-slate-500">Configure department billing counters, report headers, and shortcut keys.</p>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus size={16} />
          Add Department
        </Button>
      </div>

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-slate-500">
            <Search size={16} />
            <span className="text-sm">Search</span>
          </div>
          <Input
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-0"
          />
        </div>
      </Card>

      <Card title={`Departments (${filteredDepartments.length})`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Code</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Department</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Main Head</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Counter</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Help Key</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Priority</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredDepartments.map((dept) => (
                <tr key={dept.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{dept.code}</td>
                  <td className="px-4 py-3 text-slate-600">{dept.name}</td>
                  <td className="px-4 py-3 text-slate-600">{dept.mainHead}</td>
                  <td className="px-4 py-3 text-slate-600">{dept.counterType}</td>
                  <td className="px-4 py-3 text-slate-600">{dept.helpKey}</td>
                  <td className="px-4 py-3 text-slate-600">{dept.priority}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="secondary" onClick={() => handleEdit(dept)}>
                        <Edit2 size={14} />
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => handleDelete(dept.id)}>
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
                <h3 className="text-lg font-semibold text-slate-900">{editingId ? 'Edit Department' : 'New Department'}</h3>
                <p className="text-sm text-slate-500">Set up department billing, report headers, and shortcut mapping.</p>
              </div>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Input
                label="Code"
                value={formData.code || ''}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Department code"
              />
              <Input
                label="Department"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Department name"
              />
              <Input
                label="Main Head"
                value={formData.mainHead || ''}
                onChange={(e) => setFormData({ ...formData, mainHead: e.target.value })}
                placeholder="Main department"
              />
              <Input
                label="Bill Series"
                value={formData.billSeries || ''}
                onChange={(e) => setFormData({ ...formData, billSeries: e.target.value })}
                placeholder="Bill"
              />
              <Input
                label="Prefix"
                value={formData.prefix || ''}
                onChange={(e) => setFormData({ ...formData, prefix: e.target.value })}
                placeholder="P"
              />
              <Input
                label="Suffix"
                value={formData.suffix || ''}
                onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
                placeholder=""
              />
              <Input
                label="Counter Start"
                type="number"
                value={formData.counterStart ?? 1}
                onChange={(e) => setFormData({ ...formData, counterStart: Number(e.target.value) })}
                placeholder="1"
              />
              <Input
                label="Custom Format"
                value={formData.customFormat || ''}
                onChange={(e) => setFormData({ ...formData, customFormat: e.target.value })}
                placeholder="dd/mmm/yyyy"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Counter Type</label>
                <select
                  value={formData.counterType || 'Daily'}
                  onChange={(e) => setFormData({ ...formData, counterType: e.target.value as Department['counterType'] })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="Daily">Daily</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>
              <Input
                label="Help Key"
                value={formData.helpKey || ''}
                onChange={(e) => setFormData({ ...formData, helpKey: e.target.value })}
                placeholder="F1"
              />
              <Input
                label="Preview"
                value={formData.preview || ''}
                onChange={(e) => setFormData({ ...formData, preview: e.target.value })}
                placeholder="Header"
              />
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Priority</label>
                <select
                  value={formData.priority || 'OPD'}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as Department['priority'] })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="Service">Service</option>
                  <option value="OPD">OPD</option>
                </select>
              </div>
              <Input
                label="Header"
                value={formData.header || ''}
                onChange={(e) => setFormData({ ...formData, header: e.target.value })}
                placeholder="Header text"
              />
              <Input
                label="Footer"
                value={formData.footer || ''}
                onChange={(e) => setFormData({ ...formData, footer: e.target.value })}
                placeholder="Footer text"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                id="department-active"
                type="checkbox"
                checked={formData.isActive ?? true}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="department-active" className="text-sm text-slate-700">Is Active</label>
            </div>

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
