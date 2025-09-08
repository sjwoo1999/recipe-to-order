import { Product, ScaledItem, MatchResult, ApiError } from '@/types';
import { mockProducts, mockDelay, shouldInjectError } from '@/data/mock';
import { convertToStandardUnit, calculateEffectiveQuantity } from '@/lib/utils';

export class CatalogAdapter {
  private products: Product[] = [...mockProducts];

  async searchProducts(query: string, filters?: {
    category?: string;
    supplierType?: string;
    priceRange?: { min: number; max: number };
  }): Promise<Product[]> {
    await mockDelay(400);
    
    if (shouldInjectError(0.05)) {
      throw new ApiError('SEARCH_PRODUCTS_FAILED', '상품 검색에 실패했습니다.', true);
    }
    
    let results = this.products;
    
    // Text search
    if (query) {
      const searchTerms = query.toLowerCase().split(' ');
      results = results.filter(product => 
        searchTerms.some(term => 
          product.brand.toLowerCase().includes(term) ||
          product.spec.toLowerCase().includes(term) ||
          product.category?.toLowerCase().includes(term)
        )
      );
    }
    
    // Apply filters
    if (filters?.category) {
      results = results.filter(product => product.category === filters.category);
    }
    
    if (filters?.supplierType) {
      results = results.filter(product => product.supplierType === filters.supplierType);
    }
    
    if (filters?.priceRange) {
      results = results.filter(product => 
        product.price >= filters.priceRange!.min && 
        product.price <= filters.priceRange!.max
      );
    }
    
    // Sort by supplier type priority (계약가 > 도매 > 소매)
    const supplierPriority = { '계약가': 0, '도매': 1, '소매': 2 };
    results.sort((a, b) => supplierPriority[a.supplierType] - supplierPriority[b.supplierType]);
    
    return results;
  }

  async findProductsForIngredient(ingredient: ScaledItem): Promise<Product[]> {
    await mockDelay(300);
    
    if (shouldInjectError(0.05)) {
      throw new ApiError('FIND_PRODUCTS_FAILED', '재료에 맞는 상품을 찾는데 실패했습니다.', true);
    }
    
    const { unit: stdUnit } = convertToStandardUnit(ingredient.scaledQty, ingredient.unit);
    
    // Find products that match the ingredient name or alternative names
    const searchTerms = [ingredient.name, ...ingredient.altNames].map(term => term.toLowerCase());
    
    let candidates = this.products.filter(product => 
      searchTerms.some(term => 
        product.spec.toLowerCase().includes(term) ||
        product.brand.toLowerCase().includes(term) ||
        product.category?.toLowerCase().includes(term)
      )
    );
    
    // Filter by compatible units
    candidates = candidates.filter(product => {
      if (stdUnit === 'g' && ['g', 'kg'].includes(product.unit)) return true;
      if (stdUnit === 'ml' && ['ml', 'L'].includes(product.unit)) return true;
      if (stdUnit === '개' && product.unit === '개') return true;
      return false;
    });
    
    // Sort by supplier type priority
    const supplierPriority = { '계약가': 0, '도매': 1, '소매': 2 };
    candidates.sort((a, b) => supplierPriority[a.supplierType] - supplierPriority[b.supplierType]);
    
    return candidates.slice(0, 5); // Return top 5 candidates
  }

  async getMatchResults(ingredients: ScaledItem[]): Promise<MatchResult[]> {
    await mockDelay(600);
    
    if (shouldInjectError(0.05)) {
      throw new ApiError('GET_MATCH_RESULTS_FAILED', '매칭 결과를 가져오는데 실패했습니다.', true);
    }
    
    const results: MatchResult[] = [];
    
    for (const ingredient of ingredients) {
      const candidates = await this.findProductsForIngredient(ingredient);
      
      if (candidates.length > 0) {
        const bestMatch = candidates[0]; // Highest priority product
        const { effectiveQty, warning } = calculateEffectiveQuantity(
          ingredient.scaledQty,
          bestMatch.moq,
          bestMatch.packSize
        );
        
        results.push({
          ingredientName: ingredient.name,
          candidates,
          selectedProductId: bestMatch.id,
          effectiveQty,
          warning,
        });
      } else {
        results.push({
          ingredientName: ingredient.name,
          candidates: [],
          effectiveQty: ingredient.scaledQty,
          warning: '매칭되는 상품을 찾을 수 없습니다',
        });
      }
    }
    
    return results;
  }

  async getProduct(id: string): Promise<Product | null> {
    await mockDelay(200);
    
    if (shouldInjectError(0.05)) {
      throw new ApiError('GET_PRODUCT_FAILED', '상품 정보를 가져오는데 실패했습니다.', true);
    }
    
    return this.products.find(product => product.id === id) || null;
  }

  async getCategories(): Promise<string[]> {
    await mockDelay(200);
    
    if (shouldInjectError(0.05)) {
      throw new ApiError('GET_CATEGORIES_FAILED', '카테고리 목록을 가져오는데 실패했습니다.', true);
    }
    
    const categories = [...new Set(this.products.map(p => p.category).filter(Boolean))] as string[];
    return categories.sort();
  }

  async getSupplierTypes(): Promise<string[]> {
    await mockDelay(100);
    
    if (shouldInjectError(0.05)) {
      throw new ApiError('GET_SUPPLIER_TYPES_FAILED', '공급업체 유형을 가져오는데 실패했습니다.', true);
    }
    
    return ['계약가', '도매', '소매'];
  }
}

export const catalogAdapter = new CatalogAdapter();
