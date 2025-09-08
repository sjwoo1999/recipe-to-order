import { Recipe, ApiError } from '@/types';
import { mockRecipes, mockDelay, shouldInjectError } from '@/data/mock';
import { generateId } from '@/lib/utils';

export class RecipesAdapter {
  private recipes: Recipe[] = [...mockRecipes];

  async getRecipes(storeId: string): Promise<Recipe[]> {
    await mockDelay(300);
    
    if (shouldInjectError(0.05)) {
      throw new ApiError('FETCH_RECIPES_FAILED', '레시피 목록을 불러오는데 실패했습니다.', true);
    }
    
    return this.recipes.filter(recipe => recipe.storeId === storeId);
  }

  async getRecipe(id: string): Promise<Recipe | null> {
    await mockDelay(200);
    
    if (shouldInjectError(0.05)) {
      throw new ApiError('FETCH_RECIPE_FAILED', '레시피를 불러오는데 실패했습니다.', true);
    }
    
    return this.recipes.find(recipe => recipe.id === id) || null;
  }

  async createRecipe(recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>): Promise<Recipe> {
    await mockDelay(500);
    
    if (shouldInjectError(0.1)) {
      throw new ApiError('CREATE_RECIPE_FAILED', '레시피 생성에 실패했습니다.', true);
    }
    
    const newRecipe: Recipe = {
      ...recipe,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    this.recipes.push(newRecipe);
    return newRecipe;
  }

  async updateRecipe(id: string, updates: Partial<Recipe>): Promise<Recipe> {
    await mockDelay(400);
    
    if (shouldInjectError(0.1)) {
      throw new ApiError('UPDATE_RECIPE_FAILED', '레시피 수정에 실패했습니다.', true);
    }
    
    const index = this.recipes.findIndex(recipe => recipe.id === id);
    if (index === -1) {
      throw new ApiError('RECIPE_NOT_FOUND', '레시피를 찾을 수 없습니다.', false);
    }
    
    this.recipes[index] = {
      ...this.recipes[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    return this.recipes[index];
  }

  async deleteRecipe(id: string): Promise<void> {
    await mockDelay(300);
    
    if (shouldInjectError(0.1)) {
      throw new ApiError('DELETE_RECIPE_FAILED', '레시피 삭제에 실패했습니다.', true);
    }
    
    const index = this.recipes.findIndex(recipe => recipe.id === id);
    if (index === -1) {
      throw new ApiError('RECIPE_NOT_FOUND', '레시피를 찾을 수 없습니다.', false);
    }
    
    this.recipes.splice(index, 1);
  }

  async importRecipes(recipes: Omit<Recipe, 'id' | 'storeId' | 'createdAt' | 'updatedAt'>[], storeId: string): Promise<Recipe[]> {
    await mockDelay(1000);
    
    if (shouldInjectError(0.15)) {
      throw new ApiError('IMPORT_RECIPES_FAILED', '레시피 가져오기에 실패했습니다.', true);
    }
    
    const importedRecipes: Recipe[] = recipes.map(recipe => ({
      ...recipe,
      id: generateId(),
      storeId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    
    this.recipes.push(...importedRecipes);
    return importedRecipes;
  }
}

export const recipesAdapter = new RecipesAdapter();
