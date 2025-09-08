'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth';
import { useOrdersStore } from '@/stores/orders';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SkeletonCard } from '@/components/ui/skeleton';
import { Package, Eye, X, Clock, CheckCircle, Truck } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

const statusConfig = {
  pending: { label: '주문 대기', color: 'text-yellow-600', icon: Clock },
  confirmed: { label: '주문 확인', color: 'text-blue-600', icon: CheckCircle },
  shipped: { label: '배송 중', color: 'text-purple-600', icon: Truck },
  delivered: { label: '배송 완료', color: 'text-green-600', icon: CheckCircle },
  cancelled: { label: '주문 취소', color: 'text-red-600', icon: X },
};

export default function OrdersPage() {
  const { user } = useAuthStore();
  const { orders, isLoading, error, loadOrders, cancelOrder } = useOrdersStore();

  useEffect(() => {
    if (user) {
      loadOrders(user.storeId);
    }
  }, [user, loadOrders]);

  const handleCancelOrder = async (orderId: string) => {
    if (confirm('정말로 이 주문을 취소하시겠습니까?')) {
      await cancelOrder(orderId);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">주문 내역</h1>
          <p className="text-gray-600 mt-1">주문한 상품들의 상태를 확인하세요</p>
        </div>
        
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
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
          <Package className="h-12 w-12 mx-auto mb-2" />
          <h3 className="text-lg font-medium">주문 내역을 불러올 수 없습니다</h3>
          <p className="text-sm text-gray-600 mt-1">{error.message}</p>
        </div>
        <Button onClick={() => user && loadOrders(user.storeId)}>
          다시 시도
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">주문 내역</h1>
        <p className="text-gray-600 mt-1">주문한 상품들의 상태를 확인하세요</p>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">주문 내역이 없습니다</h3>
          <p className="text-gray-600 mb-6">아직 주문한 상품이 없습니다</p>
          <Link href="/recipes">
            <Button>
              레시피 보러가기
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusInfo = statusConfig[order.status];
            const StatusIcon = statusInfo.icon;
            
            return (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        주문 #{order.invoiceNo}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {formatDate(order.createdAt)}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <StatusIcon className={`h-5 w-5 ${statusInfo.color}`} />
                      <span className={`font-medium ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Order Items */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">주문 상품</h4>
                      <div className="space-y-2">
                        {order.cartSnapshot.items.map((item) => (
                          <div key={item.productId} className="flex items-center justify-between text-sm">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{item.displayName}</div>
                              <div className="text-gray-600">
                                {item.quantityPacks}개 × {formatCurrency(item.unitPrice)}
                              </div>
                            </div>
                            <div className="font-medium text-gray-900">
                              {formatCurrency(item.subtotal)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          총 {order.cartSnapshot.items.length}개 상품
                        </div>
                        <div className="text-lg font-semibold text-[#F76241]">
                          {formatCurrency(order.cartSnapshot.total)}
                        </div>
                      </div>
                    </div>

                    {/* Order Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-600">
                        {order.trackingNo && (
                          <div>송장번호: {order.trackingNo}</div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link href={`/orders/${order.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            상세보기
                          </Button>
                        </Link>
                        {order.status === 'pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelOrder(order.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4 mr-2" />
                            취소
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
