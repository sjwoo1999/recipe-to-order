'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/stores/cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Trash2, Minus, Plus, Calendar, FileText } from 'lucide-react';
import { formatCurrency, UX_MESSAGES } from '@/lib/utils';

export default function CartPage() {
  const { cart, updateQuantity, removeItem, updateDeliveryDate, updateMemo, clearCart } = useCartStore();
  const [memo, setMemo] = useState(cart.memo || '');

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleMemoChange = (value: string) => {
    setMemo(value);
    updateMemo(value);
  };

  const handleDeliveryDateChange = (date: string) => {
    updateDeliveryDate(date);
  };

  if (cart.items.length === 0) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">장바구니</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">선택한 상품들을 확인하고 주문하세요</p>
        </div>
        
        <div className="text-center py-12 sm:py-16">
          <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <ShoppingCart className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">{UX_MESSAGES.empty.emptyCart.title}</h3>
          <p className="text-base text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">{UX_MESSAGES.empty.emptyCart.message}</p>
          <Link href="/recipes" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto">
              {UX_MESSAGES.empty.emptyCart.action}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">장바구니</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">선택한 상품들을 확인하고 주문하세요</p>
        </div>
        <Button
          variant="outline"
          onClick={clearCart}
          className="text-red-600 hover:text-red-700 w-full sm:w-auto"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          전체 삭제
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <Card key={item.productId}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">{item.displayName}</h3>
                    <div className="text-xs sm:text-sm text-gray-600 mt-1">
                      {item.packSize}{item.product.unit} • {item.product.supplierType}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      단가: {formatCurrency(item.unitPrice)}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end sm:space-x-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.productId, item.quantityPacks - 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium text-sm">
                        {item.quantityPacks}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.productId, item.quantityPacks + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    {/* Subtotal */}
                    <div className="text-right">
                      <div className="font-medium text-gray-900 text-sm sm:text-base">
                        {formatCurrency(item.subtotal)}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500">
                        {item.quantityPacks}개 × {formatCurrency(item.unitPrice)}
                      </div>
                    </div>
                    
                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.productId)}
                      className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>주문 요약</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Delivery Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  배송 희망일
                </label>
                <Input
                  type="date"
                  value={cart.deliveryDate || ''}
                  onChange={(e) => handleDeliveryDateChange(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Memo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="h-4 w-4 inline mr-1" />
                  주문 메모
                </label>
                <textarea
                  className="w-full h-20 px-3 py-2 border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:border-[#F76241] focus:outline-none focus:ring-2 focus:ring-[#F76241] focus:ring-offset-2"
                  placeholder="주문 시 참고사항을 입력하세요"
                  value={memo}
                  onChange={(e) => handleMemoChange(e.target.value)}
                />
              </div>

              {/* Totals */}
              <div className="space-y-2 pt-4 border-t border-gray-200">
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

              {/* Checkout Button */}
              <Link href="/checkout" className="block">
                <Button className="w-full" size="lg">
                  주문하기
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
