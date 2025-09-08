import { create } from 'zustand';
import { Cart, CartItem, Product, MatchResult, LoadingState } from '@/types';
import { catalogAdapter } from '@/adapters/catalog';
import { calculateCartTotals } from '@/lib/utils';

interface CartState extends LoadingState {
  cart: Cart;
  
  // Actions
  addToCart: (matchResults: MatchResult[]) => Promise<void>;
  updateQuantity: (productId: string, quantityPacks: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  updateDeliveryDate: (date: string) => void;
  updateMemo: (memo: string) => void;
  recalculateTotals: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: {
    items: [],
    subtotal: 0,
    tax: 0,
    shippingFee: 3000,
    total: 3000,
  },
  isLoading: false,
  error: undefined,

  addToCart: async (matchResults: MatchResult[]) => {
    set({ isLoading: true, error: undefined });
    
    try {
      const { cart } = get();
      const newItems: CartItem[] = [];
      
      for (const result of matchResults) {
        if (!result.selectedProductId || result.candidates.length === 0) {
          continue;
        }
        
        const product = await catalogAdapter.getProduct(result.selectedProductId);
        if (!product) continue;
        
        // Calculate quantity packs needed
        const quantityPacks = Math.ceil(result.effectiveQty / product.packSize);
        const subtotal = quantityPacks * product.price;
        
        // Check if item already exists in cart
        const existingItemIndex = cart.items.findIndex(item => item.productId === product.id);
        
        if (existingItemIndex >= 0) {
          // Update existing item
          const existingItem = cart.items[existingItemIndex];
          const newQuantityPacks = existingItem.quantityPacks + quantityPacks;
          const newSubtotal = newQuantityPacks * product.price;
          
          cart.items[existingItemIndex] = {
            ...existingItem,
            quantityPacks: newQuantityPacks,
            subtotal: newSubtotal,
          };
        } else {
          // Add new item
          newItems.push({
            productId: product.id,
            displayName: `${product.brand} ${product.spec}`,
            packSize: product.packSize,
            unitPrice: product.price,
            quantityPacks,
            subtotal,
            product,
          });
        }
      }
      
      const updatedCart = {
        ...cart,
        items: [...cart.items, ...newItems],
      };
      
      // Recalculate totals
      const totals = calculateCartTotals(updatedCart.items);
      
      set({
        cart: {
          ...updatedCart,
          ...totals,
        },
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: {
          code: error.code || 'ADD_TO_CART_FAILED',
          message: error.message || '장바구니에 추가하는데 실패했습니다.',
          retryable: error.retryable ?? true,
        },
      });
    }
  },

  updateQuantity: (productId: string, quantityPacks: number) => {
    const { cart } = get();
    
    if (quantityPacks <= 0) {
      get().removeItem(productId);
      return;
    }
    
    const updatedItems = cart.items.map(item => {
      if (item.productId === productId) {
        return {
          ...item,
          quantityPacks,
          subtotal: quantityPacks * item.unitPrice,
        };
      }
      return item;
    });
    
    const totals = calculateCartTotals(updatedItems);
    
    set({
      cart: {
        ...cart,
        items: updatedItems,
        ...totals,
      },
    });
  },

  removeItem: (productId: string) => {
    const { cart } = get();
    
    const updatedItems = cart.items.filter(item => item.productId !== productId);
    const totals = calculateCartTotals(updatedItems);
    
    set({
      cart: {
        ...cart,
        items: updatedItems,
        ...totals,
      },
    });
  },

  clearCart: () => {
    set({
      cart: {
        items: [],
        subtotal: 0,
        tax: 0,
        shippingFee: 3000,
        total: 3000,
      },
    });
  },

  updateDeliveryDate: (date: string) => {
    set(state => ({
      cart: {
        ...state.cart,
        deliveryDate: date,
      },
    }));
  },

  updateMemo: (memo: string) => {
    set(state => ({
      cart: {
        ...state.cart,
        memo,
      },
    }));
  },

  recalculateTotals: () => {
    const { cart } = get();
    const totals = calculateCartTotals(cart.items);
    
    set(state => ({
      cart: {
        ...state.cart,
        ...totals,
      },
    }));
  },
}));
