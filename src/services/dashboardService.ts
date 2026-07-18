import api from '../lib/api/axios';

export interface DashboardStatModel {
  label: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  color: string;
}

export interface DashboardWorkloadModel {
  label: string;
  progress: number;
  color: string;
}

export interface DashboardActivityModel {
  title: string;
  detail: string;
}

export interface DashboardUiModel {
  stats: DashboardStatModel[];
  workload: DashboardWorkloadModel[];
  today: {
    bookings: number;
    reportsPending: number;
    receiptsDue: number;
  };
  activity: DashboardActivityModel[];
}

interface DashboardSummaryResponse {
  stats?: {
    totalPatients?: { value?: number; trend?: string };
    pendingResults?: { value?: number; trend?: string };
    dueReceipts?: { value?: number; trend?: string };
    outstandingTests?: { value?: number; trend?: string };
  };
  workload?: Array<{ department?: string; progress?: number }>;
  today?: {
    bookings?: number;
    reportsPending?: number;
    receiptsDue?: number;
  };
  recentActivity?: Array<{ title?: string; detail?: string }>;
}

const workloadColors = ['bg-slate-700', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500'];

export function mapDashboardSummaryToUiModel(payload: DashboardSummaryResponse): DashboardUiModel {
  const stats = [
    {
      label: 'Total Patients',
      value: payload.stats?.totalPatients?.value ?? 0,
      change: payload.stats?.totalPatients?.trend ?? 'N/A',
      trend: getTrendDirection(payload.stats?.totalPatients?.trend),
      color: 'bg-slate-50',
    },
    {
      label: 'Pending Results',
      value: payload.stats?.pendingResults?.value ?? 0,
      change: payload.stats?.pendingResults?.trend ?? 'N/A',
      trend: getTrendDirection(payload.stats?.pendingResults?.trend),
      color: 'bg-emerald-50',
    },
    {
      label: 'Due Receipts',
      value: payload.stats?.dueReceipts?.value ?? 0,
      change: payload.stats?.dueReceipts?.trend ?? 'N/A',
      trend: getTrendDirection(payload.stats?.dueReceipts?.trend),
      color: 'bg-amber-50',
    },
    {
      label: 'Outstanding Tests',
      value: payload.stats?.outstandingTests?.value ?? 0,
      change: payload.stats?.outstandingTests?.trend ?? 'N/A',
      trend: getTrendDirection(payload.stats?.outstandingTests?.trend),
      color: 'bg-rose-50',
    },
  ];

  const workload = (payload.workload ?? []).map((item, index) => ({
    label: item.department ?? `Department ${index + 1}`,
    progress: item.progress ?? 0,
    color: workloadColors[index % workloadColors.length],
  }));

  return {
    stats,
    workload,
    today: {
      bookings: payload.today?.bookings ?? 0,
      reportsPending: payload.today?.reportsPending ?? 0,
      receiptsDue: payload.today?.receiptsDue ?? 0,
    },
    activity: (payload.recentActivity ?? []).map((item) => ({
      title: item.title ?? 'Activity',
      detail: item.detail ?? 'No details available',
    })),
  };
}

function getTrendDirection(trend?: string): 'up' | 'down' | 'neutral' {
  if (!trend) return 'neutral';
  if (trend.startsWith('-')) return 'down';
  if (trend.startsWith('+')) return 'up';
  return 'neutral';
}

export async function fetchDashboardSummary() {
  const response = await api.get('/dashboard/summary');
  return mapDashboardSummaryToUiModel(response as DashboardSummaryResponse);
}

export async function fetchDashboardWorkload() {
  const response = await api.get('/dashboard/workload');
  return response as Array<{ pending?: number; processed?: number; avgTAT?: number; testsPerTech?: Array<{ tech_id?: string; count?: number }> }>;
}
