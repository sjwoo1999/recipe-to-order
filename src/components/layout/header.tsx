'use client';

import React from 'react';
import { useAuthStore } from '@/stores/auth';
import { useBillingStore } from '@/stores/billing';
import { Button } from '@/components/ui/button';
import { User, Store, Crown, Menu, LogOut } from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuthStore();
  const { currentPlan } = useBillingStore();

  if (!user) return null;

  return (
    <header className="bg-white border-b-2 border-gray-200 px-4 sm:px-6 py-5 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left side - Menu button (mobile) + Logo */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
            aria-label="메뉴 열기"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#F76241] rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              <span className="hidden sm:inline">Recipe-to-Order</span>
              <span className="sm:hidden">R2O</span>
            </h1>
          </div>
        </div>

        {/* Right side - User Info & Actions */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Store Info - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-2 text-base text-gray-600">
            <Store className="h-5 w-5" />
            <span className="font-medium">매장 {user.storeId}</span>
          </div>

          {/* Plan Info - Hidden on small mobile */}
          <div className="hidden sm:flex items-center space-x-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            <span className="text-base font-semibold text-gray-700">
              {currentPlan?.name || user.plan}
            </span>
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* User Avatar & Name - Hidden on mobile */}
            <div className="hidden sm:flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shadow-sm">
                <User className="h-5 w-5 text-gray-600" />
              </div>
              <div className="text-base">
                <div className="font-semibold text-gray-900">{user.name}</div>
                <div className="text-gray-600">{user.role}</div>
              </div>
            </div>
            
            {/* Mobile User Avatar */}
            <div className="sm:hidden w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shadow-sm">
              <User className="h-5 w-5 text-gray-600" />
            </div>
            
            {/* Logout Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-gray-600 hover:text-gray-900 p-3"
            >
              <LogOut className="h-5 w-5 sm:hidden" />
              <span className="hidden sm:inline text-base">로그아웃</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
