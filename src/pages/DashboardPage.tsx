import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Users,
  FilePieChart,
  CreditCard,
  Activity,
  TrendingUp,
  TrendingDown,
  Mail,
  ClipboardList,
  Layers,
  FileText,
} from 'lucide-react';
import { RootState } from '../app/store';
import Card from '../components/ui/Card';
import { fetchDashboardSummary, DashboardStatModel, DashboardUiModel, DashboardWorkloadModel, DashboardActivityModel } from '../services/dashboardService';

const workflowActions = [
  {
    label: 'New Booking',
    description: 'Register patient and order tests quickly.',
    icon: <ClipboardList size={20} className="text-indigo-600" />,
    path: '/dashboard/booking',
  },
  {
    label: 'Result Entry',
    description: 'Enter lab results and complete reports.',
    icon: <FilePieChart size={20} className="text-emerald-600" />,
    path: '/dashboard/results/entry',
  },
  {
    label: 'Balance Receipt',
    description: 'Collect pending payments and issue receipts.',
    icon: <CreditCard size={20} className="text-amber-600" />,
    path: '/dashboard/account/balance-receipt',
  },
  {
    label: 'Final Bill',
    description: 'Create consolidated billing documents.',
    icon: <Layers size={20} className="text-slate-700" />,
    path: '/dashboard/billing/final-bill',
  },
  {
    label: 'Report Partly',
    description: 'Print partial report sets for ready tests.',
    icon: <FileText size={20} className="text-violet-600" />,
    path: '/dashboard/report-partly',
  },
  {
    label: 'Workload',
    description: 'Monitor pending bookings and lab load.',
    icon: <Activity size={20} className="text-rose-600" />,
    path: '/dashboard/mis/day-collection',
  },
  {
    label: 'Test Master',
    description: 'Manage test definitions and pricing.',
    icon: <Users size={20} className="text-cyan-600" />,
    path: '/dashboard/masters/tests',
  },
  {
    label: 'Email Reports',
    description: 'Dispatch completed reports digitally.',
    icon: <Mail size={20} className="text-violet-600" />,
    path: '/dashboard/mis/day-collection',
  },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { patients } = useSelector((state: RootState) => state.patients);
  const [dashboardData, setDashboardData] = useState<DashboardUiModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const payload = await fetchDashboardSummary();
        if (isMounted) {
          setDashboardData(payload);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unable to load dashboard data');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDashboard();
    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const fallback: DashboardStatModel[] = [
      {
        label: 'Total Patients',
        value: patients.length,
        icon: <Users className="text-slate-700" />,
        change: '+0%',
        trend: 'neutral',
        color: 'bg-slate-50',
      },
      {
        label: 'Pending Results',
        value: 0,
        icon: <FilePieChart className="text-emerald-600" />,
        change: 'N/A',
        trend: 'neutral',
        color: 'bg-emerald-50',
      },
      {
        label: 'Due Receipts',
        value: 0,
        icon: <CreditCard className="text-amber-600" />,
        change: 'N/A',
        trend: 'neutral',
        color: 'bg-amber-50',
      },
      {
        label: 'Outstanding Tests',
        value: 0,
        icon: <Activity className="text-rose-600" />,
        change: 'N/A',
        trend: 'neutral',
        color: 'bg-rose-50',
      },
    ];

    if (!dashboardData) {
      return fallback.map((item) => ({ ...item, icon: item.icon }));
    }

    return dashboardData.stats.map((item, index) => {
      const iconMap = [
        <Users key="patients" className="text-slate-700" />,
        <FilePieChart key="results" className="text-emerald-600" />,
        <CreditCard key="receipts" className="text-amber-600" />,
        <Activity key="tests" className="text-rose-600" />,
      ];

      return {
        ...item,
        icon: iconMap[index],
      };
    });
  }, [dashboardData, patients.length]);

  const workloadSummary = useMemo<DashboardWorkloadModel[]>(() => {
    if (!dashboardData) {
      return [];
    }

    return dashboardData.workload;
  }, [dashboardData]);

  const activityFeed = useMemo<DashboardActivityModel[]>(() => {
    if (!dashboardData) {
      return [];
    }

    return dashboardData.activity;
  }, [dashboardData]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Lab Operations Command Centre</h2>
        <p className="text-slate-500 mt-2">Use these quick workflows to move from booking to reporting with one click.</p>
      </div>

      {error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Card key={`loading-${index}`} className="group">
                <div className="h-10 w-10 animate-pulse rounded-2xl bg-slate-200" />
                <div className="mt-4 space-y-2">
                  <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
                  <div className="h-8 w-16 animate-pulse rounded bg-slate-200" />
                </div>
              </Card>
            ))
          : stats.map((stat) => (
              <Card key={stat.label} className="group">
                <div className="flex items-start justify-between gap-4">
                  <div className={`rounded-2xl p-3 ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                    stat.trend === 'up'
                      ? 'bg-emerald-100 text-emerald-700'
                      : stat.trend === 'down'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-slate-100 text-slate-600'
                  }`}>
                    {stat.trend === 'up' ? <TrendingUp size={12} className="mr-1" /> : null}
                    {stat.trend === 'down' ? <TrendingDown size={12} className="mr-1" /> : null}
                    {stat.change}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <h3 className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</h3>
                </div>
              </Card>
            ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card title="Quick workflows" subtitle="Go directly to your most-used screens">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {workflowActions.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={() => navigate(action.path)}
                className="group flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-left transition hover:border-indigo-300 hover:bg-white"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm text-slate-900">
                  {action.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{action.label}</p>
                  <p className="text-xs text-slate-500 mt-1">{action.description}</p>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card title="Workload snapshot" subtitle="Current lab capacity and test queue">
          <div className="space-y-5">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={`workload-skeleton-${index}`} className="space-y-2">
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                  <div className="h-2 w-full animate-pulse rounded-full bg-slate-200" />
                </div>
              ))
            ) : workloadSummary.length > 0 ? (
              workloadSummary.map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm font-medium text-slate-700">
                    <span>{item.label}</span>
                    <span className="text-slate-500">{item.progress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className={`${item.color} h-full transition-all`} style={{ width: `${item.progress}%` }} />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No workload data available yet.</p>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Activity feeds" subtitle="Latest transactions and pending tasks">
          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={`activity-skeleton-${index}`} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                  <div className="mt-2 h-3 w-48 animate-pulse rounded bg-slate-200" />
                </div>
              ))
            ) : activityFeed.length > 0 ? (
              activityFeed.map((item) => (
                <div key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="text-sm text-slate-500 mt-1">{item.detail}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No recent activity available.</p>
            )}
          </div>
        </Card>

        <Card title="Operational trend" subtitle="Quick visibility for daily lab operations">
          <div className="space-y-4">
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Today</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {isLoading ? 'Loading…' : `${dashboardData?.today.bookings ?? 0} bookings`}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                {isLoading
                  ? 'Fetching live data…'
                  : `${dashboardData?.today.reportsPending ?? 0} reports pending, ${dashboardData?.today.receiptsDue ?? 0} receipts due`}
              </p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">User</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">ADMIN</p>
              <p className="text-sm text-slate-500 mt-1">Version 1.0.0 • Financial year 2025-26</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
