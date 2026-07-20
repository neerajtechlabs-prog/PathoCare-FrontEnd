import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import { addPatient } from './patientSlice';
import { AppDispatch } from '../../app/store';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { patientSchema, type PatientFormValues } from '../../shared/validation';

interface AddPatientFormProps {
  onSuccess: () => void;
}

export function AddPatientForm({ onSuccess }: AddPatientFormProps) {
  const dispatch = useDispatch<AppDispatch>();

  const initialValues: PatientFormValues = {
    name: '',
    age: 0,
    gender: 'Male',
    mobile: '',
    email: '',
    doctor: '',
    area: '',
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: initialValues,
  });

  const onSubmit = async (values: PatientFormValues) => {
    await dispatch(addPatient(values));
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="Full Name *" placeholder="John Doe" {...register('name')} error={errors.name?.message} />
        <Input label="Mobile Number *" placeholder="9876543210" {...register('mobile')} error={errors.mobile?.message} />
        
        <div className="grid grid-cols-2 gap-4">
          <Input label="Age *" type="number" placeholder="45" {...register('age', { valueAsNumber: true })} error={errors.age?.message} />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Gender *</label>
            <div className="flex gap-2">
              {['Male', 'Female', 'Other'].map((g) => (
                <label key={g} className="flex-1">
                  <input
                    type="radio"
                    value={g}
                    {...register('gender')}
                    className="peer hidden"
                  />
                  <div className="flex items-center justify-center p-2 rounded-lg border border-slate-200 peer-checked:bg-brand-50 peer-checked:border-brand-500 peer-checked:text-brand-700 text-sm font-medium cursor-pointer transition-all">
                    {g}
                  </div>
                </label>
              ))}
            </div>
            {errors.gender && <p className="text-xs text-red-500">{errors.gender.message}</p>}
          </div>
        </div>

        <Input label="Referring Doctor *" placeholder="Dr. Sarah Johnson" {...register('doctor')} error={errors.doctor?.message} />
        
        <Input label="Email Address" type="email" placeholder="john@example.com" {...register('email')} error={errors.email?.message} />
        <Input label="Area / Locality" placeholder="Downtown" {...register('area')} error={errors.area?.message} />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <Button type="button" variant="ghost" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Register & Save
        </Button>
      </div>
    </form>
  );
}
