import { useState } from 'react';
import { Plus, Edit2, Trash2, Search, User } from 'lucide-react';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';

interface Employee {
  id: string;
  name: string;
  employeeId: string;
  designation: string;
  department: string;
  phone: string;
  email: string;
  dateOfJoining: string;
  dateOfBirth: string;
  qualification: string;
  status: 'active' | 'inactive' | 'on-leave';
}

const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Ramesh Kumar Singh',
    employeeId: 'EMP-001',
    designation: 'Senior Technician',
    department: 'Sample Collection',
    phone: '+91-9876543210',
    email: 'ramesh@pathocare.com',
    dateOfJoining: '2020-05-15',
    dateOfBirth: '1985-03-22',
    qualification: 'B.Sc. Medical Technology',
    status: 'active',
  },
  {
    id: '2',
    name: 'Priya Sharma',
    employeeId: 'EMP-002',
    designation: 'Lab Analyst',
    department: 'Testing',
    phone: '+91-9876543211',
    email: 'priya@pathocare.com',
    dateOfJoining: '2021-08-20',
    dateOfBirth: '1992-07-14',
    qualification: 'B.Sc. Biochemistry',
    status: 'active',
  },
  {
    id: '3',
    name: 'Ajay Verma',
    employeeId: 'EMP-003',
    designation: 'Phlebotomist',
    department: 'Sample Collection',
    phone: '+91-9876543212',
    email: 'ajay@pathocare.com',
    dateOfJoining: '2022-01-10',
    dateOfBirth: '1998-11-05',
    qualification: 'Diploma in Phlebotomy',
    status: 'active',
  },
  {
    id: '4',
    name: 'Meera Patel',
    employeeId: 'EMP-004',
    designation: 'Reception Staff',
    department: 'Administration',
    phone: '+91-9876543213',
    email: 'meera@pathocare.com',
    dateOfJoining: '2023-02-15',
    dateOfBirth: '1995-09-28',
    qualification: 'H.S.C.',
    status: 'on-leave',
  },
];

const departments = ['Sample Collection', 'Testing', 'Administration', 'Accounts', 'IT'];
const designations = ['Senior Technician', 'Lab Analyst', 'Phlebotomist', 'Reception Staff', 'Manager'];

export default function EmployeeMasterPage() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Employee>>({});

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.includes(searchTerm) ||
      emp.phone.includes(searchTerm)
  );

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({});
    setShowModal(true);
  };

  const handleEdit = (employee: Employee) => {
    setEditingId(employee.id);
    setFormData(employee);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure?')) {
      setEmployees((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800';
      case 'inactive':
        return 'bg-slate-100 text-slate-800';
      case 'on-leave':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Employee Master</h2>
          <p className="mt-2 text-sm text-slate-500">Manage laboratory staff, qualifications, and employment records.</p>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus size={16} />
          Add Employee
        </Button>
      </div>

      <Card>
        <div className="flex items-center gap-2">
          <Search size={16} className="text-slate-400" />
          <Input
            placeholder="Search by name, ID, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-0 placeholder:text-slate-400"
          />
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredEmployees.map((employee) => (
          <Card key={employee.id} className="flex flex-col">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-slate-100 p-3">
                  <User size={20} className="text-slate-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{employee.name}</h3>
                  <p className="mt-1 text-sm text-slate-600">{employee.designation}</p>
                  <p className="mt-1 text-xs text-slate-500">{employee.employeeId}</p>
                </div>
              </div>
              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(employee.status)}`}>
                {employee.status === 'active' ? 'Active' : employee.status === 'on-leave' ? 'On Leave' : 'Inactive'}
              </span>
            </div>

            <div className="mt-4 grid gap-2 border-t border-slate-100 pt-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-slate-500">Department</p>
                  <p className="mt-1 text-sm font-medium text-slate-700">{employee.department}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Joined</p>
                  <p className="mt-1 text-sm font-medium text-slate-700">{employee.dateOfJoining}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-slate-500">Phone</p>
                  <p className="mt-1 text-sm text-slate-700">{employee.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="mt-1 text-sm text-slate-700 truncate">{employee.email}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500">Qualification</p>
                <p className="mt-1 text-sm text-slate-700">{employee.qualification}</p>
              </div>
            </div>

            <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
              <Button size="sm" variant="secondary" onClick={() => handleEdit(employee)}>
                Edit
              </Button>
              <Button size="sm" variant="secondary" onClick={() => handleDelete(employee.id)}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-slate-900">
              {editingId ? 'Edit Employee' : 'Add New Employee'}
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Full Name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full name"
              />
              <Input
                label="Employee ID"
                value={formData.employeeId || ''}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                placeholder="EMP-001"
              />
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Designation</label>
                <select
                  value={formData.designation || ''}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select designation</option>
                  {designations.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Department</label>
                <select
                  value={formData.department || ''}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select department</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <Input
                label="Phone"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91-XXXXXXXXXX"
              />
              <Input
                label="Email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@pathocare.com"
              />
              <Input
                label="Date of Joining"
                type="date"
                value={formData.dateOfJoining || ''}
                onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })}
              />
              <Input
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth || ''}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              />
              <Input
                label="Qualification"
                value={formData.qualification || ''}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                placeholder="e.g., B.Sc. Medical Technology"
              />
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Status</label>
                <select
                  value={formData.status || 'active'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Employee['status'] })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="active">Active</option>
                  <option value="on-leave">On Leave</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button>Save Employee</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
