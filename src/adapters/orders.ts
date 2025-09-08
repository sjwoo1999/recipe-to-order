import { Order, Cart, ApiError } from '@/types';
import { mockDelay, shouldInjectError } from '@/data/mock';
import { generateId } from '@/lib/utils';

export class OrdersAdapter {
  private orders: Order[] = [];

  async createOrder(cart: Cart): Promise<Order> {
    await mockDelay(800);
    
    if (shouldInjectError(0.1)) {
      throw new ApiError('CREATE_ORDER_FAILED', '주문 생성에 실패했습니다.', true);
    }
    
    const order: Order = {
      id: generateId(),
      cartSnapshot: { ...cart },
      status: 'pending',
      invoiceNo: `INV-${Date.now()}`,
      trackingNo: `TRK-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    this.orders.push(order);
    return order;
  }

  async getOrders(_storeId: string): Promise<Order[]> {
    await mockDelay(300);
    
    if (shouldInjectError(0.05)) {
      throw new ApiError('GET_ORDERS_FAILED', '주문 목록을 가져오는데 실패했습니다.', true);
    }
    
    // In a real app, we would filter by storeId
    return [...this.orders].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getOrder(id: string): Promise<Order | null> {
    await mockDelay(200);
    
    if (shouldInjectError(0.05)) {
      throw new ApiError('GET_ORDER_FAILED', '주문 정보를 가져오는데 실패했습니다.', true);
    }
    
    return this.orders.find(order => order.id === id) || null;
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    await mockDelay(400);
    
    if (shouldInjectError(0.1)) {
      throw new ApiError('UPDATE_ORDER_STATUS_FAILED', '주문 상태 업데이트에 실패했습니다.', true);
    }
    
    const order = this.orders.find(o => o.id === id);
    if (!order) {
      throw new ApiError('ORDER_NOT_FOUND', '주문을 찾을 수 없습니다.', false);
    }
    
    order.status = status;
    order.updatedAt = new Date().toISOString();
    
    return order;
  }

  async cancelOrder(id: string): Promise<Order> {
    await mockDelay(300);
    
    if (shouldInjectError(0.1)) {
      throw new ApiError('CANCEL_ORDER_FAILED', '주문 취소에 실패했습니다.', true);
    }
    
    const order = this.orders.find(o => o.id === id);
    if (!order) {
      throw new ApiError('ORDER_NOT_FOUND', '주문을 찾을 수 없습니다.', false);
    }
    
    if (order.status === 'delivered') {
      throw new ApiError('ORDER_ALREADY_DELIVERED', '이미 배송된 주문은 취소할 수 없습니다.', false);
    }
    
    order.status = 'cancelled';
    order.updatedAt = new Date().toISOString();
    
    return order;
  }

  // Simulate payment processing
  async processPayment(_cart: Cart): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    await mockDelay(1000);
    
    // Simulate payment failure (10% chance)
    if (shouldInjectError(0.1)) {
      return {
        success: false,
        error: '결제 처리 중 오류가 발생했습니다. 카드 정보를 확인해주세요.',
      };
    }
    
    // Simulate insufficient funds (5% chance)
    if (Math.random() < 0.05) {
      return {
        success: false,
        error: '잔액이 부족합니다.',
      };
    }
    
    return {
      success: true,
      transactionId: `TXN-${Date.now()}`,
    };
  }
}

export const ordersAdapter = new OrdersAdapter();
