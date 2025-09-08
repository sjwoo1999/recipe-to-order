import { create } from 'zustand';
import { Plan, LoadingState, ApiError } from '@/types';
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
    } catch (error: unknown) {
      const apiError = error instanceof ApiError ? error : new ApiError('LOAD_PLANS_FAILED', '요금제 정보를 불러오는데 실패했습니다.', true);
      set({
        isLoading: false,
        error: {
          code: apiError.code,
          message: apiError.message,
          retryable: apiError.retryable,
        },
      });
    }
  },

  loadCurrentPlan: async (userId: string) => {
    set({ isLoading: true, error: undefined });
    
    try {
      const plan = await billingAdapter.getCurrentPlan(userId);
      set({ currentPlan: plan, isLoading: false });
    } catch (error: unknown) {
      const apiError = error instanceof ApiError ? error : new ApiError('LOAD_CURRENT_PLAN_FAILED', '현재 요금제를 불러오는데 실패했습니다.', true);
      set({
        isLoading: false,
        error: {
          code: apiError.code,
          message: apiError.message,
          retryable: apiError.retryable,
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
        useAuthStore.getState().updatePlan(newPlan as 'Basic' | 'Standard' | 'Premium');
        
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
    } catch (error: unknown) {
      const apiError = error instanceof ApiError ? error : new ApiError('CHANGE_PLAN_FAILED', '요금제 변경에 실패했습니다.', true);
      set({
        isLoading: false,
        error: {
          code: apiError.code,
          message: apiError.message,
          retryable: apiError.retryable,
        },
      });
    }
  },

  loadFeatureFlags: async (userId: string) => {
    set({ isLoading: true, error: undefined });
    
    try {
      const flags = await billingAdapter.getFeatureFlags(userId);
      set({ featureFlags: flags, isLoading: false });
    } catch (error: unknown) {
      const apiError = error instanceof ApiError ? error : new ApiError('LOAD_FEATURE_FLAGS_FAILED', '기능 플래그를 불러오는데 실패했습니다.', true);
      set({
        isLoading: false,
        error: {
          code: apiError.code,
          message: apiError.message,
          retryable: apiError.retryable,
        },
      });
    }
  },

  loadUsageStats: async (userId: string) => {
    set({ isLoading: true, error: undefined });
    
    try {
      const stats = await billingAdapter.getUsageStats(userId);
      set({ usageStats: stats, isLoading: false });
    } catch (error: unknown) {
      const apiError = error instanceof ApiError ? error : new ApiError('LOAD_USAGE_STATS_FAILED', '사용량 통계를 불러오는데 실패했습니다.', true);
      set({
        isLoading: false,
        error: {
          code: apiError.code,
          message: apiError.message,
          retryable: apiError.retryable,
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
    } catch (error: unknown) {
      const apiError = error instanceof ApiError ? error : new ApiError('CHECK_FEATURE_ACCESS_FAILED', '기능 접근 권한을 확인하는데 실패했습니다.', true);
      set({
        error: {
          code: apiError.code,
          message: apiError.message,
          retryable: apiError.retryable,
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
