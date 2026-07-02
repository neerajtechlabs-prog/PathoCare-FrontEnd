import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Zap } from 'lucide-react';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';

interface TestItem {
  id: string;
  name: string;
  code: string;
  category: string;
  sampleType: string;
  turnaroundTime: number;
  price: number;
  status: 'active' | 'inactive';
}

interface TestGroup {
  id: string;
  name: string;
  description: string;
  testCount: number;
  status: 'active' | 'inactive';
}

interface TestProfile {
  id: string;
  name: string;
  tests: string[];
  packagePrice: number;
  discount: number;
  status: 'active' | 'inactive';
}

const mockTestGroups: TestGroup[] = [
  { id: '1', name: 'Routine Hematology', description: 'Complete blood count and related tests', testCount: 8, status: 'active' },
  { id: '2', name: 'Biochemistry Panel', description: 'Liver and kidney function tests', testCount: 12, status: 'active' },
  { id: '3', name: 'Serology', description: 'Infectious disease screening', testCount: 6, status: 'active' },
];

const mockTestProfiles: TestProfile[] = [
  { id: '1', name: 'Health Checkup Basic', tests: ['CBC', 'Blood Sugar', 'Lipid Profile'], packagePrice: 1500, discount: 10, status: 'active' },
  { id: '2', name: 'Executive Panel', tests: ['CBC', 'Biochemistry Panel', 'Lipid Profile', 'Thyroid'], packagePrice: 4500, discount: 15, status: 'active' },
  { id: '3', name: 'Pre-op Package', tests: ['CBC', 'Blood Group', 'Coagulation Profile'], packagePrice: 2000, discount: 5, status: 'active' },
];

const mockTests: TestItem[] = [
  { id: '1', name: 'Complete Blood Count', code: 'CBC', category: 'Hematology', sampleType: 'Blood', turnaroundTime: 2, price: 250, status: 'active' },
  { id: '2', name: 'Blood Sugar', code: 'BS', category: 'Biochemistry', sampleType: 'Blood', turnaroundTime: 2, price: 150, status: 'active' },
  { id: '3', name: 'Lipid Profile', code: 'LP', category: 'Biochemistry', sampleType: 'Blood', turnaroundTime: 4, price: 500, status: 'active' },
  { id: '4', name: 'Thyroid Profile', code: 'TP', category: 'Endocrinology', sampleType: 'Blood', turnaroundTime: 24, price: 800, status: 'active' },
];

export default function TestsMasterPage() {
  const [activeTab, setActiveTab] = useState<'tests' | 'groups' | 'profiles'>('tests');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const tabs = [
    { id: 'tests', label: 'Tests', count: mockTests.length },
    { id: 'groups', label: 'Test Groups', count: mockTestGroups.length },
    { id: 'profiles', label: 'Test Profiles', count: mockTestProfiles.length },
  ];

  const filteredTests = mockTests.filter(
    (test) =>
      test.name.toLowerCase().includes(searchTerm.toLowerCase()) || test.code.includes(searchTerm.toUpperCase())
  );

  const filteredGroups = mockTestGroups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProfiles = mockTestProfiles.filter((profile) =>
    profile.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Test Master</h2>
          <p className="mt-2 text-sm text-slate-500">Configure tests, groups, and package profiles for booking.</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="gap-2">
          <Plus size={16} />
          Add Item
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 bg-white p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
              activeTab === tab.id
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
            <span className="ml-2 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <Card>
        <div className="mb-4 flex items-center gap-2">
          <Search size={16} className="text-slate-400" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-0 placeholder:text-slate-400"
          />
        </div>
      </Card>

      {/* Tests Tab */}
      {activeTab === 'tests' && (
        <Card title="Individual Tests">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Code</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Category</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Sample</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">TAT (hrs)</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Price</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredTests.map((test) => (
                  <tr key={test.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{test.name}</td>
                    <td className="px-4 py-3 text-slate-600">
                      <span className="inline-flex rounded bg-slate-100 px-2 py-1 text-xs font-mono text-slate-700">
                        {test.code}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{test.category}</td>
                    <td className="px-4 py-3 text-slate-600">{test.sampleType}</td>
                    <td className="px-4 py-3 text-slate-600">{test.turnaroundTime}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">₹{test.price}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="text-blue-600 hover:text-blue-700">
                          <Edit2 size={16} />
                        </button>
                        <button className="text-red-600 hover:text-red-700">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Test Groups Tab */}
      {activeTab === 'groups' && (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredGroups.map((group) => (
            <Card key={group.id} className="flex flex-col">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{group.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{group.description}</p>
                  <p className="mt-2 text-xs text-slate-400">{group.testCount} tests included</p>
                </div>
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    group.status === 'active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  {group.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
                <Button size="sm" variant="secondary">
                  Edit
                </Button>
                <Button size="sm" variant="secondary">
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Test Profiles Tab */}
      {activeTab === 'profiles' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProfiles.map((profile) => (
            <Card key={profile.id} className="flex flex-col">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">{profile.name}</h3>
                  <p className="mt-1 text-xs text-slate-500">{profile.tests.length} tests</p>
                </div>
                <Zap className="text-amber-500" size={16} />
              </div>
              <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Package Price:</span>
                  <span className="font-semibold text-slate-900">₹{profile.packagePrice}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Discount:</span>
                  <span className="text-sm font-medium text-emerald-600">{profile.discount}%</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="secondary">
                  Edit
                </Button>
                <Button size="sm" variant="secondary">
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
