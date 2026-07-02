import { Outlet } from 'react-router-dom';
import ExistingDashboardLayout from '../../layouts/DashboardLayout';

export default function DashboardLayout() {
  return <ExistingDashboardLayout><Outlet /></ExistingDashboardLayout>;
}
