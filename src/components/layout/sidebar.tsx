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

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { featureFlags, planGateModal, showPlanGate, hidePlanGate, changePlan } = useBillingStore();

  if (!user) return null;

  const handleFeatureClick = (item: SidebarItem, e: React.MouseEvent) => {
    if (item.requiresFeature && !featureFlags[item.requiresFeature]) {
      e.preventDefault();
      showPlanGate(item.requiresFeature);
    } else {
      // Close sidebar on mobile when navigating
      onClose?.();
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
    <aside className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Mobile Header */}
      <div className="lg:hidden p-6 border-b-2 border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#F76241] rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">메뉴</h2>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
            aria-label="메뉴 닫기"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-3">
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
                'flex items-center space-x-4 px-4 py-4 rounded-xl text-base font-semibold transition-all duration-200',
                isActive
                  ? 'bg-[#F76241] text-white shadow-md'
                  : isDisabled
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100 hover:shadow-sm'
              )}
            >
              <Icon className="h-6 w-6 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {isDisabled && (
                <span className="ml-auto text-sm bg-gray-200 text-gray-500 px-3 py-1 rounded-lg font-medium">
                  Pro
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      
      {/* User Info - Mobile only */}
      <div className="lg:hidden p-6 border-t-2 border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shadow-sm">
            <span className="text-lg font-semibold text-gray-600">
              {user.name.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-base font-semibold text-gray-900 truncate">{user.name}</div>
            <div className="text-sm text-gray-600">{user.role}</div>
          </div>
        </div>
      </div>
      
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
