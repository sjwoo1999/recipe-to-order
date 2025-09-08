import { Plan, User, ApiError } from '@/types';
import { mockPlans, mockUsers, mockDelay, shouldInjectError } from '@/data/mock';

export class BillingAdapter {
  private plans: Plan[] = [...mockPlans];
  private users: User[] = [...mockUsers];

  async getPlans(): Promise<Plan[]> {
    await mockDelay(200);
    
    if (shouldInjectError(0.05)) {
      throw new ApiError('GET_PLANS_FAILED', '요금제 정보를 가져오는데 실패했습니다.', true);
    }
    
    return [...this.plans];
  }

  async getCurrentPlan(userId: string): Promise<Plan | null> {
    await mockDelay(200);
    
    if (shouldInjectError(0.05)) {
      throw new ApiError('GET_CURRENT_PLAN_FAILED', '현재 요금제를 가져오는데 실패했습니다.', true);
    }
    
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      throw new ApiError('USER_NOT_FOUND', '사용자를 찾을 수 없습니다.', false);
    }
    
    return this.plans.find(plan => plan.name === user.plan) || null;
  }

  async changePlan(userId: string, newPlan: string): Promise<{ success: boolean; error?: string }> {
    await mockDelay(1000);
    
    if (shouldInjectError(0.1)) {
      throw new ApiError('CHANGE_PLAN_FAILED', '요금제 변경에 실패했습니다.', true);
    }
    
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      throw new ApiError('USER_NOT_FOUND', '사용자를 찾을 수 없습니다.', false);
    }
    
    const plan = this.plans.find(p => p.name === newPlan);
    if (!plan) {
      throw new ApiError('PLAN_NOT_FOUND', '요금제를 찾을 수 없습니다.', false);
    }
    
    // Simulate payment processing for paid plans
    if (plan.price > 0) {
      // Simulate payment failure (5% chance)
      if (Math.random() < 0.05) {
        return {
          success: false,
          error: '결제 처리 중 오류가 발생했습니다.',
        };
      }
    }
    
    // Update user's plan
    user.plan = newPlan as any;
    
    return { success: true };
  }

  async getFeatureFlags(userId: string): Promise<Record<string, boolean>> {
    await mockDelay(100);
    
    if (shouldInjectError(0.05)) {
      throw new ApiError('GET_FEATURE_FLAGS_FAILED', '기능 플래그를 가져오는데 실패했습니다.', true);
    }
    
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      throw new ApiError('USER_NOT_FOUND', '사용자를 찾을 수 없습니다.', false);
    }
    
    const plan = this.plans.find(p => p.name === user.plan);
    return plan?.features || {};
  }

  async checkFeatureAccess(userId: string, feature: string): Promise<boolean> {
    await mockDelay(100);
    
    if (shouldInjectError(0.05)) {
      throw new ApiError('CHECK_FEATURE_ACCESS_FAILED', '기능 접근 권한을 확인하는데 실패했습니다.', true);
    }
    
    const featureFlags = await this.getFeatureFlags(userId);
    return featureFlags[feature] || false;
  }

  async getUsageStats(userId: string): Promise<{
    currentMonthOrders: number;
    currentMonthSpending: number;
    planLimits: {
      maxOrders: number;
      maxSpending: number;
    };
  }> {
    await mockDelay(300);
    
    if (shouldInjectError(0.05)) {
      throw new ApiError('GET_USAGE_STATS_FAILED', '사용량 통계를 가져오는데 실패했습니다.', true);
    }
    
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      throw new ApiError('USER_NOT_FOUND', '사용자를 찾을 수 없습니다.', false);
    }
    
    // Mock usage data
    const planLimits = {
      Basic: { maxOrders: 10, maxSpending: 500000 },
      Standard: { maxOrders: 100, maxSpending: 5000000 },
      Premium: { maxOrders: -1, maxSpending: -1 }, // Unlimited
    };
    
    return {
      currentMonthOrders: Math.floor(Math.random() * 20),
      currentMonthSpending: Math.floor(Math.random() * 1000000),
      planLimits: planLimits[user.plan] || planLimits.Basic,
    };
  }
}

export const billingAdapter = new BillingAdapter();
