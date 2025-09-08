'use client';

import React from 'react';
import { useAuthStore } from '@/stores/auth';
import { useBillingStore } from '@/stores/billing';
import { Button } from '@/components/ui/button';
import { User, Store, Crown } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { currentPlan } = useBillingStore();

  if (!user) return null;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#F76241] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Recipe-to-Order</h1>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center space-x-4">
          {/* Store Info */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Store className="h-4 w-4" />
            <span>매장 {user.storeId}</span>
          </div>

          {/* Plan Info */}
          <div className="flex items-center space-x-2">
            <Crown className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">
              {currentPlan?.name || user.plan}
            </span>
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600" />
              </div>
              <div className="text-sm">
                <div className="font-medium text-gray-900">{user.name}</div>
                <div className="text-gray-500">{user.role}</div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-gray-600 hover:text-gray-900"
            >
              로그아웃
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
