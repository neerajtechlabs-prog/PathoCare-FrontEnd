import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard,
  Users,
  FlaskConical,
  FileText,
  CreditCard,
  LogOut,
  Bell,
  Search,
  Settings,
  Menu,
} from 'lucide-react';
import { RootState } from '../app/store';
import { logout } from '../features/auth/authSlice';
import { ROUTES, APP_NAME } from '../utils/constants';
import Button from '../components/ui/Button';

export default function DashboardLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTES.LOGIN);
  };

  const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: ROUTES.DASHBOARD },
    { label: 'Patients', icon: <Users size={20} />, path: ROUTES.PATIENTS },
    { label: 'Booking', icon: <FlaskConical size={20} />, path: ROUTES.TESTS },
    { label: 'Reports', icon: <FileText size={20} />, path: ROUTES.REPORTS },
    { label: 'Billing', icon: <CreditCard size={20} />, path: ROUTES.BILLING },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 w-64 translate-x-0 transition-transform bg-white border-r border-slate-200">
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <FlaskConical size={20} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight whitespace-nowrap">PathoCare <span className="text-indigo-600 font-medium">Pro</span></span>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 py-3">Menu</div>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md transition-all ${
                    isActive ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs uppercase">
                {user?.name?.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{user?.role}</p>
              </div>
              <button onClick={handleLogout} className="text-slate-400 hover:text-red-500">
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pl-64 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
          <h1 className="text-lg font-semibold text-slate-800 uppercase tracking-tight">Overview</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search records..." 
                className="w-64 pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
              />
              <Search size={16} className="text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 shadow-sm transition-all focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              + New Registration
            </button>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
