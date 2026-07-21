import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FlaskConical, ArrowRight, AlertCircle, EyeOffIcon, EyeIcon } from 'lucide-react';
import { signup } from './authSlice';
import type { SignupPayload } from './authService';
import { AppDispatch, RootState } from '../../app/store';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { ROUTES } from '../../utils/constants';
import { signupSchema, type SignupFormValues } from '../../shared/validation';

export default function SignupPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state: RootState) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: 'Demo Lab Admin',
      email: 'demo.admin@pathocare.local',
      username: 'demoadmin',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      tenantName: 'PathCare Demo Lab',
      registrationNumber: 'NABL-1234',
      gstNumber: '27AABCU9603R1ZV',
      mobileNumber: '9876543210',
      designation: 'Administrator',
      country: 'India',
      state: 'Uttar Pradesh',
      city: 'Meerut',
      pinCode: '250342',
      completeAddress: 'Rajpur Momin, Meerut',
      plan: 'Starter',
      terms: true,
      privacy: true,
    },
  });

  const normalizeTenantSlug = (value: string): string =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '') || 'tenant';

  const onSubmit = async (values: SignupFormValues) => {
    const tenantSlug = normalizeTenantSlug(values.tenantName || values.username || values.name || values.email);

    const payload: SignupPayload = {
      name: values.name,
      email: values.email,
      password: values.password,
      tenantName: values.tenantName,
      labName: values.tenantName,
      labCode: undefined,
      registrationNumber: values.registrationNumber || undefined,
      gstNumber: values.gstNumber || undefined,
      mobileNumber: values.mobileNumber,
      designation: values.designation || undefined,
      username: values.username,
      country: values.country || undefined,
      state: values.state || undefined,
      city: values.city || undefined,
      pinCode: values.pinCode || undefined,
      completeAddress: values.completeAddress || undefined,
      plan: values.plan || undefined,
      terms: values.terms,
      privacy: values.privacy,
      tenantSlug,
    };

    const result = await dispatch(signup(payload));
    if (signup.fulfilled.match(result)) {
      navigate(ROUTES.LOGIN, {
        replace: true,
        state: { signupSuccess: 'Account created successfully. Please sign in with your new credentials.' },
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-200/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-200/20 blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="px-10 pt-10 pb-6 text-center text-slate-900 leading-none">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-200 mb-6 transform -rotate-6 transition-transform hover:rotate-0">
              <FlaskConical size={32} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Create your PathoCare account</h1>
            <p className="mt-3 text-slate-500 font-medium text-sm">Set up your lab workspace and start managing bookings securely.</p>
          </div>

          <div className="px-10 pb-10">
            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">Sign up failed</p>
                  <p className="mt-1 text-red-600">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Full Name" placeholder="John Doe" className="h-12 border-slate-200 focus:ring-indigo-500" {...register('name')} error={errors.name?.message} />
                <Input label="Business Email" placeholder="name@pathocare.com" className="h-12 border-slate-200 focus:ring-indigo-500" {...register('email')} error={errors.email?.message} />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Username" placeholder="johndoe" className="h-12 border-slate-200 focus:ring-indigo-500" {...register('username')} error={errors.username?.message} />
                <Input label="Mobile Number" placeholder="9876543210" className="h-12 border-slate-200 focus:ring-indigo-500" {...register('mobileNumber')} error={errors.mobileNumber?.message} />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="h-12 border-slate-200 focus:ring-indigo-500"
                  rightIcon={showPassword ? EyeIcon : EyeOffIcon}
                  onRightIconClick={() => setShowPassword((prev) => !prev)}
                  {...register('password')}
                  error={errors.password?.message}
                />
                <Input
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="h-12 border-slate-200 focus:ring-indigo-500"
                  rightIcon={showConfirmPassword ? EyeIcon : EyeOffIcon}
                  onRightIconClick={() => setShowConfirmPassword((prev) => !prev)}
                  {...register('confirmPassword')}
                  error={errors.confirmPassword?.message}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Lab / Clinic Name" placeholder="PathCare Demo Lab" className="h-12 border-slate-200 focus:ring-indigo-500" {...register('tenantName')} error={errors.tenantName?.message} />
                <Input label="Registration Number" placeholder="NABL-1234" className="h-12 border-slate-200 focus:ring-indigo-500" {...register('registrationNumber')} error={errors.registrationNumber?.message} />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input label="GST Number" placeholder="27AABCU9603R1ZV" className="h-12 border-slate-200 focus:ring-indigo-500" {...register('gstNumber')} error={errors.gstNumber?.message} />
                <div className="w-full" />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="w-full space-y-1.5">
                  <label htmlFor="designation" className="block text-sm font-medium text-slate-700">
                    Designation
                  </label>
                  <select
                    id="designation"
                    className="flex h-12 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 ring-offset-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                    {...register('designation')}
                  >
                    <option value="">Select designation</option>
                    <option value="Administrator">Administrator</option>
                    <option value="Lab Admin">Lab Admin</option>
                    <option value="Receptionist">Receptionist</option>
                    <option value="Technician">Technician</option>
                    <option value="Doctor">Doctor</option>
                  </select>
                  {errors.designation && <p className="text-xs text-red-500 font-medium">{errors.designation.message}</p>}
                </div>

                <div className="w-full space-y-1.5">
                  <label htmlFor="plan" className="block text-sm font-medium text-slate-700">
                    Plan
                  </label>
                  <select
                    id="plan"
                    className="flex h-12 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 ring-offset-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                    {...register('plan')}
                  >
                    <option value="Starter">Starter</option>
                    <option value="Growth">Growth</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                  {errors.plan && <p className="text-xs text-red-500 font-medium">{errors.plan.message}</p>}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Country" placeholder="India" className="h-12 border-slate-200 focus:ring-indigo-500" {...register('country')} error={errors.country?.message} />
                <Input label="State" placeholder="Uttar Pradesh" className="h-12 border-slate-200 focus:ring-indigo-500" {...register('state')} error={errors.state?.message} />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input label="City" placeholder="Meerut" className="h-12 border-slate-200 focus:ring-indigo-500" {...register('city')} error={errors.city?.message} />
                <Input label="PIN Code" placeholder="250342" className="h-12 border-slate-200 focus:ring-indigo-500" {...register('pinCode')} error={errors.pinCode?.message} />
              </div>

              <Input label="Complete Address" placeholder="Rajpur Momin" className="h-12 border-slate-200 focus:ring-indigo-500" {...register('completeAddress')} error={errors.completeAddress?.message} />

              <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" {...register('terms')} />
                  <span className="text-sm text-slate-600">I accept the terms and conditions for using PathoCare.</span>
                </label>
                {errors.terms && <p className="text-xs text-red-500 font-medium">{errors.terms.message}</p>}

                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" {...register('privacy')} />
                  <span className="text-sm text-slate-600">I understand that my data will be handled in accordance with the privacy policy.</span>
                </label>
                {errors.privacy && <p className="text-xs text-red-500 font-medium">{errors.privacy.message}</p>}
              </div>

              <Button type="submit" className="w-full h-12 text-base font-bold gap-2 bg-indigo-600 hover:bg-indigo-700" isLoading={isSubmitting || loading}>
                Create Account
                <ArrowRight size={18} />
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <button type="button" onClick={() => navigate(ROUTES.LOGIN)} className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
