'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth';
import { useBillingStore } from '@/stores/billing';
import { PlanGate } from '@/components/plan-gate';
import { 
  BookOpen, 
  ShoppingCart, 
  CreditCard, 
  Plus,
  History
} from 'lucide-react';

interface SidebarItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  requiresFeature?: string;
}

const sidebarItems: SidebarItem[] = [
  {
    href: '/recipes',
    label: '레시피',
    icon: BookOpen,
  },
  {
    href: '/recipes/new',
    label: '새 레시피',
    icon: Plus,
  },
  {
    href: '/cart',
    label: '장바구니',
    icon: ShoppingCart,
  },
  {
    href: '/orders',
    label: '주문 내역',
    icon: History,
  },
  {
    href: '/billing',
    label: '요금제',
    icon: CreditCard,
  },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { featureFlags, planGateModal, showPlanGate, hidePlanGate, changePlan } = useBillingStore();

  if (!user) return null;

  const handleFeatureClick = (item: SidebarItem, e: React.MouseEvent) => {
    if (item.requiresFeature && !featureFlags[item.requiresFeature]) {
      e.preventDefault();
      showPlanGate(item.requiresFeature);
    }
  };

  const handleUpgrade = async (plan: string) => {
    if (user) {
      try {
        await changePlan(user.id, plan);
      } catch (error) {
        console.error('Failed to upgrade plan:', error);
      }
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-full">
      <nav className="p-4 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const isDisabled = item.requiresFeature && !featureFlags[item.requiresFeature];
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => handleFeatureClick(item, e)}
              className={cn(
                'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[#F76241] text-white'
                  : isDisabled
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
              {isDisabled && (
                <span className="ml-auto text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded">
                  Pro
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      
      {/* Plan Gate Modal */}
      <PlanGate
        isOpen={planGateModal.isOpen}
        onClose={hidePlanGate}
        feature={planGateModal.feature}
        onUpgrade={handleUpgrade}
      />
    </aside>
  );
};
