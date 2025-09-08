import { create } from 'zustand';
import { Plan, LoadingState } from '@/types';
import { billingAdapter } from '@/adapters/billing';
import { useAuthStore } from './auth';

interface BillingState extends LoadingState {
  plans: Plan[];
  currentPlan: Plan | null;
  featureFlags: Record<string, boolean>;
  usageStats: {
    currentMonthOrders: number;
    currentMonthSpending: number;
    planLimits: {
      maxOrders: number;
      maxSpending: number;
    };
  } | null;
  planGateModal: {
    isOpen: boolean;
    feature: string;
  };
  
  // Actions
  loadPlans: () => Promise<void>;
  loadCurrentPlan: (userId: string) => Promise<void>;
  changePlan: (userId: string, newPlan: string) => Promise<void>;
  loadFeatureFlags: (userId: string) => Promise<void>;
  loadUsageStats: (userId: string) => Promise<void>;
  checkFeatureAccess: (userId: string, feature: string) => Promise<boolean>;
  showPlanGate: (feature: string) => void;
  hidePlanGate: () => void;
}

export const useBillingStore = create<BillingState>((set, get) => ({
  plans: [],
  currentPlan: null,
  featureFlags: {},
  usageStats: null,
  planGateModal: {
    isOpen: false,
    feature: '',
  },
  isLoading: false,
  error: undefined,

  loadPlans: async () => {
    set({ isLoading: true, error: undefined });
    
    try {
      const plans = await billingAdapter.getPlans();
      set({ plans, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: {
          code: error.code || 'LOAD_PLANS_FAILED',
          message: error.message || '요금제 정보를 불러오는데 실패했습니다.',
          retryable: error.retryable ?? true,
        },
      });
    }
  },

  loadCurrentPlan: async (userId: string) => {
    set({ isLoading: true, error: undefined });
    
    try {
      const plan = await billingAdapter.getCurrentPlan(userId);
      set({ currentPlan: plan, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: {
          code: error.code || 'LOAD_CURRENT_PLAN_FAILED',
          message: error.message || '현재 요금제를 불러오는데 실패했습니다.',
          retryable: error.retryable ?? true,
        },
      });
    }
  },

  changePlan: async (userId: string, newPlan: string) => {
    set({ isLoading: true, error: undefined });
    
    try {
      const result = await billingAdapter.changePlan(userId, newPlan);
      
      if (result.success) {
        // Update user's plan in auth store
        useAuthStore.getState().updatePlan(newPlan as any);
        
        // Reload current plan and feature flags
        await get().loadCurrentPlan(userId);
        await get().loadFeatureFlags(userId);
        
        set({ isLoading: false });
      } else {
        set({
          isLoading: false,
          error: {
            code: 'CHANGE_PLAN_FAILED',
            message: result.error || '요금제 변경에 실패했습니다.',
            retryable: true,
          },
        });
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: {
          code: error.code || 'CHANGE_PLAN_FAILED',
          message: error.message || '요금제 변경에 실패했습니다.',
          retryable: error.retryable ?? true,
        },
      });
    }
  },

  loadFeatureFlags: async (userId: string) => {
    set({ isLoading: true, error: undefined });
    
    try {
      const flags = await billingAdapter.getFeatureFlags(userId);
      set({ featureFlags: flags, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: {
          code: error.code || 'LOAD_FEATURE_FLAGS_FAILED',
          message: error.message || '기능 플래그를 불러오는데 실패했습니다.',
          retryable: error.retryable ?? true,
        },
      });
    }
  },

  loadUsageStats: async (userId: string) => {
    set({ isLoading: true, error: undefined });
    
    try {
      const stats = await billingAdapter.getUsageStats(userId);
      set({ usageStats: stats, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: {
          code: error.code || 'LOAD_USAGE_STATS_FAILED',
          message: error.message || '사용량 통계를 불러오는데 실패했습니다.',
          retryable: error.retryable ?? true,
        },
      });
    }
  },

  checkFeatureAccess: async (userId: string, feature: string) => {
    try {
      const hasAccess = await billingAdapter.checkFeatureAccess(userId, feature);
      
      if (!hasAccess) {
        get().showPlanGate(feature);
        return false;
      }
      
      return true;
    } catch (error: any) {
      set({
        error: {
          code: error.code || 'CHECK_FEATURE_ACCESS_FAILED',
          message: error.message || '기능 접근 권한을 확인하는데 실패했습니다.',
          retryable: error.retryable ?? true,
        },
      });
      return false;
    }
  },

  showPlanGate: (feature: string) => {
    set({
      planGateModal: {
        isOpen: true,
        feature,
      },
    });
  },

  hidePlanGate: () => {
    set({
      planGateModal: {
        isOpen: false,
        feature: '',
      },
    });
  },
}));
