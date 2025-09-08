'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { useBillingStore } from '@/stores/billing';
import { AppShell } from '@/components/layout/app-shell';

export default function RecipesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated } = useAuthStore();
  const { loadCurrentPlan, loadFeatureFlags } = useBillingStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user) {
      // Load billing information
      loadCurrentPlan(user.id);
      loadFeatureFlags(user.id);
    }
  }, [isAuthenticated, user, router, loadCurrentPlan, loadFeatureFlags]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F76241] mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
