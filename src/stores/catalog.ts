import { create } from 'zustand';
import { Product, ScaledItem, MatchResult, LoadingState, ApiError } from '@/types';
import { catalogAdapter } from '@/adapters/catalog';

interface CatalogState extends LoadingState {
  products: Product[];
  matchResults: MatchResult[];
  searchResults: Product[];
  categories: string[];
  supplierTypes: string[];
  
  // Actions
  searchProducts: (query: string, filters?: {
    category?: string;
    supplierType?: string;
    priceRange?: { min: number; max: number };
  }) => Promise<void>;
  getMatchResults: (ingredients: ScaledItem[]) => Promise<void>;
  selectProduct: (ingredientName: string, productId: string) => void;
  getCategories: () => Promise<void>;
  getSupplierTypes: () => Promise<void>;
  clearSearchResults: () => void;
  clearMatchResults: () => void;
}

export const useCatalogStore = create<CatalogState>((set) => ({
  products: [],
  matchResults: [],
  searchResults: [],
  categories: [],
  supplierTypes: [],
  isLoading: false,
  error: undefined,

  searchProducts: async (query: string, filters) => {
    set({ isLoading: true, error: undefined });
    
    try {
      const results = await catalogAdapter.searchProducts(query, filters);
      set({ searchResults: results, isLoading: false });
    } catch (error: unknown) {
      const apiError = error instanceof ApiError ? error : new ApiError('SEARCH_PRODUCTS_FAILED', '상품 검색에 실패했습니다.', true);
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

  getMatchResults: async (ingredients: ScaledItem[]) => {
    set({ isLoading: true, error: undefined });
    
    try {
      const results = await catalogAdapter.getMatchResults(ingredients);
      set({ matchResults: results, isLoading: false });
    } catch (error: unknown) {
      const apiError = error instanceof ApiError ? error : new ApiError('GET_MATCH_RESULTS_FAILED', '매칭 결과를 가져오는데 실패했습니다.', true);
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

  selectProduct: (ingredientName: string, productId: string) => {
    set(state => ({
      matchResults: state.matchResults.map(result => 
        result.ingredientName === ingredientName
          ? { ...result, selectedProductId: productId }
          : result
      ),
    }));
  },

  getCategories: async () => {
    set({ isLoading: true, error: undefined });
    
    try {
      const categories = await catalogAdapter.getCategories();
      set({ categories, isLoading: false });
    } catch (error: unknown) {
      const apiError = error instanceof ApiError ? error : new ApiError('GET_CATEGORIES_FAILED', '카테고리 목록을 가져오는데 실패했습니다.', true);
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

  getSupplierTypes: async () => {
    set({ isLoading: true, error: undefined });
    
    try {
      const supplierTypes = await catalogAdapter.getSupplierTypes();
      set({ supplierTypes, isLoading: false });
    } catch (error: unknown) {
      const apiError = error instanceof ApiError ? error : new ApiError('GET_SUPPLIER_TYPES_FAILED', '공급업체 유형을 가져오는데 실패했습니다.', true);
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

  clearSearchResults: () => {
    set({ searchResults: [] });
  },

  clearMatchResults: () => {
    set({ matchResults: [] });
  },
}));
