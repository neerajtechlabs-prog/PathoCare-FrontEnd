import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard,
  Users,
  FlaskConical,
  FileText,
  CreditCard,
  LogOut,
  Settings,
  ClipboardList,
  BarChart3,
  Activity,
  Database,
  Image,
  ToolCase,
  Trash2,
  Calculator,
  ShieldCheck,
} from 'lucide-react';
import { RootState } from '../app/store';
import { logoutUser } from '../features/auth/authSlice';
import { ROUTES, APP_NAME } from '../utils/constants';

const navGroups = [
  {
    title: 'Core',
    items: [
      { label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard' },
      { label: 'Patients', icon: <Users size={18} />, path: '/dashboard/patients' },
    ],
  },
  {
    title: 'Transaction',
    items: [
      { label: 'Booking', icon: <FlaskConical size={18} />, path: '/dashboard/booking' },
      { label: 'Results', icon: <ClipboardList size={18} />, path: '/dashboard/results/entry' },
      { label: 'Report Partly', icon: <FileText size={18} />, path: '/dashboard/report-partly' },
      { label: 'Workload', icon: <Activity size={18} />, path: '/dashboard/mis/day-collection' },
    ],
  },
  {
    title: 'Masters',
    items: [{ label: 'Masters', icon: <Database size={18} />, path: '/dashboard/masters' }],
  },
  {
    title: 'Radiology',
    items: [
      { label: 'Result Report', icon: <FileText size={18} />, path: '/dashboard/radiology/result-report' },
      { label: 'Report Master', icon: <FileText size={18} />, path: '/dashboard/radiology/report-master' },
      { label: 'Word Report Setup', icon: <Image size={18} />, path: '/dashboard/radiology/word-report-setup' },
      { label: 'PNDT / CMO', icon: <Image size={18} />, path: '/dashboard/radiology/pndt' },
    ],
  },
  {
    title: 'Billing',
    items: [
      { label: 'Balance Receipt', icon: <CreditCard size={18} />, path: '/dashboard/account/balance-receipt' },
      { label: 'Final Bill', icon: <CreditCard size={18} />, path: '/dashboard/billing/final-bill' },
      { label: 'Receipts', icon: <CreditCard size={18} />, path: '/dashboard/billing/receipts' },
      { label: 'Doctor Billing', icon: <FileText size={18} />, path: '/dashboard/doctor-bill' },
    ],
  },
  {
    title: 'Analytics',
    items: [{ label: 'MIS', icon: <BarChart3 size={18} />, path: '/dashboard/mis' }],
  },
  {
    title: 'Utility',
    items: [
      { label: 'Delete Booking', icon: <ToolCase size={18} />, path: '/dashboard/utility/delete-booking' },
      { label: 'Calculator', icon: <ToolCase size={18} />, path: '/dashboard/utility/calculator' },
      { label: 'Notepad', icon: <FileText size={18} />, path: '/dashboard/utility/notepad' },
      { label: 'Backup Guidance', icon: <ToolCase size={18} />, path: '/dashboard/utility/backup-guidance' },
      { label: 'Daily Voucher', icon: <FileText size={18} />, path: '/dashboard/account/daily-voucher' },
      { label: 'Internet Reporting', icon: <FileText size={18} />, path: '/dashboard/mis/internet-reporting' },
    ],
  },
  {
    title: 'Settings',
    items: [{ label: 'Settings', icon: <Settings size={18} />, path: '/dashboard/settings/lab-profile' }],
  },
];

export default function DashboardLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser() as any);
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200">
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center gap-3 border-b border-slate-200">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <FlaskConical size={20} className="text-white" />
            </div>
            <div>
              <p className="text-base font-semibold text-slate-900">{APP_NAME}</p>
              <p className="text-xs text-slate-500">Lab operations dashboard</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-4">
            {navGroups.map((group) => (
              <div key={group.title} className="mb-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400 mb-3 px-2">{group.title}</p>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                          isActive ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-700 hover:bg-slate-50'
                        }`
                      }
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 p-4">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
              <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-xs uppercase">
                {user?.name?.split(' ').map((part: string) => part[0]).join('')}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{user?.name ?? 'Unknown user'}</p>
                <p className="text-xs text-slate-500 truncate">{user?.role ?? 'Operator'}</p>
              </div>
              <button onClick={handleLogout} className="ml-auto text-slate-400 hover:text-red-500" aria-label="Logout">
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pl-64 flex flex-col h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
