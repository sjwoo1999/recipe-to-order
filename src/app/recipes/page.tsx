'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth';
import { useRecipeStore } from '@/stores/recipe';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SkeletonCard } from '@/components/ui/skeleton';
import { Plus, ChefHat, Users, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function RecipesPage() {
  const { user } = useAuthStore();
  const { recipes, isLoading, error, loadRecipes } = useRecipeStore();

  useEffect(() => {
    if (user) {
      loadRecipes(user.storeId);
    }
  }, [user, loadRecipes]);

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">레시피</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">등록된 레시피를 관리하세요</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
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
          <ChefHat className="h-12 w-12 mx-auto mb-2" />
          <h3 className="text-lg font-medium">레시피를 불러올 수 없습니다</h3>
          <p className="text-sm text-gray-600 mt-1">{error.message}</p>
        </div>
        <Button onClick={() => user && loadRecipes(user.storeId)}>
          다시 시도
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">레시피</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">등록된 레시피를 관리하세요</p>
        </div>
        <Link href="/recipes/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            새 레시피
          </Button>
        </Link>
      </div>

      {/* Recipes Grid */}
      {recipes.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">레시피가 없습니다</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6">첫 번째 레시피를 만들어보세요</p>
          <Link href="/recipes/new" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              새 레시피 만들기
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {recipes.map((recipe) => (
            <Link key={recipe.id} href={`/recipes/${recipe.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base sm:text-lg truncate">{recipe.name}</CardTitle>
                      <CardDescription className="mt-1 text-xs sm:text-sm">
                        {recipe.category}
                      </CardDescription>
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-gray-500">
                      <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      {recipe.baseServings}인분
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                      <ChefHat className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                      {recipe.items.length}개 재료
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-gray-500">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{formatDate(recipe.updatedAt)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
