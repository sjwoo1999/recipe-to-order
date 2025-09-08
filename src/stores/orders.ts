import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order, Cart, LoadingState } from '@/types';
import { ordersAdapter } from '@/adapters/orders';
import { generateId } from '@/lib/utils';

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
    (set, get) => ({
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
        } catch (error: any) {
          set({
            isLoading: false,
            error: {
              code: error.code || 'CREATE_ORDER_FAILED',
              message: error.message || '주문 생성에 실패했습니다.',
              retryable: error.retryable ?? true,
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
        } catch (error: any) {
          set({
            isLoading: false,
            error: {
              code: error.code || 'LOAD_ORDERS_FAILED',
              message: error.message || '주문 목록을 불러오는데 실패했습니다.',
              retryable: error.retryable ?? true,
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
        } catch (error: any) {
          set({
            isLoading: false,
            error: {
              code: error.code || 'GET_ORDER_FAILED',
              message: error.message || '주문 정보를 가져오는데 실패했습니다.',
              retryable: error.retryable ?? true,
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
        } catch (error: any) {
          set({
            isLoading: false,
            error: {
              code: error.code || 'UPDATE_ORDER_STATUS_FAILED',
              message: error.message || '주문 상태 업데이트에 실패했습니다.',
              retryable: error.retryable ?? true,
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
        } catch (error: any) {
          set({
            isLoading: false,
            error: {
              code: error.code || 'CANCEL_ORDER_FAILED',
              message: error.message || '주문 취소에 실패했습니다.',
              retryable: error.retryable ?? true,
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
        } catch (error: any) {
          set({
            isLoading: false,
            error: {
              code: error.code || 'PROCESS_PAYMENT_FAILED',
              message: error.message || '결제 처리에 실패했습니다.',
              retryable: error.retryable ?? true,
            },
          });
          return {
            success: false,
            error: error.message || '결제 처리에 실패했습니다.',
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
