import { useSelector } from 'react-redux';
import { Users, FilePieChart, CreditCard, Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { RootState } from '../app/store';
import Card from '../components/ui/Card';

export default function DashboardPage() {
  const { patients } = useSelector((state: RootState) => state.patients);

  const stats = [
    {
      label: 'Total Patients',
      value: patients.length,
      icon: <Users className="text-brand-600" />,
      change: '+12%',
      trend: 'up',
      color: 'bg-brand-50',
    },
    {
      label: 'Lab Reports',
      value: '24',
      icon: <FilePieChart className="text-emerald-600" />,
      change: '+4.5%',
      trend: 'up',
      color: 'bg-emerald-50',
    },
    {
      label: 'Total Revenue',
      value: '$12,450',
      icon: <CreditCard className="text-amber-600" />,
      change: '-2%',
      trend: 'down',
      color: 'bg-amber-50',
    },
    {
      label: 'Samples Collected',
      value: '18',
      icon: <Activity className="text-rose-600" />,
      change: '+8%',
      trend: 'up',
      color: 'bg-rose-50',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Overview</h2>
        <p className="text-slate-500 mt-2">Welcome back! Here's what's happening in your lab today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="group">
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl ${stat.color} transition-transform group-hover:scale-110`}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                stat.trend === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
              }`}>
                {stat.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card title="Recent Activity" subtitle="Real-time lab report updates">
            <div className="space-y-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center gap-4 p-4 rounded-xl border border-dotted border-slate-200">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <Activity size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">Complete Blood Count (CBC)</p>
                    <p className="text-xs text-slate-500">Patient: John Doe • Status: Pending</p>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">10:45 AM</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <Card title="Lab Status" subtitle="Capacity monitoring">
            <div className="space-y-6">
              {[
                { label: 'Hematology', progress: 75, color: 'bg-brand-500' },
                { label: 'Biochemistry', progress: 45, color: 'bg-emerald-500' },
                { label: 'Microbiology', progress: 90, color: 'bg-amber-500' },
                { label: 'Immunology', progress: 30, color: 'bg-rose-500' },
              ].map((dept, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700">{dept.label}</span>
                    <span className="text-slate-500">{dept.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${dept.color} transition-all duration-1000`} style={{ width: `${dept.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
