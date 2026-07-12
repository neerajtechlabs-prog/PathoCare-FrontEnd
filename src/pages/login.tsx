import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import LoginPage from '../features/auth/LoginPage';
import { ROUTES } from '../utils/constants';

export default function LoginRoutePage() {
  const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);
  const hasSession = Boolean(isAuthenticated || token);

  if (hasSession) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <LoginPage />;
}
