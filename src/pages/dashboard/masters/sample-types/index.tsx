import { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';

interface TestGroup {
  id: string;
  groupNumber: string;
  name: string;
  department: string;
  groupType: string;
  sampleRequired: boolean;
  resultType: string;
  isActive: boolean;
  tests: Array<{ code: string; name: string; rate: number }>;
}

const mockGroups: TestGroup[] = [
  {
    id: '1',
    groupNumber: '1',
    name: 'HAEMATOLOGY',
    department: 'PATH',
    groupType: 'Panel',
    sampleRequired: true,
    resultType: 'Numeric',
    isActive: true,
    tests: [
      { code: 'HB', name: 'Hemoglobin', rate: 180 },
      { code: 'TC', name: 'Total Count', rate: 120 },
    ],
  },
  {
    id: '2',
    groupNumber: '2',
    name: 'BIOCHEMISTRY',
    department: 'PATH',
    groupType: 'Panel',
    sampleRequired: true,
    resultType: 'Numeric',
    isActive: true,
    tests: [
      { code: 'GLU', name: 'Glucose', rate: 90 },
      { code: 'Urea', name: 'Urea', rate: 70 },
    ],
  },
];

export default function SampleTypesMasterPage() {
  const [groups, setGroups] = useState<TestGroup[]>(mockGroups);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<string>(mockGroups[0].id);

  const selectedGroup = groups.find((group) => group.id === selectedGroupId) ?? mockGroups[0];

  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Test Group Master</h2>
        <p className="mt-2 text-sm text-slate-500">Organize laboratory tests into groups, departments, and display settings.</p>
      </div>

      <Card>
        <div className="flex items-center gap-2">
          <Search size={16} className="text-slate-400" />
          <Input placeholder="Search groups..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border-0" />
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card title={`Groups (${filteredGroups.length})`}>
          <div className="space-y-2">
            {filteredGroups.map((group) => (
              <button
                key={group.id}
                onClick={() => setSelectedGroupId(group.id)}
                className={`w-full rounded-lg border px-3 py-2 text-left transition ${
                  group.id === selectedGroupId ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
                  <span>{group.name}</span>
                  <span>{group.groupNumber}</span>
                </div>
                <p className="mt-1 text-xs text-slate-600">{group.department} · {group.groupType}</p>
              </button>
            ))}
          </div>
        </Card>

        <Card title={`Selected Group: ${selectedGroup.name}`}>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Group Number" value={selectedGroup.groupNumber} readOnly />
            <Input label="Department" value={selectedGroup.department} readOnly />
            <Input label="Group Type" value={selectedGroup.groupType} readOnly />
            <Input label="Result Type" value={selectedGroup.resultType} readOnly />
            <div className="flex items-center gap-3">
              <input
                id="sample-required"
                type="checkbox"
                checked={selectedGroup.sampleRequired}
                readOnly
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="sample-required" className="text-sm text-slate-700">Sample Required</label>
            </div>
            <div className="flex items-center gap-3">
              <input
                id="group-active"
                type="checkbox"
                checked={selectedGroup.isActive}
                readOnly
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="group-active" className="text-sm text-slate-700">Active Group</label>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Code</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Test</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {selectedGroup.tests.map((test) => (
                  <tr key={test.code} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-900">{test.code}</td>
                    <td className="px-4 py-3 text-slate-600">{test.name}</td>
                    <td className="px-4 py-3 text-slate-600">₹{test.rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button size="sm" className="gap-2">
              <Plus size={14} /> Insert Row
            </Button>
            <Button size="sm" variant="secondary" className="gap-2">
              <Trash2 size={14} /> Delete Row
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
