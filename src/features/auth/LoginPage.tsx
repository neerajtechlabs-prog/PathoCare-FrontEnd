import { Formik, Form } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FlaskConical, Github, ArrowRight } from 'lucide-react';
import { login } from './authSlice';
import { AppDispatch, RootState } from '../../app/store';
import { loginSchema } from '../../schemas/patientSchema';
import { validateWithZod } from '../../utils/zodFormik';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { ROUTES, APP_NAME } from '../../utils/constants';

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (values: any) => {
    const result = await dispatch(login(values));
    if (login.fulfilled.match(result)) {
      navigate(ROUTES.DASHBOARD);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      {/* Background purely for aesthetic */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-200/20 blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-emerald-200/20 blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="px-10 pt-12 pb-8 text-center text-slate-900 leading-none">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-200 mb-8 transform -rotate-6 transition-transform hover:rotate-0">
              <FlaskConical size={32} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">PathoCare <span className="text-indigo-600 font-medium italic">Pro</span></h1>
            <p className="mt-3 text-slate-500 font-medium text-sm">Cloud Pathology Management System</p>
          </div>

          <div className="px-10 pb-12">
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium animate-pulse">
                {error}
              </div>
            )}

            <Formik
              initialValues={{ email: 'admin@pathocare.com', password: 'admin123' }}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-5">
                  <Input 
                    label="Business Email" 
                    name="email" 
                    placeholder="name@pathocare.com" 
                    className="h-12 border-slate-200 focus:ring-indigo-500"
                  />
                  <Input 
                    label="Password" 
                    name="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="h-12 border-slate-200 focus:ring-indigo-500"
                  />

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                      <span className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors font-medium">Remember me</span>
                    </label>
                    <a href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">Forgot password?</a>
                  </div>

                  <Button type="submit" className="w-full h-12 text-base font-bold gap-2 bg-indigo-600 hover:bg-indigo-700" isLoading={isSubmitting || loading}>
                    Access Account
                    <ArrowRight size={18} />
                  </Button>
                </Form>
              )}
            </Formik>

            <div className="mt-8 pt-8 border-t border-slate-100 text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Enterprise Pathology Network v2.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
