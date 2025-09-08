'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, disabled, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 shadow-sm';
    
    const variants = {
      primary: 'bg-[#F76241] text-white hover:bg-[#E55A3A] focus-visible:ring-[#F76241] shadow-md hover:shadow-lg',
      secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500 border border-gray-200',
      outline: 'border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-500 hover:border-gray-400',
      ghost: 'text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600 shadow-md hover:shadow-lg',
    };
    
    const sizes = {
      sm: 'h-10 px-4 text-base min-w-[48px]', // 터치 영역 확대
      md: 'h-12 px-6 text-lg min-w-[56px]', // 기본 크기 확대
      lg: 'h-14 px-8 text-xl min-w-[64px]', // 큰 크기 확대
    };
    
    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
