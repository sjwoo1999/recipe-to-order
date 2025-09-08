'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cart';
import { useOrdersStore } from '@/stores/orders';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { CheckCircle, XCircle, CreditCard, Calendar, FileText, Package } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const { cart, clearCart } = useCartStore();
  const { createOrder, processPayment } = useOrdersStore();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState<{
    success: boolean;
    orderId?: string;
    error?: string;
  } | null>(null);

  const handlePayment = async () => {
    if (cart.items.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      // Process payment
      const paymentResult = await processPayment(cart);
      
      if (paymentResult.success) {
        // Create order
        const order = await createOrder(cart);
        setPaymentResult({
          success: true,
          orderId: order.id,
        });
        
        // Clear cart
        clearCart();
        
        addToast({
          type: 'success',
          title: '주문이 완료되었습니다',
          message: `주문번호: ${order.invoiceNo}`,
        });
      } else {
        setPaymentResult({
          success: false,
          error: paymentResult.error,
        });
        
        addToast({
          type: 'error',
          title: '결제 실패',
          message: paymentResult.error || '결제 처리 중 오류가 발생했습니다.',
        });
      }
    } catch (_error) {
      setPaymentResult({
        success: false,
        error: '주문 처리 중 오류가 발생했습니다.',
      });
      
      addToast({
        type: 'error',
        title: '주문 실패',
        message: '주문 처리 중 오류가 발생했습니다.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseModal = () => {
    setPaymentResult(null);
    if (paymentResult?.success) {
      router.push('/orders');
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">주문하기</h1>
          <p className="text-gray-600 mt-1">장바구니의 상품을 확인하고 주문하세요</p>
        </div>
        
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">장바구니가 비어있습니다</h3>
          <p className="text-gray-600 mb-6">주문할 상품이 없습니다</p>
          <Button onClick={() => router.push('/recipes')}>
            레시피 보러가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">주문하기</h1>
        <p className="text-gray-600 mt-1">장바구니의 상품을 확인하고 주문하세요</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Details */}
        <div className="space-y-6">
          {/* Cart Items */}
          <Card>
            <CardHeader>
              <CardTitle>주문 상품</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cart.items.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{item.displayName}</div>
                      <div className="text-sm text-gray-600">
                        {item.quantityPacks}개 × {formatCurrency(item.unitPrice)}
                      </div>
                    </div>
                    <div className="font-medium text-gray-900">
                      {formatCurrency(item.subtotal)}
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
                    {cart.deliveryDate ? formatDate(cart.deliveryDate) : '미지정'}
                  </div>
                </div>
              </div>
              
              {cart.memo && (
                <div className="flex items-start space-x-2">
                  <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">주문 메모</div>
                    <div className="text-sm text-gray-600">{cart.memo}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Payment Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>결제 요약</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">상품 금액</span>
                  <span className="text-gray-900">{formatCurrency(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">세금 (10%)</span>
                  <span className="text-gray-900">{formatCurrency(cart.tax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">배송비</span>
                  <span className="text-gray-900">{formatCurrency(cart.shippingFee)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
                  <span>총 금액</span>
                  <span className="text-[#F76241]">{formatCurrency(cart.total)}</span>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handlePayment}
                  loading={isProcessing}
                  className="w-full"
                  size="lg"
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  결제하기
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Result Modal */}
      <Modal
        isOpen={!!paymentResult}
        onClose={handleCloseModal}
        title={paymentResult?.success ? '주문 완료' : '결제 실패'}
      >
        {paymentResult?.success ? (
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                주문이 성공적으로 완료되었습니다!
              </h3>
              <p className="text-gray-600">
                주문번호: {paymentResult.orderId}
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => router.push('/orders')}
                className="flex-1"
              >
                주문 내역 보기
              </Button>
              <Button
                onClick={() => router.push('/recipes')}
                className="flex-1"
              >
                계속 쇼핑하기
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <XCircle className="h-16 w-16 text-red-500 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                결제에 실패했습니다
              </h3>
              <p className="text-gray-600">
                {paymentResult?.error || '알 수 없는 오류가 발생했습니다.'}
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleCloseModal}
                className="flex-1"
              >
                다시 시도
              </Button>
              <Button
                onClick={() => router.push('/cart')}
                className="flex-1"
              >
                장바구니로
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
