'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, helperText, id, ...props }, ref) => {
    const [inputId] = React.useState(() => id || `input-${Math.random().toString(36).substr(2, 9)}`);
    
    return (
      <div className="space-y-3">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-lg font-semibold text-gray-900"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'flex h-14 w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-lg placeholder:text-gray-500 focus:border-[#F76241] focus:outline-none focus:ring-3 focus:ring-[#F76241] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 transition-all duration-200',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          ref={ref}
          id={inputId}
          {...props}
        />
        {error && (
          <p className="text-base text-red-600 font-medium" role="alert">
            ⚠️ {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-base text-gray-600">
            💡 {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
