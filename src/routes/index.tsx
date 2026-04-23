import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { ROUTES } from '../utils/constants';

// Layouts
import DashboardLayout from '../layouts/DashboardLayout';

// Pages
import LoginPage from '../features/auth/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import PatientPage from '../features/patients/PatientPage';
import BookingForm from '../features/tests/BookingForm';
import BookingPage from '../pages/BookingPage';

interface ProtectedProps {
  children: React.ReactElement;
}

const ProtectedRoute = ({ children }: ProtectedProps) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  return isAuthenticated ? children : <Navigate to={ROUTES.LOGIN} replace />;
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="patients" element={<PatientPage />} />
        <Route path="tests" element={<BookingForm />} />
        <Route path="bookings" element={<BookingPage />} />
        <Route path="bookings/:id" element={<BookingPage />} />
        <Route path="reports" element={<div className="flex items-center justify-center h-full text-slate-400">Lab Reports Module (Coming Soon)</div>} />
        <Route path="billing" element={<div className="flex items-center justify-center h-full text-slate-400">Billing & Invoices Module (Coming Soon)</div>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
