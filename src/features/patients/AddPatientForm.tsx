import { Formik, Form } from 'formik';
import { useDispatch } from 'react-redux';
import { patientSchema, PatientFormValues } from '../../schemas/patientSchema';
import { validateWithZod } from '../../utils/zodFormik';
import { addPatient } from './patientSlice';
import { AppDispatch } from '../../app/store';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

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

  const handleSubmit = async (values: PatientFormValues) => {
    await dispatch(addPatient(values));
    onSuccess();
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={validateWithZod(patientSchema)}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Full Name *" name="name" placeholder="John Doe" />
            <Input label="Mobile Number *" name="mobile" placeholder="9876543210" />
            
            <div className="grid grid-cols-2 gap-4">
              <Input label="Age *" name="age" type="number" placeholder="45" />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Gender *</label>
                <div className="flex gap-2">
                  {['Male', 'Female', 'Other'].map((g) => (
                    <label key={g} className="flex-1">
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        className="peer hidden"
                      />
                      <div className="flex items-center justify-center p-2 rounded-lg border border-slate-200 peer-checked:bg-brand-50 peer-checked:border-brand-500 peer-checked:text-brand-700 text-sm font-medium cursor-pointer transition-all">
                        {g}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <Input label="Referring Doctor *" name="doctor" placeholder="Dr. Sarah Johnson" />
            
            <Input label="Email Address" name="email" type="email" placeholder="john@example.com" />
            <Input label="Area / Locality" name="area" placeholder="Downtown" />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={onSuccess}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Register & Save
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
