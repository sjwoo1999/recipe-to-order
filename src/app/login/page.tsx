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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-[#F76241] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <ChefHat className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Recipe-to-Order</h1>
          <p className="text-lg text-gray-600">레시피 기반 주문 관리 시스템</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">로그인</CardTitle>
            <CardDescription className="text-base">
              이름을 입력하고 역할을 선택하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="이름"
                placeholder="이름을 입력하세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                helperText="실제 이름 또는 닉네임을 입력해주세요"
              />

              <div className="space-y-4">
                <label className="text-lg font-semibold text-gray-900">역할 선택</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRole('Owner')}
                    className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                      role === 'Owner'
                        ? 'border-[#F76241] bg-[#F76241]/10 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <Building className="h-6 w-6" />
                    <span className="text-base font-semibold">사장</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('Staff')}
                    className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                      role === 'Staff'
                        ? 'border-[#F76241] bg-[#F76241]/10 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <User className="h-6 w-6" />
                    <span className="text-base font-semibold">직원</span>
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={isLoading}
                disabled={!name.trim()}
              >
                로그인하기
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Preset Logins */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">빠른 로그인</CardTitle>
            <CardDescription className="text-base">
              테스트용 계정으로 바로 로그인하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                variant="outline"
                size="lg"
                className="w-full justify-start"
                onClick={() => handlePresetLogin('김사장', 'Owner')}
                disabled={isLoading}
              >
                <Building className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">김사장</div>
                  <div className="text-sm text-gray-500">사장 계정</div>
                </div>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full justify-start"
                onClick={() => handlePresetLogin('이직원', 'Staff')}
                disabled={isLoading}
              >
                <User className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">이직원</div>
                  <div className="text-sm text-gray-500">직원 계정</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
