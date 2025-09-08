'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth';
import { useBillingStore } from '@/stores/billing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlanGate } from '@/components/plan-gate';
import { SkeletonCard } from '@/components/ui/skeleton';
import { Check, X, Crown, Star, Zap, Building, Brain, CreditCard } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';

const planFeatures = {
  Basic: [
    { name: '기본 레시피 관리', included: true },
    { name: '상품 매칭', included: true },
    { name: '장바구니 기능', included: true },
    { name: '기본 주문 관리', included: true },
    { name: '통합 정산', included: false },
    { name: '다점포 관리', included: false },
    { name: 'AI 추천', included: false },
    { name: '자동 주문', included: false },
    { name: '고급 분석', included: false },
  ],
  Standard: [
    { name: '기본 레시피 관리', included: true },
    { name: '상품 매칭', included: true },
    { name: '장바구니 기능', included: true },
    { name: '기본 주문 관리', included: true },
    { name: '통합 정산', included: true },
    { name: '다점포 관리', included: false },
    { name: 'AI 추천', included: true },
    { name: '자동 주문', included: false },
    { name: '고급 분석', included: false },
  ],
  Premium: [
    { name: '기본 레시피 관리', included: true },
    { name: '상품 매칭', included: true },
    { name: '장바구니 기능', included: true },
    { name: '기본 주문 관리', included: true },
    { name: '통합 정산', included: true },
    { name: '다점포 관리', included: true },
    { name: 'AI 추천', included: true },
    { name: '자동 주문', included: true },
    { name: '고급 분석', included: true },
  ],
};

const planIcons = {
  Basic: Building,
  Standard: Star,
  Premium: Crown,
};

export default function BillingPage() {
  const { user } = useAuthStore();
  const { 
    plans, 
    currentPlan, 
    usageStats, 
    planGateModal,
    isLoading, 
    error, 
    loadPlans, 
    loadCurrentPlan, 
    loadUsageStats,
    changePlan,
    showPlanGate,
    hidePlanGate 
  } = useBillingStore();
  const { addToast } = useToast();

  useEffect(() => {
    if (user) {
      loadPlans();
      loadCurrentPlan(user.id);
      loadUsageStats(user.id);
    }
  }, [user, loadPlans, loadCurrentPlan, loadUsageStats]);

  const handlePlanChange = async (newPlan: string) => {
    if (!user) return;
    
    if (newPlan === currentPlan?.name) {
      addToast({
        type: 'info',
        title: '이미 선택된 요금제입니다',
        message: '현재 요금제와 동일합니다.',
      });
      return;
    }

    try {
      await changePlan(user.id, newPlan);
      addToast({
        type: 'success',
        title: '요금제가 변경되었습니다',
        message: `${newPlan} 요금제로 업그레이드되었습니다.`,
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: '요금제 변경 실패',
        message: '요금제 변경에 실패했습니다.',
      });
    }
  };

  const handleFeatureClick = (feature: string) => {
    if (!currentPlan?.features[feature]) {
      showPlanGate(feature);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">요금제</h1>
          <p className="text-gray-600 mt-1">현재 요금제와 사용량을 확인하세요</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <CreditCard className="h-12 w-12 mx-auto mb-2" />
          <h3 className="text-lg font-medium">요금제 정보를 불러올 수 없습니다</h3>
          <p className="text-sm text-gray-600 mt-1">{error.message}</p>
        </div>
        <Button onClick={() => user && loadPlans()}>
          다시 시도
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">요금제</h1>
        <p className="text-gray-600 mt-1">현재 요금제와 사용량을 확인하세요</p>
      </div>

      {/* Current Plan & Usage */}
      {currentPlan && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                <span>현재 요금제</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#F76241] mb-2">
                  {currentPlan.name}
                </div>
                <div className="text-2xl font-semibold text-gray-900 mb-4">
                  {formatCurrency(currentPlan.price)}
                  <span className="text-sm font-normal text-gray-600">/월</span>
                </div>
                <div className="text-sm text-gray-600">
                  {currentPlan.price === 0 ? '무료 요금제' : '월 구독 요금제'}
                </div>
              </div>
            </CardContent>
          </Card>

          {usageStats && (
            <Card>
              <CardHeader>
                <CardTitle>사용량 통계</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">이번 달 주문</span>
                      <span className="text-gray-900">
                        {usageStats.currentMonthOrders}
                        {usageStats.planLimits.maxOrders > 0 && ` / ${usageStats.planLimits.maxOrders}`}
                      </span>
                    </div>
                    {usageStats.planLimits.maxOrders > 0 && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#F76241] h-2 rounded-full" 
                          style={{ 
                            width: `${Math.min((usageStats.currentMonthOrders / usageStats.planLimits.maxOrders) * 100, 100)}%` 
                          }}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">이번 달 지출</span>
                      <span className="text-gray-900">
                        {formatCurrency(usageStats.currentMonthSpending)}
                        {usageStats.planLimits.maxSpending > 0 && ` / ${formatCurrency(usageStats.planLimits.maxSpending)}`}
                      </span>
                    </div>
                    {usageStats.planLimits.maxSpending > 0 && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#F76241] h-2 rounded-full" 
                          style={{ 
                            width: `${Math.min((usageStats.currentMonthSpending / usageStats.planLimits.maxSpending) * 100, 100)}%` 
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Available Plans */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">요금제 선택</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const Icon = planIcons[plan.name];
            const isCurrentPlan = currentPlan?.name === plan.name;
            const features = planFeatures[plan.name];
            
            return (
              <Card key={plan.name} className={isCurrentPlan ? 'ring-2 ring-[#F76241]' : ''}>
                <CardHeader>
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      <Icon className="h-8 w-8 text-[#F76241]" />
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="text-3xl font-bold text-[#F76241] mt-2">
                      {formatCurrency(plan.price)}
                      <span className="text-sm font-normal text-gray-600">/월</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {features.map((feature) => (
                      <div key={feature.name} className="flex items-center space-x-2">
                        {feature.included ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-gray-400" />
                        )}
                        <span className={`text-sm ${feature.included ? 'text-gray-900' : 'text-gray-500'}`}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <Button
                      className="w-full"
                      variant={isCurrentPlan ? 'outline' : 'primary'}
                      disabled={isCurrentPlan}
                      onClick={() => handlePlanChange(plan.name)}
                    >
                      {isCurrentPlan ? '현재 요금제' : '선택하기'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Plan Gate Modal */}
      <PlanGate
        isOpen={planGateModal.isOpen}
        onClose={hidePlanGate}
        feature={planGateModal.feature}
        onUpgrade={handlePlanChange}
      />
    </div>
  );
}
