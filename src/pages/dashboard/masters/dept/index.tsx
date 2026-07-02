import { useState } from 'react';
import { Edit2, Search } from 'lucide-react';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';

interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  inCharge: string;
  status: 'active' | 'inactive';
}

const mockDepts: Department[] = [
  { id: '1', name: 'Hematology', code: 'HEMA', description: 'Blood and related tests', inCharge: 'Dr. Sharma', status: 'active' },
  { id: '2', name: 'Biochemistry', code: 'BIOC', description: 'Chemical analysis of blood', inCharge: 'Dr. Patel', status: 'active' },
  { id: '3', name: 'Microbiology', code: 'MICR', description: 'Bacterial and viral testing', inCharge: 'Dr. Singh', status: 'active' },
  { id: '4', name: 'Immunology', code: 'IMMU', description: 'Immune system testing', inCharge: 'Dr. Verma', status: 'active' },
];

export default function DeptPage() {
  const [depts, setDepts] = useState<Department[]>(mockDepts);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDepts = depts.filter((d) => d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.code.includes(searchTerm.toUpperCase()));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Department Master</h2>
        <p className="mt-2 text-sm text-slate-500">Manage laboratory departments and specialized sections.</p>
      </div>

      <Card>
        <div className="flex items-center gap-2">
          <Search size={16} className="text-slate-400" />
          <Input placeholder="Search departments..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border-0" />
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredDepts.map((dept) => (
          <Card key={dept.id} className="flex flex-col">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">{dept.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{dept.description}</p>
              </div>
              <span className="rounded bg-slate-100 px-2 py-1 font-mono text-xs font-semibold text-slate-700">{dept.code}</span>
            </div>
            <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">In-Charge</span>
                <span className="font-medium text-slate-900">{dept.inCharge}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Status</span>
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${dept.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>
                  {dept.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="secondary">
                <Edit2 size={14} />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
