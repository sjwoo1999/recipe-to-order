import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LoadingState } from '@/types';
import { mockUsers } from '@/data/mock';

interface AuthState extends LoadingState {
  user: User | null;
  isAuthenticated: boolean;
  login: (emailOrName: string, role?: User['role']) => Promise<void>;
  logout: () => void;
  updatePlan: (plan: User['plan']) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: undefined,

      login: async (emailOrName: string, role: User['role'] = 'Owner') => {
        set({ isLoading: true, error: undefined });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Find or create user
          let user = mockUsers.find(u => u.name === emailOrName);
          if (!user) {
            user = {
              id: `user-${Date.now()}`,
              name: emailOrName,
              role,
              storeId: 'store-1',
              plan: 'Basic',
            };
          }
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: undefined,
          });
        } catch (error: unknown) {
          set({
            isLoading: false,
            error: {
              code: 'LOGIN_FAILED',
              message: '로그인에 실패했습니다.',
              retryable: true,
            },
          });
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: undefined,
        });
      },

      updatePlan: (plan: User['plan']) => {
        const { user } = get();
        if (user) {
          set({
            user: { ...user, plan },
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
