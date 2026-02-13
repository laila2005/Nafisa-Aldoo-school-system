import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  hint?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, success, hint, icon, className, fullWidth = true, ...props }, ref) => {
    return (
      <div className={cn('space-y-2', fullWidth ? 'w-full' : '')}>
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 rtl:left-auto rtl:right-3">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full px-4 py-2 border-2 rounded-lg bg-white text-gray-900',
              'placeholder-gray-400 transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500',
              icon ? 'pl-10 rtl:pl-4 rtl:pr-10' : '',
              error ? 'border-red-500 focus:ring-red-500' : '',
              success ? 'border-green-500 focus:ring-green-500' : '',
              !error && !success ? 'border-gray-300' : '',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <span>⚠️</span>
            <span>{error}</span>
          </p>
        )}
        {success && !error && (
          <p className="text-sm text-green-600 flex items-center gap-1">
            <span>✓</span>
            <span>Valid</span>
          </p>
        )}
        {hint && !error && !success && (
          <p className="text-sm text-gray-500">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
