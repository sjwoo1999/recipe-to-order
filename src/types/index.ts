// Core domain types for Recipe-to-Order app

export type UserRole = 'Owner' | 'Staff';
export type PlanType = 'Basic' | 'Standard' | 'Premium';
export type SupplierType = '도매' | '소매' | '계약가';
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  storeId: string;
  plan: PlanType;
}

export interface Recipe {
  id: string;
  storeId: string;
  name: string;
  category: string;
  baseServings: number;
  items: RecipeItem[];
  createdAt: string;
  updatedAt: string;
}

export interface RecipeItem {
  name: string;
  baseQty: number;
  unit: 'g' | 'ml' | '개' | '큰술' | '티스푼';
  altNames: string[];
  notes?: string;
}

export interface ScaledItem {
  name: string;
  baseQty: number;
  scaledQty: number;
  unit: 'g' | 'ml' | '개' | '큰술' | '티스푼';
  stdUnit: 'g' | 'ml' | '개';
  altNames: string[];
  notes?: string;
}

export interface Product {
  id: string;
  supplierType: SupplierType;
  brand: string;
  spec: string;
  unit: 'g' | 'ml' | '개' | 'kg' | 'L';
  packSize: number;
  moq: number;
  price: number;
  leadTime: number; // days
  category?: string;
}

export interface MatchResult {
  ingredientName: string;
  candidates: Product[];
  selectedProductId?: string;
  effectiveQty: number; // MOQ 보정 후
  warning?: string;
}

export interface CartItem {
  productId: string;
  displayName: string;
  packSize: number;
  unitPrice: number;
  quantityPacks: number;
  subtotal: number;
  product: Product;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shippingFee: number;
  total: number;
  deliveryDate?: string;
  memo?: string;
}

export interface Order {
  id: string;
  cartSnapshot: Cart;
  status: OrderStatus;
  invoiceNo: string;
  trackingNo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Plan {
  name: PlanType;
  features: {
    통합정산: boolean;
    다점포: boolean;
    추천AI: boolean;
    자동주문: boolean;
    고급분석: boolean;
  };
  price: number;
}

export interface ApiError {
  code: string;
  message: string;
  retryable: boolean;
}

export interface LoadingState {
  isLoading: boolean;
  error?: ApiError;
}
