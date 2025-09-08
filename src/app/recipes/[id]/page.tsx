'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useRecipeStore } from '@/stores/recipe';
import { useCatalogStore } from '@/stores/catalog';
import { useCartStore } from '@/stores/cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ChefHat, Users, ShoppingCart, AlertTriangle } from 'lucide-react';
import { formatDate, formatCurrency, UX_MESSAGES } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToast();
  const recipeId = params.id as string;
  
  const { 
    currentRecipe, 
    currentServings, 
    scaledItems, 
    isLoading, 
    error, 
    loadRecipe, 
    setServings,
    clearCurrentRecipe 
  } = useRecipeStore();
  
  const { 
    matchResults, 
    isLoading: isMatching, 
    getMatchResults,
    selectProduct
  } = useCatalogStore();
  
  const { addToCart, isLoading: isAddingToCart } = useCartStore();
  
  const [showMatching, setShowMatching] = useState(false);

  useEffect(() => {
    if (recipeId) {
      loadRecipe(recipeId);
    }
    
    return () => {
      clearCurrentRecipe();
    };
  }, [recipeId, loadRecipe, clearCurrentRecipe]);

  const handleServingsChange = (servings: number) => {
    if (servings > 0) {
      setServings(servings);
    }
  };

  const handleMatchProducts = async () => {
    if (scaledItems.length === 0) return;
    
    setShowMatching(true);
    await getMatchResults(scaledItems);
  };

  const handleAddToCart = async () => {
    if (matchResults.length === 0) return;
    
    try {
      await addToCart(matchResults);
      addToast({
        type: 'success',
        title: '장바구니에 추가되었습니다',
        message: `${matchResults.length}개 재료가 장바구니에 추가되었습니다.`,
      });
    } catch (_error) {
      addToast({
        type: 'error',
        title: '장바구니 추가 실패',
        message: '장바구니에 추가하는데 실패했습니다.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error || !currentRecipe) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <ChefHat className="h-12 w-12 mx-auto mb-2" />
          <h3 className="text-lg font-medium">레시피를 찾을 수 없습니다</h3>
          <p className="text-sm text-gray-600 mt-1">
            {error?.message || '요청하신 레시피가 존재하지 않습니다.'}
          </p>
        </div>
        <Button onClick={() => router.push('/recipes')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          레시피 목록으로
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => router.push('/recipes')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          뒤로
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{currentRecipe.name}</h1>
          <p className="text-gray-600 mt-1">{currentRecipe.category}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recipe Info */}
        <Card>
          <CardHeader>
            <CardTitle>레시피 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-600">기본 인분: {currentRecipe.baseServings}인분</span>
            </div>
            <div className="flex items-center space-x-2">
              <ChefHat className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-600">재료 수: {currentRecipe.items.length}개</span>
            </div>
            <div className="text-sm text-gray-500">
              마지막 수정: {formatDate(currentRecipe.updatedAt)}
            </div>
          </CardContent>
        </Card>

        {/* Servings Control */}
        <Card>
          <CardHeader>
            <CardTitle>인분 조절</CardTitle>
            <CardDescription>
              {UX_MESSAGES.help.servingConversion}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">인분:</label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleServingsChange(currentServings - 1)}
                    disabled={currentServings <= 1}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-medium">{currentServings}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleServingsChange(currentServings + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
              
              <div className="pt-4">
                <Button
                  onClick={handleMatchProducts}
                  disabled={scaledItems.length === 0}
                  loading={isMatching}
                  className="w-full"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  상품 매칭하기
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ingredients List */}
      <Card>
        <CardHeader>
          <CardTitle>재료 목록</CardTitle>
          <CardDescription>
            {currentServings}인분 기준으로 계산된 재료량입니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scaledItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{item.name}</div>
                  {item.altNames.length > 0 && (
                    <div className="text-sm text-gray-500">
                      대체명: {item.altNames.join(', ')}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">
                    {item.scaledQty} {item.unit}
                  </div>
                  {item.scaledQty !== item.baseQty && (
                    <div className="text-sm text-gray-500">
                      기본: {item.baseQty} {item.unit}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Product Matching Results */}
      {showMatching && (
        <Card>
          <CardHeader>
            <CardTitle>상품 매칭 결과</CardTitle>
            <CardDescription>
              {UX_MESSAGES.help.productMatching}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isMatching ? (
              <div className="space-y-4">
                {Array.from({ length: scaledItems.length }).map((_, i) => (
                  <Skeleton key={i} className="h-32" />
                ))}
              </div>
            ) : matchResults.length > 0 ? (
              <div className="space-y-4">
                {matchResults.map((result, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{result.ingredientName}</h4>
                      <div className="text-sm text-gray-600">
                        필요량: {result.effectiveQty}g
                      </div>
                    </div>
                    
                    {result.candidates.length > 0 ? (
                      <div className="space-y-2">
                        {result.candidates.slice(0, 3).map((product) => (
                          <div
                            key={product.id}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                              result.selectedProductId === product.id
                                ? 'border-[#F76241] bg-[#F76241]/5'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => {
                              selectProduct(result.ingredientName, product.id);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-gray-900">
                                  {product.brand} {product.spec}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {product.supplierType} • {product.packSize}{product.unit} • 
                                  {formatCurrency(product.price)}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium text-gray-900">
                                  {formatCurrency(product.price)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  MOQ: {product.moq}{product.unit}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                        <p>매칭되는 상품을 찾을 수 없습니다</p>
                      </div>
                    )}
                    
                    {result.warning && (
                      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                        <AlertTriangle className="h-4 w-4 inline mr-1" />
                        {result.warning}
                      </div>
                    )}
                  </div>
                ))}
                
                <div className="pt-4 border-t border-gray-200">
                  <Button
                    onClick={handleAddToCart}
                    loading={isAddingToCart}
                    className="w-full"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    장바구니에 담기
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ChefHat className="h-12 w-12 mx-auto mb-4" />
                <p>상품 매칭 결과가 없습니다</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
