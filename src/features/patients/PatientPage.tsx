import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserPlus, Search, Filter, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { AddPatientForm } from './AddPatientForm';
import { RootState, AppDispatch } from '../../app/store';
import { Patient } from './patientSlice';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';

export default function PatientPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { patients, loading } = useSelector((state: RootState) => state.patients);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.regNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: any[] = [
    {
      header: 'Patient Details',
      accessor: (p: Patient) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">{p.name}</span>
          <span className="text-xs text-slate-500 uppercase tracking-wide font-mono">{p.regNo}</span>
        </div>
      ),
    },
    {
      header: 'Age / Gender',
      accessor: (p: Patient) => (
        <div className="flex items-center gap-2">
          <span>{p.age} Yrs</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
            p.gender === 'Male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
          }`}>
            {p.gender.charAt(0)}
          </span>
        </div>
      ),
    },
    {
      header: 'Mobile',
      accessor: 'mobile',
    },
    {
      header: 'Doctor',
      accessor: 'doctor',
    },
    {
      header: 'Date Registered',
      accessor: (p: Patient) => (
        <span className="text-xs text-slate-500">
          {new Date(p.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: () => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Edit2 size={14} className="text-slate-400 group-hover:text-brand-600" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Trash2 size={14} className="text-red-400" />
          </Button>
        </div>
      ),
      className: 'text-right',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Patient Directory</h2>
          <p className="text-slate-500 mt-1">Manage and track your laboratory patients.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
          <UserPlus size={18} />
          Register Patient
        </Button>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by ID or name..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter size={18} />
            Filter
          </Button>
        </div>

        <Table columns={columns} data={filteredPatients} isLoading={loading} />
      </Card>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Patient Registration"
        size="lg"
      >
        <AddPatientForm onSuccess={() => setIsAddModalOpen(false)} />
      </Modal>
    </div>
  );
}
