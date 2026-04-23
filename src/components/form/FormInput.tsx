import React from 'react';
import { FieldProps } from 'formik';
import { cn } from '../../utils/cn';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  touched?: boolean;
  helperText?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, touched, helperText, className, ...props }, ref) => {
    const hasError = touched && error;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-3 py-2 border rounded-lg',
            'focus:outline-none focus:ring-2 focus:ring-blue-500',
            'transition-colors',
            hasError
              ? 'border-red-500 bg-red-50'
              : 'border-gray-300 bg-white',
            className
          )}
          {...props}
        />
        {hasError && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
        {helperText && !hasError && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  touched?: boolean;
  helperText?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export const SelectInput = React.forwardRef<HTMLSelectElement, SelectInputProps>(
  ({ label, error, touched, helperText, options, placeholder, className, ...props }, ref) => {
    const hasError = touched && error;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            'w-full px-3 py-2 border rounded-lg',
            'focus:outline-none focus:ring-2 focus:ring-blue-500',
            'transition-colors',
            'bg-white cursor-pointer',
            hasError
              ? 'border-red-500 bg-red-50'
              : 'border-gray-300',
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {hasError && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
        {helperText && !hasError && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

SelectInput.displayName = 'SelectInput';

interface FormCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const FormCheckbox = React.forwardRef<HTMLInputElement, FormCheckboxProps>(
  ({ label, className, ...props }, ref) => {
    return (
      <div className="flex items-center">
        <input
          ref={ref}
          type="checkbox"
          className={cn(
            'w-4 h-4 rounded border-gray-300',
            'focus:ring-2 focus:ring-blue-500',
            'cursor-pointer',
            className
          )}
          {...props}
        />
        {label && (
          <label className="ml-2 text-sm text-gray-700 cursor-pointer">
            {label}
          </label>
        )}
      </div>
    );
  }
);

FormCheckbox.displayName = 'FormCheckbox';

interface FormTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  touched?: boolean;
  helperText?: string;
}

export const FormTextArea = React.forwardRef<HTMLTextAreaElement, FormTextAreaProps>(
  ({ label, error, touched, helperText, className, ...props }, ref) => {
    const hasError = touched && error;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full px-3 py-2 border rounded-lg',
            'focus:outline-none focus:ring-2 focus:ring-blue-500',
            'transition-colors resize-none',
            hasError
              ? 'border-red-500 bg-red-50'
              : 'border-gray-300 bg-white',
            className
          )}
          {...props}
        />
        {hasError && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
        {helperText && !hasError && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

FormTextArea.displayName = 'FormTextArea';
