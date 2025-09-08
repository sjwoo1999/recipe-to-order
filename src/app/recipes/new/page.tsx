'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { useRecipeStore } from '@/stores/recipe';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, Trash2, ChefHat } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

interface RecipeItem {
  name: string;
  baseQty: number;
  unit: 'g' | 'ml' | '개' | '큰술' | '티스푼';
  altNames: string[];
  notes?: string;
}

export default function NewRecipePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { createRecipe, isLoading } = useRecipeStore();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    baseServings: 4,
  });

  const [items, setItems] = useState<RecipeItem[]>([
    { name: '', baseQty: 0, unit: 'g', altNames: [], notes: '' }
  ]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    setItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const addItem = () => {
    setItems(prev => [...prev, { name: '', baseQty: 0, unit: 'g', altNames: [], notes: '' }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    // Validate form
    if (!formData.name.trim()) {
      addToast({
        type: 'error',
        title: '레시피 이름을 입력해주세요',
      });
      return;
    }

    if (!formData.category.trim()) {
      addToast({
        type: 'error',
        title: '카테고리를 입력해주세요',
      });
      return;
    }

    const validItems = items.filter(item => item.name.trim() && item.baseQty > 0);
    if (validItems.length === 0) {
      addToast({
        type: 'error',
        title: '최소 하나의 재료를 입력해주세요',
      });
      return;
    }

    try {
      await createRecipe({
        storeId: user.storeId,
        name: formData.name.trim(),
        category: formData.category.trim(),
        baseServings: formData.baseServings,
        items: validItems.map(item => ({
          name: item.name.trim(),
          baseQty: item.baseQty,
          unit: item.unit,
          altNames: item.altNames.filter(name => name.trim()),
          notes: item.notes?.trim(),
        })),
      });

      addToast({
        type: 'success',
        title: '레시피가 생성되었습니다',
        message: `${formData.name} 레시피가 성공적으로 생성되었습니다.`,
      });

      router.push('/recipes');
    } catch (error) {
      addToast({
        type: 'error',
        title: '레시피 생성 실패',
        message: '레시피 생성에 실패했습니다.',
      });
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900">새 레시피</h1>
          <p className="text-gray-600 mt-1">새로운 레시피를 만들어보세요</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
            <CardDescription>
              레시피의 기본 정보를 입력하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="레시피 이름"
              placeholder="예: 김치찌개"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
            
            <Input
              label="카테고리"
              placeholder="예: 한식, 양식, 중식"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                기본 인분
              </label>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleInputChange('baseServings', Math.max(1, formData.baseServings - 1))}
                >
                  -
                </Button>
                <span className="w-12 text-center font-medium">{formData.baseServings}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleInputChange('baseServings', formData.baseServings + 1)}
                >
                  +
                </Button>
                <span className="text-sm text-gray-600">인분</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ingredients */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>재료 목록</CardTitle>
                <CardDescription>
                  레시피에 필요한 재료들을 추가하세요
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={addItem}
              >
                <Plus className="h-4 w-4 mr-2" />
                재료 추가
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        재료명
                      </label>
                      <Input
                        placeholder="예: 돼지고기"
                        value={item.name}
                        onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        양
                      </label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={item.baseQty || ''}
                        onChange={(e) => handleItemChange(index, 'baseQty', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.1"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        단위
                      </label>
                      <select
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-[#F76241] focus:outline-none focus:ring-2 focus:ring-[#F76241] focus:ring-offset-2"
                        value={item.unit}
                        onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                      >
                        <option value="g">g</option>
                        <option value="ml">ml</option>
                        <option value="개">개</option>
                        <option value="큰술">큰술</option>
                        <option value="티스푼">티스푼</option>
                      </select>
                    </div>
                    
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                        disabled={items.length === 1}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      대체명 (선택사항)
                    </label>
                    <Input
                      placeholder="예: 돼지목살, 삼겹살 (쉼표로 구분)"
                      value={item.altNames.join(', ')}
                      onChange={(e) => handleItemChange(index, 'altNames', e.target.value.split(',').map(name => name.trim()).filter(Boolean))}
                    />
                  </div>
                  
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      메모 (선택사항)
                    </label>
                    <Input
                      placeholder="예: 신선한 것으로 준비"
                      value={item.notes || ''}
                      onChange={(e) => handleItemChange(index, 'notes', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/recipes')}
          >
            취소
          </Button>
          <Button
            type="submit"
            loading={isLoading}
          >
            <ChefHat className="h-4 w-4 mr-2" />
            레시피 생성
          </Button>
        </div>
      </form>
    </div>
  );
}
