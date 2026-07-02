import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { ReactElement } from 'react';
import { RootState } from '../app/store';
import { ROUTES } from '../utils/constants';

// Layouts
import DashboardLayout from '../layouts/DashboardLayout';

// Pages
import LoginRoutePage from '../pages/login';
import DashboardRoutePage from '../pages/dashboard';
import BookingListPage from '../pages/dashboard/booking';
import NewBookingPage from '../pages/dashboard/booking/new';
import ResultsPage from '../pages/dashboard/results';
import ResultEntryPage from '../pages/dashboard/results/[bookingId]';
import PatientsRoutePage from '../pages/dashboard/patients';
import PatientDetailPage from '../pages/dashboard/patients/[id]';
import MastersIndexPage from '../pages/dashboard/masters';
import OwnerProfilePage from '../pages/dashboard/masters/owner-profile';
import BillTypePage from '../pages/dashboard/masters/bill-type';
import ComplimentPage from '../pages/dashboard/masters/compliment';
import DoctorMasterPage from '../pages/dashboard/masters/doctor-master';
import ReviseDoctorPage from '../pages/dashboard/masters/revise-doctor';
import ApplyRateListPage from '../pages/dashboard/masters/apply-rate-list';
import AssignComplimentPage from '../pages/dashboard/masters/assign-compliment';
import TestsMasterPage from '../pages/dashboard/masters/tests';
import ReviseTestPage from '../pages/dashboard/masters/revise-test';
import SpecialNotesPage from '../pages/dashboard/masters/special-notes';
import CentreSetupPage from '../pages/dashboard/masters/centre-setup';
import SampleListPage from '../pages/dashboard/masters/sample-list';
import MasterListPage from '../pages/dashboard/masters/master-list';
import DepartmentPage from '../pages/dashboard/masters/dept';
import OutsourceLabPage from '../pages/dashboard/masters/outsource-lab';
import BarcodeMatrixPage from '../pages/dashboard/masters/barcode-master';
import EmployeeMasterPage from '../pages/dashboard/masters/employee-master';
import UserManagementPage from '../pages/dashboard/masters/user-management';
import UserRateListPage from '../pages/dashboard/masters/user-rate-list';
import SMSSetupPage from '../pages/dashboard/masters/sms-setup';
import DoctorsMasterPage from '../pages/dashboard/masters/doctors';
import DepartmentsMasterPage from '../pages/dashboard/masters/departments';
import SampleTypesMasterPage from '../pages/dashboard/masters/sample-types';
import BillingReceiptsPage from '../pages/dashboard/billing/receipts';
import DayCollectionPage from '../pages/dashboard/mis/day-collection';
import DayRegisterPage from '../pages/dashboard/mis/day-register';
import LabProfilePage from '../pages/dashboard/settings/lab-profile';
import UsersPage from '../pages/dashboard/settings/users';
import VerifyPage from '../pages/verify/[code]';
import BookingForm from '../features/tests/BookingForm';
import BookingPage from '../pages/BookingPage';

interface ProtectedProps {
  children: ReactElement;
}

const ProtectedRoute = ({ children }: ProtectedProps) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  return isAuthenticated ? children : <Navigate to={ROUTES.LOGIN} replace />;
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<LoginRoutePage />} />
      <Route path="/verify/:code" element={<VerifyPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardRoutePage />} />
        <Route path="patients" element={<PatientsRoutePage />} />
        <Route path="tests" element={<BookingForm />} />
        <Route path="bookings" element={<BookingPage />} />
        <Route path="bookings/:id" element={<BookingPage />} />
        <Route path="reports" element={<ResultsPage />} />
        <Route path="billing" element={<BillingReceiptsPage />} />
      </Route>

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardRoutePage />} />
        <Route path="booking" element={<BookingListPage />} />
        <Route path="booking/new" element={<NewBookingPage />} />
        <Route path="results" element={<ResultsPage />} />
        <Route path="results/:bookingId" element={<ResultEntryPage />} />
        <Route path="patients" element={<PatientsRoutePage />} />
        <Route path="patients/:id" element={<PatientDetailPage />} />
        <Route path="masters" element={<MastersIndexPage />} />
        <Route path="masters/owner-profile" element={<OwnerProfilePage />} />
        <Route path="masters/bill-type" element={<BillTypePage />} />
        <Route path="masters/compliment" element={<ComplimentPage />} />
        <Route path="masters/doctor-master" element={<DoctorMasterPage />} />
        <Route path="masters/revise-doctor" element={<ReviseDoctorPage />} />
        <Route path="masters/apply-rate-list" element={<ApplyRateListPage />} />
        <Route path="masters/assign-compliment" element={<AssignComplimentPage />} />
        <Route path="masters/tests" element={<TestsMasterPage />} />
        <Route path="masters/revise-test" element={<ReviseTestPage />} />
        <Route path="masters/special-notes" element={<SpecialNotesPage />} />
        <Route path="masters/centre-setup" element={<CentreSetupPage />} />
        <Route path="masters/sample-list" element={<SampleListPage />} />
        <Route path="masters/master-list" element={<MasterListPage />} />
        <Route path="masters/dept" element={<DepartmentPage />} />
        <Route path="masters/outsource-lab" element={<OutsourceLabPage />} />
        <Route path="masters/barcode-master" element={<BarcodeMatrixPage />} />
        <Route path="masters/employee-master" element={<EmployeeMasterPage />} />
        <Route path="masters/user-management" element={<UserManagementPage />} />
        <Route path="masters/user-rate-list" element={<UserRateListPage />} />
        <Route path="masters/sms-setup" element={<SMSSetupPage />} />
        <Route path="masters/doctors" element={<DoctorsMasterPage />} />
        <Route path="masters/departments" element={<DepartmentsMasterPage />} />
        <Route path="masters/sample-types" element={<SampleTypesMasterPage />} />
        <Route path="billing/receipts" element={<BillingReceiptsPage />} />
        <Route path="mis/day-collection" element={<DayCollectionPage />} />
        <Route path="mis/day-register" element={<DayRegisterPage />} />
        <Route path="settings/lab-profile" element={<LabProfilePage />} />
        <Route path="settings/users" element={<UsersPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
