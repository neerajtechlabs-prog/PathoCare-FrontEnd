import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './app/store';
import AppRoutes from './routes';
import AuthBootstrap from './components/auth/AuthBootstrap';

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthBootstrap />
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
}
