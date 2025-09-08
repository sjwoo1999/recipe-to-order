import { create } from 'zustand';
import { Recipe, ScaledItem, LoadingState, ApiError } from '@/types';
import { recipesAdapter } from '@/adapters/recipes';
import { convertToStandardUnit } from '@/lib/utils';

interface RecipeState extends LoadingState {
  recipes: Recipe[];
  currentRecipe: Recipe | null;
  currentServings: number;
  scaledItems: ScaledItem[];
  
  // Actions
  loadRecipes: (storeId: string) => Promise<void>;
  loadRecipe: (id: string) => Promise<void>;
  createRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateRecipe: (id: string, updates: Partial<Recipe>) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
  setServings: (servings: number) => void;
  scaleIngredients: () => void;
  clearCurrentRecipe: () => void;
}

export const useRecipeStore = create<RecipeState>((set, get) => ({
  recipes: [],
  currentRecipe: null,
  currentServings: 4,
  scaledItems: [],
  isLoading: false,
  error: undefined,

  loadRecipes: async (storeId: string) => {
    set({ isLoading: true, error: undefined });
    
    try {
      const recipes = await recipesAdapter.getRecipes(storeId);
      set({ recipes, isLoading: false });
    } catch (error: unknown) {
      const apiError = error instanceof ApiError ? error : new ApiError('LOAD_RECIPES_FAILED', '레시피 목록을 불러오는데 실패했습니다.', true);
      set({
        isLoading: false,
        error: {
          code: apiError.code,
          message: apiError.message,
          retryable: apiError.retryable,
        },
      });
    }
  },

  loadRecipe: async (id: string) => {
    set({ isLoading: true, error: undefined });
    
    try {
      const recipe = await recipesAdapter.getRecipe(id);
      if (recipe) {
        set({
          currentRecipe: recipe,
          currentServings: recipe.baseServings,
          isLoading: false,
        });
        // Auto-scale ingredients when recipe is loaded
        get().scaleIngredients();
      } else {
        set({
          isLoading: false,
          error: {
            code: 'RECIPE_NOT_FOUND',
            message: '레시피를 찾을 수 없습니다.',
            retryable: false,
          },
        });
      }
    } catch (error: unknown) {
      const apiError = error instanceof ApiError ? error : new ApiError('LOAD_RECIPE_FAILED', '레시피를 불러오는데 실패했습니다.', true);
      set({
        isLoading: false,
        error: {
          code: apiError.code,
          message: apiError.message,
          retryable: apiError.retryable,
        },
      });
    }
  },

  createRecipe: async (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => {
    set({ isLoading: true, error: undefined });
    
    try {
      const newRecipe = await recipesAdapter.createRecipe(recipe);
      set(state => ({
        recipes: [...state.recipes, newRecipe],
        isLoading: false,
      }));
    } catch (error: unknown) {
      const apiError = error instanceof ApiError ? error : new ApiError('CREATE_RECIPE_FAILED', '레시피 생성에 실패했습니다.', true);
      set({
        isLoading: false,
        error: {
          code: apiError.code,
          message: apiError.message,
          retryable: apiError.retryable,
        },
      });
    }
  },

  updateRecipe: async (id: string, updates: Partial<Recipe>) => {
    set({ isLoading: true, error: undefined });
    
    try {
      const updatedRecipe = await recipesAdapter.updateRecipe(id, updates);
      set(state => ({
        recipes: state.recipes.map(r => r.id === id ? updatedRecipe : r),
        currentRecipe: state.currentRecipe?.id === id ? updatedRecipe : state.currentRecipe,
        isLoading: false,
      }));
    } catch (error: unknown) {
      const apiError = error instanceof ApiError ? error : new ApiError('UPDATE_RECIPE_FAILED', '레시피 수정에 실패했습니다.', true);
      set({
        isLoading: false,
        error: {
          code: apiError.code,
          message: apiError.message,
          retryable: apiError.retryable,
        },
      });
    }
  },

  deleteRecipe: async (id: string) => {
    set({ isLoading: true, error: undefined });
    
    try {
      await recipesAdapter.deleteRecipe(id);
      set(state => ({
        recipes: state.recipes.filter(r => r.id !== id),
        currentRecipe: state.currentRecipe?.id === id ? null : state.currentRecipe,
        isLoading: false,
      }));
    } catch (error: unknown) {
      const apiError = error instanceof ApiError ? error : new ApiError('DELETE_RECIPE_FAILED', '레시피 삭제에 실패했습니다.', true);
      set({
        isLoading: false,
        error: {
          code: apiError.code,
          message: apiError.message,
          retryable: apiError.retryable,
        },
      });
    }
  },

  setServings: (servings: number) => {
    set({ currentServings: servings });
    get().scaleIngredients();
  },

  scaleIngredients: () => {
    const { currentRecipe, currentServings } = get();
    
    if (!currentRecipe) {
      set({ scaledItems: [] });
      return;
    }
    
    const scaleRatio = currentServings / currentRecipe.baseServings;
    
    const scaledItems: ScaledItem[] = currentRecipe.items.map(item => {
      const scaledQty = Math.round(item.baseQty * scaleRatio * 100) / 100; // Round to 2 decimal places
      const { unit: stdUnit } = convertToStandardUnit(scaledQty, item.unit);
      
      return {
        ...item,
        scaledQty,
        stdUnit: stdUnit as 'g' | 'ml' | '개',
      };
    });
    
    set({ scaledItems });
  },

  clearCurrentRecipe: () => {
    set({
      currentRecipe: null,
      currentServings: 4,
      scaledItems: [],
      error: undefined,
    });
  },
}));
