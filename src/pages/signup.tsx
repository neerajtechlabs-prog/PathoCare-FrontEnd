import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import SignupPage from '../features/auth/SignupPage';
import { ROUTES } from '../utils/constants';

export default function SignupRoutePage() {
  const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);
  const hasSession = Boolean(isAuthenticated || token);

  if (hasSession) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <SignupPage />;
}
