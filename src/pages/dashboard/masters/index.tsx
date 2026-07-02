import { useNavigate } from 'react-router-dom';
import { Building2, Users, Stethoscope, FlaskConical, QrCode, ShieldCheck, MessageSquare, Settings2, FileText, DollarSign, Gift, Clock, MapPin, Package, Copy, Barcode, Briefcase, UserPlus, BarChart3, Lock, Phone } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

const masterSections = [
  { title: 'Owner Profile', description: 'Manage lab identity and administrative profile.', icon: Building2, accent: 'bg-emerald-50 text-emerald-700', path: '/dashboard/masters/owner-profile' },
  { title: 'Bill Type', description: 'Configure billing categories and payment types.', icon: DollarSign, accent: 'bg-emerald-50 text-emerald-700', path: '/dashboard/masters/bill-type' },
  { title: 'Compliment', description: 'Manage referral bonuses and compliments.', icon: Gift, accent: 'bg-rose-50 text-rose-700', path: '/dashboard/masters/compliment' },
  { title: 'Doctor Profile', description: 'Maintain referring doctors and their details.', icon: Stethoscope, accent: 'bg-sky-50 text-sky-700', path: '/dashboard/masters/doctor-master' },
  { title: 'Revise Doctor', description: 'Edit and update doctor information.', icon: Stethoscope, accent: 'bg-sky-50 text-sky-700', path: '/dashboard/masters/revise-doctor' },
  { title: 'Apply Rate List', description: 'Assign rate lists to doctors and customers.', icon: BarChart3, accent: 'bg-purple-50 text-purple-700', path: '/dashboard/masters/apply-rate-list' },
  { title: 'Assign Compliment', description: 'Allocate compliments to doctors.', icon: Gift, accent: 'bg-rose-50 text-rose-700', path: '/dashboard/masters/assign-compliment' },
  { title: 'Test Master', description: 'Create and manage laboratory tests.', icon: FlaskConical, accent: 'bg-violet-50 text-violet-700', path: '/dashboard/masters/tests' },
  { title: 'Test Group', description: 'Organize tests into groups and categories.', icon: Package, accent: 'bg-violet-50 text-violet-700', path: '/dashboard/masters/sample-types' },
  { title: 'Revise Test', description: 'Edit and update test configurations.', icon: FlaskConical, accent: 'bg-violet-50 text-violet-700', path: '/dashboard/masters/revise-test' },
  { title: 'Test Profile', description: 'Manage test profiles and standards.', icon: FileText, accent: 'bg-violet-50 text-violet-700', path: '/dashboard/masters/sample-types' },
  { title: 'Special Notes', description: 'Add general notes and instructions.', icon: FileText, accent: 'bg-amber-50 text-amber-700', path: '/dashboard/masters/special-notes' },
  { title: 'Centre', description: 'Manage laboratory branches and centers.', icon: Building2, accent: 'bg-amber-50 text-amber-700', path: '/dashboard/masters/centre-setup' },
  { title: 'Centre Setup', description: 'Configure collection centre details.', icon: Building2, accent: 'bg-amber-50 text-amber-700', path: '/dashboard/masters/centre-setup' },
  { title: 'Sample List', description: 'Manage sample types and requirements.', icon: Copy, accent: 'bg-cyan-50 text-cyan-700', path: '/dashboard/masters/sample-list' },
  { title: 'Master List', description: 'General master data reference.', icon: FileText, accent: 'bg-slate-50 text-slate-700', path: '/dashboard/masters/master-list' },
  { title: 'Dept', description: 'Manage departments and divisions.', icon: MapPin, accent: 'bg-orange-50 text-orange-700', path: '/dashboard/masters/dept' },
  { title: 'Outsource Lab', description: 'Configure outsourced lab partners.', icon: Briefcase, accent: 'bg-blue-50 text-blue-700', path: '/dashboard/masters/outsource-lab' },
  { title: 'Barcode Master', description: 'Generate and manage barcode templates.', icon: QrCode, accent: 'bg-rose-50 text-rose-700', path: '/dashboard/masters/barcode-master' },
  { title: 'Employee Master', description: 'Manage staff and employment records.', icon: Users, accent: 'bg-blue-50 text-blue-700', path: '/dashboard/masters/employee-master' },
  { title: 'Create User', description: 'Add new system users and accounts.', icon: UserPlus, accent: 'bg-cyan-50 text-cyan-700', path: '/dashboard/masters/user-management' },
  { title: 'User Rate List', description: 'Configure user rate cards and pricing.', icon: BarChart3, accent: 'bg-purple-50 text-purple-700', path: '/dashboard/masters/user-rate-list' },
  { title: 'User Group', description: 'Organize users into groups and roles.', icon: Users, accent: 'bg-blue-50 text-blue-700', path: '/dashboard/masters/user-management' },
  { title: 'SMS Setup', description: 'Configure communication and reminders.', icon: MessageSquare, accent: 'bg-pink-50 text-pink-700', path: '/dashboard/masters/sms-setup' },
];

export default function MastersIndexPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Master Configuration</h2>
        <p className="mt-2 text-sm text-slate-500">Central setup and reference data for the laboratory workflow.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {masterSections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} onClick={() => navigate(section.path)} className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5">
              <Card className="h-full p-4">
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className={`rounded-lg p-3 ${section.accent}`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xs font-semibold text-slate-800 leading-tight">{section.title}</h3>
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">{section.description}</p>
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>

      <Card title="Master Data Configuration Hub" subtitle="Complete setup workflow for all 24 master categories">
        <div className="space-y-4 text-sm text-slate-600">
          <p>Configure all laboratory masters and reference data. These records are essential for patient registration, bookings, results, billing, and reporting workflows.</p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="text-xs font-semibold text-blue-900">Core Setup (6)</p>
              <ul className="mt-2 space-y-1 text-xs text-blue-800">
                <li>• Owner Profile</li>
                <li>• Doctor Profile</li>
                <li>• Test Master</li>
                <li>• Centre Setup</li>
                <li>• Employee Master</li>
                <li>• User Management</li>
              </ul>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p className="text-xs font-semibold text-amber-900">Operations (10)</p>
              <ul className="mt-2 space-y-1 text-xs text-amber-800">
                <li>• Revise Doctor / Test</li>
                <li>• Apply Rate List</li>
                <li>• Assign Compliment</li>
                <li>• Bill Type</li>
                <li>• Compliment</li>
                <li>• Test Group & Profile</li>
                <li>• Special Notes</li>
                <li>• Sample List</li>
                <li>• Department Setup</li>
                <li>• Outsource Lab</li>
              </ul>
            </div>
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <p className="text-xs font-semibold text-green-900">Best Practices</p>
              <ul className="mt-2 space-y-1 text-xs text-green-800">
                <li>✓ Complete all 24 masters</li>
                <li>✓ Use consistent naming</li>
                <li>✓ Validate data quality</li>
                <li>✓ Test before go-live</li>
                <li>✓ Archive inactive items</li>
                <li>✓ Maintain audit trail</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
