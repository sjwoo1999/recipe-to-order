import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order, Cart, LoadingState, ApiError } from '@/types';
import { ordersAdapter } from '@/adapters/orders';

interface OrdersState extends LoadingState {
  orders: Order[];
  
  // Actions
  createOrder: (cart: Cart) => Promise<Order>;
  loadOrders: (storeId: string) => Promise<void>;
  getOrder: (id: string) => Promise<Order | null>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  cancelOrder: (id: string) => Promise<void>;
  processPayment: (cart: Cart) => Promise<{ success: boolean; transactionId?: string; error?: string }>;
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set) => ({
      orders: [],
      isLoading: false,
      error: undefined,

      createOrder: async (cart: Cart) => {
        set({ isLoading: true, error: undefined });
        
        try {
          const order = await ordersAdapter.createOrder(cart);
          set(state => ({
            orders: [order, ...state.orders],
            isLoading: false,
          }));
          return order;
        } catch (error: unknown) {
          const apiError = error instanceof ApiError ? error : new ApiError('CREATE_ORDER_FAILED', '주문 생성에 실패했습니다.', true);
          set({
            isLoading: false,
            error: {
              code: apiError.code,
              message: apiError.message,
              retryable: apiError.retryable,
            },
          });
          throw error;
        }
      },

      loadOrders: async (storeId: string) => {
        set({ isLoading: true, error: undefined });
        
        try {
          const orders = await ordersAdapter.getOrders(storeId);
          set({ orders, isLoading: false });
    } catch (error: unknown) {
      const apiError = error instanceof ApiError ? error : new ApiError('LOAD_ORDERS_FAILED', '주문 목록을 불러오는데 실패했습니다.', true);
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

      getOrder: async (id: string) => {
        set({ isLoading: true, error: undefined });
        
        try {
          const order = await ordersAdapter.getOrder(id);
          set({ isLoading: false });
          return order;
        } catch (error: unknown) {
          const apiError = error instanceof ApiError ? error : new ApiError('GET_ORDER_FAILED', '주문 정보를 가져오는데 실패했습니다.', true);
          set({
            isLoading: false,
            error: {
              code: apiError.code,
              message: apiError.message,
              retryable: apiError.retryable,
            },
          });
          return null;
        }
      },

      updateOrderStatus: async (id: string, status: Order['status']) => {
        set({ isLoading: true, error: undefined });
        
        try {
          const updatedOrder = await ordersAdapter.updateOrderStatus(id, status);
          set(state => ({
            orders: state.orders.map(order => 
              order.id === id ? updatedOrder : order
            ),
            isLoading: false,
          }));
    } catch (error: unknown) {
      const apiError = error instanceof ApiError ? error : new ApiError('UPDATE_ORDER_STATUS_FAILED', '주문 상태 업데이트에 실패했습니다.', true);
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

      cancelOrder: async (id: string) => {
        set({ isLoading: true, error: undefined });
        
        try {
          const cancelledOrder = await ordersAdapter.cancelOrder(id);
          set(state => ({
            orders: state.orders.map(order => 
              order.id === id ? cancelledOrder : order
            ),
            isLoading: false,
          }));
    } catch (error: unknown) {
      const apiError = error instanceof ApiError ? error : new ApiError('CANCEL_ORDER_FAILED', '주문 취소에 실패했습니다.', true);
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

      processPayment: async (cart: Cart) => {
        set({ isLoading: true, error: undefined });
        
        try {
          const result = await ordersAdapter.processPayment(cart);
          set({ isLoading: false });
          return result;
        } catch (error: unknown) {
          const apiError = error instanceof ApiError ? error : new ApiError('PROCESS_PAYMENT_FAILED', '결제 처리에 실패했습니다.', true);
          set({
            isLoading: false,
            error: {
              code: apiError.code,
              message: apiError.message,
              retryable: apiError.retryable,
            },
          });
          return {
            success: false,
            error: apiError.message,
          };
        }
      },
    }),
    {
      name: 'orders-storage',
      partialize: (state) => ({
        orders: state.orders,
      }),
    }
  )
);
