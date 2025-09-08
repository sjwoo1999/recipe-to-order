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
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Menu button (mobile) + Logo */}
        <div className="flex items-center space-x-3">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#F76241] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
              <span className="hidden sm:inline">Recipe-to-Order</span>
              <span className="sm:hidden">R2O</span>
            </h1>
          </div>
        </div>

        {/* Right side - User Info & Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Store Info - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
            <Store className="h-4 w-4" />
            <span>매장 {user.storeId}</span>
          </div>

          {/* Plan Info - Hidden on small mobile */}
          <div className="hidden sm:flex items-center space-x-2">
            <Crown className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">
              {currentPlan?.name || user.plan}
            </span>
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* User Avatar & Name - Hidden on mobile */}
            <div className="hidden sm:flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600" />
              </div>
              <div className="text-sm">
                <div className="font-medium text-gray-900">{user.name}</div>
                <div className="text-gray-500">{user.role}</div>
              </div>
            </div>
            
            {/* Mobile User Avatar */}
            <div className="sm:hidden w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-gray-600" />
            </div>
            
            {/* Logout Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-gray-600 hover:text-gray-900 p-2"
            >
              <LogOut className="h-4 w-4 sm:hidden" />
              <span className="hidden sm:inline">로그아웃</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
