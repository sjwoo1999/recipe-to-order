import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingProps {
  type?: 'page' | 'card' | 'table' | 'list';
  count?: number;
}

export const Loading: React.FC<LoadingProps> = ({ type = 'page', count = 1 }) => {
  switch (type) {
    case 'page':
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="space-y-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'card':
      return (
        <div className="space-y-4">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="space-y-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          ))}
        </div>
      );

    case 'table':
      return (
        <div className="space-y-3">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex space-x-4">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/6" />
              <Skeleton className="h-4 w-1/6" />
            </div>
          ))}
        </div>
      );

    case 'list':
      return (
        <div className="space-y-3">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      );

    default:
      return <Skeleton className="h-4 w-full" />;
  }
};

// Spinner component
export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-[#F76241] ${sizeClasses[size]}`} />
  );
};

// Page loading component
export const PageLoading: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600">로딩 중...</p>
      </div>
    </div>
  );
};
