'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useOrdersStore } from '@/stores/orders';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SkeletonCard } from '@/components/ui/skeleton';
import { ArrowLeft, Package, Calendar, FileText, CreditCard, Truck, CheckCircle, X } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';

const statusConfig = {
  pending: { label: '주문 대기', color: 'text-yellow-600', icon: Package },
  confirmed: { label: '주문 확인', color: 'text-blue-600', icon: CheckCircle },
  shipped: { label: '배송 중', color: 'text-purple-600', icon: Truck },
  delivered: { label: '배송 완료', color: 'text-green-600', icon: CheckCircle },
  cancelled: { label: '주문 취소', color: 'text-red-600', icon: X },
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToast();
  const orderId = params.id as string;
  
  const { getOrder, isLoading, error } = useOrdersStore();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const orderData = await getOrder(orderId);
      setOrder(orderData);
    } catch (error) {
      console.error('Failed to load order:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <SkeletonCard className="h-10 w-10" />
          <SkeletonCard className="h-8 w-48" />
        </div>
        <SkeletonCard className="h-96" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <Package className="h-12 w-12 mx-auto mb-2" />
          <h3 className="text-lg font-medium">주문을 찾을 수 없습니다</h3>
          <p className="text-sm text-gray-600 mt-1">
            {error?.message || '요청하신 주문이 존재하지 않습니다.'}
          </p>
        </div>
        <Button onClick={() => router.push('/orders')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          주문 목록으로
        </Button>
      </div>
    );
  }

  const statusInfo = statusConfig[order.status];
  const StatusIcon = statusInfo.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => router.push('/orders')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          뒤로
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            주문 #{order.invoiceNo}
          </h1>
          <p className="text-gray-600 mt-1">
            {formatDate(order.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <StatusIcon className={`h-5 w-5 ${statusInfo.color}`} />
                <span>주문 상태</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-lg font-semibold ${statusInfo.color}`}>
                    {statusInfo.label}
                  </div>
                  <div className="text-sm text-gray-600">
                    마지막 업데이트: {formatDate(order.updatedAt)}
                  </div>
                </div>
                {order.trackingNo && (
                  <div className="text-right">
                    <div className="text-sm text-gray-600">송장번호</div>
                    <div className="font-mono text-sm font-medium">
                      {order.trackingNo}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>주문 상품</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.cartSnapshot.items.map((item: any) => (
                  <div key={item.productId} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{item.displayName}</div>
                      <div className="text-sm text-gray-600">
                        {item.packSize}{item.product.unit} • {item.product.supplierType}
                      </div>
                      <div className="text-sm text-gray-500">
                        단가: {formatCurrency(item.unitPrice)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        {item.quantityPacks}개
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatCurrency(item.subtotal)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Delivery Info */}
          <Card>
            <CardHeader>
              <CardTitle>배송 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <div className="text-sm font-medium text-gray-900">배송 희망일</div>
                  <div className="text-sm text-gray-600">
                    {order.cartSnapshot.deliveryDate ? formatDate(order.cartSnapshot.deliveryDate) : '미지정'}
                  </div>
                </div>
              </div>
              
              {order.cartSnapshot.memo && (
                <div className="flex items-start space-x-2">
                  <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">주문 메모</div>
                    <div className="text-sm text-gray-600">{order.cartSnapshot.memo}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>주문 요약</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">상품 금액</span>
                  <span className="text-gray-900">{formatCurrency(order.cartSnapshot.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">세금 (10%)</span>
                  <span className="text-gray-900">{formatCurrency(order.cartSnapshot.tax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">배송비</span>
                  <span className="text-gray-900">{formatCurrency(order.cartSnapshot.shippingFee)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
                  <span>총 금액</span>
                  <span className="text-[#F76241]">{formatCurrency(order.cartSnapshot.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Actions */}
          <Card>
            <CardHeader>
              <CardTitle>주문 관리</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/orders')}
                >
                  주문 목록으로
                </Button>
                
                {order.status === 'pending' && (
                  <Button
                    variant="outline"
                    className="w-full text-red-600 hover:text-red-700"
                    onClick={() => {
                      if (confirm('정말로 이 주문을 취소하시겠습니까?')) {
                        // Handle order cancellation
                        addToast({
                          type: 'success',
                          title: '주문이 취소되었습니다',
                        });
                        router.push('/orders');
                      }
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    주문 취소
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
