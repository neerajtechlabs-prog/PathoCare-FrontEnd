import { forwardRef, InputHTMLAttributes, useContext } from 'react';
import { useField, FormikContext, FieldInputProps, FieldMetaProps } from 'formik';
import { cn } from '../../utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, name, className, type = 'text', helperText, ...props }, ref) => {
    const formikContext = useContext(FormikContext);

    const [field, meta] = formikContext && name
      ? useField(name)
      : ([
          {
            name,
            value: props.value,
            onChange: props.onChange,
            onBlur: props.onBlur,
          } as FieldInputProps<any>,
          { touched: false, error: undefined } as FieldMetaProps<any>,
        ] as const);

    const hasError = !!(meta.touched && meta.error);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={name ?? undefined} className="block text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <input
          {...field}
          {...props}
          id={name}
          type={type}
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all',
            hasError && 'border-red-500 focus:ring-red-500',
            className
          )}
        />
        {hasError ? (
          <p className="text-xs text-red-500 font-medium">{meta.error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
