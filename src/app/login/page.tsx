'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChefHat, User, Building } from 'lucide-react';

export default function LoginPage() {
  const [name, setName] = useState('');
  const [role, setRole] = useState<'Owner' | 'Staff'>('Owner');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      await login(name.trim(), role);
      router.push('/recipes');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetLogin = async (presetName: string, presetRole: 'Owner' | 'Staff') => {
    setIsLoading(true);
    try {
      await login(presetName, presetRole);
      router.push('/recipes');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-[#F76241] rounded-2xl flex items-center justify-center mb-4">
            <ChefHat className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Recipe-to-Order</h1>
          <p className="text-gray-600 mt-2">레시피 기반 주문 관리 시스템</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>로그인</CardTitle>
            <CardDescription>
              이메일 또는 닉네임을 입력하고 역할을 선택하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="이메일 또는 닉네임"
                placeholder="이메일 또는 닉네임을 입력하세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">역할</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('Owner')}
                    className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-colors ${
                      role === 'Owner'
                        ? 'border-[#F76241] bg-[#F76241]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Building className="h-5 w-5" />
                    <span className="text-sm font-medium">사장</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('Staff')}
                    className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-colors ${
                      role === 'Staff'
                        ? 'border-[#F76241] bg-[#F76241]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <User className="h-5 w-5" />
                    <span className="text-sm font-medium">직원</span>
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                loading={isLoading}
                disabled={!name.trim()}
              >
                로그인
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Preset Logins */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">빠른 로그인</CardTitle>
            <CardDescription>
              테스트용 프리셋 계정으로 로그인하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handlePresetLogin('김사장', 'Owner')}
                disabled={isLoading}
              >
                <Building className="h-4 w-4 mr-2" />
                김사장 (사장)
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handlePresetLogin('이직원', 'Staff')}
                disabled={isLoading}
              >
                <User className="h-4 w-4 mr-2" />
                이직원 (직원)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
