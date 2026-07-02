import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FlaskConical, FileText, CreditCard, Settings, ClipboardList, BarChart3, Database } from 'lucide-react';

const navItems = [
  { label: 'Owner Summary', icon: <LayoutDashboard size={18} />, path: '/dashboard' },
  { label: 'Patients', icon: <Users size={18} />, path: '/dashboard/patients' },
  { label: 'Booking', icon: <FlaskConical size={18} />, path: '/bookings' },
  { label: 'Results', icon: <ClipboardList size={18} />, path: '/dashboard/results' },
  { label: 'Masters', icon: <Database size={18} />, path: '/dashboard/masters' },
  { label: 'Billing', icon: <CreditCard size={18} />, path: '/dashboard/billing/receipts' },
  { label: 'MIS', icon: <BarChart3 size={18} />, path: '/dashboard/mis/day-collection' },
  { label: 'Settings', icon: <Settings size={18} />, path: '/dashboard/settings/lab-profile' },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white p-4 lg:block">
      <div className="mb-6 px-2">
        <h2 className="text-lg font-semibold text-slate-900">PathoCare Pro</h2>
        <p className="text-sm text-slate-500">Frontend shell</p>
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
