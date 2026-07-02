import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Lock, Users } from 'lucide-react';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'operator' | 'viewer';
  userGroup: string;
  rateCard: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

interface UserGroup {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  status: 'active' | 'inactive';
}

interface RateCard {
  id: string;
  name: string;
  discountPercentage: number;
  applicable: string;
  createdDate: string;
  status: 'active' | 'inactive';
}

const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin@pathocare',
    name: 'System Administrator',
    email: 'admin@pathocare.com',
    phone: '+91-9876543210',
    role: 'admin',
    userGroup: 'Admins',
    rateCard: 'Standard',
    status: 'active',
    lastLogin: '2024-07-02 14:30',
  },
  {
    id: '2',
    username: 'manager1@pathocare',
    name: 'Rajesh Kumar',
    email: 'rajesh@pathocare.com',
    phone: '+91-9876543211',
    role: 'manager',
    userGroup: 'Centre Managers',
    rateCard: 'Standard',
    status: 'active',
    lastLogin: '2024-07-02 10:15',
  },
];

const mockUserGroups: UserGroup[] = [
  {
    id: '1',
    name: 'Admins',
    description: 'Full system access',
    permissions: ['Manage Users', 'Manage Masters', 'View Reports', 'Manage Billing'],
    userCount: 2,
    status: 'active',
  },
  {
    id: '2',
    name: 'Centre Managers',
    description: 'Manage centre operations',
    permissions: ['View Bookings', 'Manage Samples', 'View Reports'],
    userCount: 3,
    status: 'active',
  },
  {
    id: '3',
    name: 'Operators',
    description: 'Basic access for data entry',
    permissions: ['Create Booking', 'View Results'],
    userCount: 8,
    status: 'active',
  },
];

const mockRateCards: RateCard[] = [
  { id: '1', name: 'Standard', discountPercentage: 0, applicable: 'Individual Patients', createdDate: '2024-01-01', status: 'active' },
  { id: '2', name: 'Corporate', discountPercentage: 15, applicable: 'Corporate Clients', createdDate: '2024-01-15', status: 'active' },
  { id: '3', name: 'Senior Citizen', discountPercentage: 20, applicable: 'Senior Citizens (60+)', createdDate: '2024-02-01', status: 'active' },
  { id: '4', name: 'Insurance', discountPercentage: 25, applicable: 'Insurance Companies', createdDate: '2024-02-15', status: 'active' },
];

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'groups' | 'rates'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const tabs = [
    { id: 'users', label: 'User Accounts', count: mockUsers.length },
    { id: 'groups', label: 'User Groups', count: mockUserGroups.length },
    { id: 'rates', label: 'Rate Cards', count: mockRateCards.length },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'operator':
        return 'bg-indigo-100 text-indigo-800';
      case 'viewer':
        return 'bg-slate-100 text-slate-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">User Management & Rates</h2>
          <p className="mt-2 text-sm text-slate-500">Configure user accounts, groups, access levels, and pricing rate cards.</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="gap-2">
          <Plus size={16} />
          Add New
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 bg-white">
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

      {/* Users Tab */}
      {activeTab === 'users' && (
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Search size={16} className="text-slate-400" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 placeholder:text-slate-400"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Username</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Role</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Email</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Group</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Last Login</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {mockUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{user.name}</td>
                    <td className="px-4 py-3 text-slate-600 font-mono text-xs">{user.username}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleColor(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{user.email}</td>
                    <td className="px-4 py-3 text-slate-600">{user.userGroup}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{user.lastLogin}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="secondary">
                          <Edit2 size={14} />
                        </Button>
                        <Button size="sm" variant="secondary">
                          <Lock size={14} />
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

      {/* User Groups Tab */}
      {activeTab === 'groups' && (
        <div className="grid gap-4 md:grid-cols-2">
          {mockUserGroups.map((group) => (
            <Card key={group.id} className="flex flex-col">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-indigo-50 p-2">
                    <Users size={18} className="text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{group.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{group.description}</p>
                  </div>
                </div>
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${group.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>
                  {group.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="mt-4 border-t border-slate-100 pt-3">
                <p className="mb-2 text-xs font-semibold text-slate-600">Permissions ({group.permissions.length})</p>
                <div className="flex flex-wrap gap-1">
                  {group.permissions.map((perm, idx) => (
                    <span key={idx} className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">
                      {perm}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
                <span className="text-slate-600">{group.userCount} users</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary">
                    Edit
                  </Button>
                  <Button size="sm" variant="secondary">
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Rate Cards Tab */}
      {activeTab === 'rates' && (
        <div className="space-y-3">
          {mockRateCards.map((rate) => (
            <Card key={rate.id} className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{rate.name}</h3>
                <p className="mt-1 text-sm text-slate-500">Applicable to: {rate.applicable}</p>
                <p className="mt-1 text-xs text-slate-400">Created: {rate.createdDate}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-indigo-600">{rate.discountPercentage}%</p>
                <p className="text-xs text-slate-500">Discount</p>
              </div>
              <div className="ml-6 flex gap-2">
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${rate.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>
                  {rate.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="ml-4 flex gap-2">
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
