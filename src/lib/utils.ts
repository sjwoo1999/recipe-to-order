import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Unit conversion utilities
export const UNIT_CONVERSIONS = {
  '큰술': 15, // ml (액체 기준)
  '티스푼': 5, // ml (액체 기준)
  '개': 1, // 기본 단위
} as const;

// 재료별 평균 무게 (g)
export const INGREDIENT_WEIGHTS = {
  '두부': 300, // 두부 1개 = 300g
  '대파': 50, // 대파 1개 = 50g
  '마늘': 5, // 마늘 1개 = 5g
  '고춧가루': 3, // 고춧가루 1큰술 = 3g
  '된장': 15, // 된장 1큰술 = 15g
  '올리브오일': 15, // 올리브오일 1큰술 = 15ml
  '토마토소스': 15, // 토마토소스 1큰술 = 15ml
} as const;

export function convertToStandardUnit(qty: number, unit: string, ingredientName?: string): { qty: number; unit: string } {
  switch (unit) {
    case '큰술':
      // 재료에 따라 g 또는 ml로 변환
      if (ingredientName && INGREDIENT_WEIGHTS[ingredientName as keyof typeof INGREDIENT_WEIGHTS]) {
        return { qty: qty * INGREDIENT_WEIGHTS[ingredientName as keyof typeof INGREDIENT_WEIGHTS], unit: 'g' };
      }
      // 기본적으로 ml로 변환 (액체 기준)
      return { qty: qty * UNIT_CONVERSIONS.큰술, unit: 'ml' };
    case '티스푼':
      return { qty: qty * UNIT_CONVERSIONS.티스푼, unit: 'ml' };
    case '개':
      // 재료에 따라 다른 무게 적용
      if (ingredientName && INGREDIENT_WEIGHTS[ingredientName as keyof typeof INGREDIENT_WEIGHTS]) {
        return { qty: qty * INGREDIENT_WEIGHTS[ingredientName as keyof typeof INGREDIENT_WEIGHTS], unit: 'g' };
      }
      // 기본값: 100g
      return { qty: qty * 100, unit: 'g' };
    default:
      return { qty, unit };
  }
}

// MOQ and pack size calculations
export function calculateEffectiveQuantity(scaledQty: number, moq: number, packSize: number): {
  effectiveQty: number;
  quantityPacks: number;
  warning?: string;
} {
  const minQty = Math.max(scaledQty, moq);
  const quantityPacks = Math.ceil(minQty / packSize);
  const effectiveQty = quantityPacks * packSize;
  
  let warning: string | undefined;
  if (scaledQty < moq) {
    warning = `최소 주문량(${moq}) 미달로 자동 조정됨`;
  } else if (effectiveQty > scaledQty) {
    warning = `포장 단위로 인해 ${effectiveQty - scaledQty}만큼 초과 주문됨`;
  }
  
  return { effectiveQty, quantityPacks, warning };
}

// Price calculations
export function calculateCartTotals(items: Array<{ subtotal: number }>, taxRate = 0.1, shippingFee = 3000): {
  subtotal: number;
  tax: number;
  shippingFee: number;
  total: number;
} {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = Math.round(subtotal * taxRate);
  const total = subtotal + tax + shippingFee;
  
  return { subtotal, tax, shippingFee, total };
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount);
}

// Generate mock IDs
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Date utilities
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

// Plan feature checking
export function hasFeature(plan: string, feature: string): boolean {
  const planFeatures: Record<string, Record<string, boolean>> = {
    Basic: {
      통합정산: false,
      다점포: false,
      추천AI: false,
      자동주문: false,
      고급분석: false,
    },
    Standard: {
      통합정산: true,
      다점포: false,
      추천AI: true,
      자동주문: false,
      고급분석: false,
    },
    Premium: {
      통합정산: true,
      다점포: true,
      추천AI: true,
      자동주문: true,
      고급분석: true,
    },
  };
  
  return planFeatures[plan]?.[feature] ?? false;
}

// UX Writing utilities
export const UX_MESSAGES = {
  // Success messages
  success: {
    recipeCreated: {
      title: '🎉 레시피가 성공적으로 저장되었습니다!',
      message: '새로운 레시피를 메뉴에서 확인하실 수 있습니다.'
    },
    recipeUpdated: {
      title: '✅ 레시피가 업데이트되었습니다!',
      message: '변경사항이 모두 저장되었습니다.'
    },
    recipeDeleted: {
      title: '🗑️ 레시피가 삭제되었습니다',
      message: '레시피가 영구적으로 삭제되었습니다.'
    },
    itemAddedToCart: {
      title: '🛒 장바구니에 추가되었습니다!',
      message: '선택하신 상품이 장바구니에 담겼습니다.'
    },
    orderPlaced: {
      title: '🎊 주문이 완료되었습니다!',
      message: '주문이 성공적으로 접수되었습니다. 곧 연락드리겠습니다.'
    },
    planUpgraded: {
      title: '🚀 요금제가 업그레이드되었습니다!',
      message: '새로운 기능들을 사용하실 수 있습니다.'
    }
  },
  
  // Error messages
  error: {
    networkError: {
      title: '⚠️ 연결에 문제가 발생했습니다',
      message: '인터넷 연결을 확인하고 다시 시도해주세요.'
    },
    saveFailed: {
      title: '❌ 저장에 실패했습니다',
      message: '잠시 후 다시 시도해주세요. 문제가 계속되면 고객센터에 문의해주세요.'
    },
    loadFailed: {
      title: '📱 데이터를 불러올 수 없습니다',
      message: '페이지를 새로고침하거나 잠시 후 다시 시도해주세요.'
    },
    validationError: {
      title: '📝 입력 정보를 확인해주세요',
      message: '모든 필수 항목을 올바르게 입력해주세요.'
    }
  },
  
  // Info messages
  info: {
    featureLocked: {
      title: '🔒 이 기능은 Premium 요금제에서 사용 가능합니다',
      message: '더 많은 기능을 사용하려면 요금제를 업그레이드해보세요.'
    },
    noResults: {
      title: '🔍 검색 결과가 없습니다',
      message: '다른 검색어로 시도해보시거나 필터를 조정해보세요.'
    },
    comingSoon: {
      title: '🚧 곧 출시될 기능입니다',
      message: '더 나은 서비스를 위해 열심히 개발 중입니다.'
    }
  },
  
  // Empty state messages
  empty: {
    noRecipes: {
      title: '📝 아직 등록된 레시피가 없습니다',
      message: '첫 번째 레시피를 만들어보세요! 쉽고 간단하게 시작할 수 있습니다.',
      action: '새 레시피 만들기'
    },
    noOrders: {
      title: '📦 아직 주문 내역이 없습니다',
      message: '레시피에서 상품을 선택하고 주문해보세요.',
      action: '레시피 보러가기'
    },
    emptyCart: {
      title: '🛒 장바구니가 비어있습니다',
      message: '맛있는 요리를 위한 재료들을 장바구니에 담아보세요.',
      action: '레시피 보러가기'
    },
    noProducts: {
      title: '📦 매칭되는 상품이 없습니다',
      message: '다른 재료로 시도해보거나 수동으로 상품을 검색해보세요.',
      action: '상품 검색하기'
    }
  },
  
  // Help messages
  help: {
    recipeCreation: '레시피 이름과 기본 인분수를 입력하고, 필요한 재료들을 추가해주세요.',
    servingConversion: '인분수를 변경하면 재료량이 자동으로 계산됩니다.',
    productMatching: '재료에 맞는 상품을 자동으로 찾아드립니다. 다른 상품을 원하시면 선택하실 수 있습니다.',
    cartManagement: '장바구니에서 수량을 조정하거나 상품을 제거할 수 있습니다.',
    orderProcess: '배송일과 메모를 입력하고 주문을 완료하세요.'
  }
};

// Helper function to get friendly error messages
export function getFriendlyErrorMessage(error: unknown): { title: string; message: string } {
  // Type guard for error objects with code property
  if (error && typeof error === 'object' && 'code' in error) {
    const errorWithCode = error as { code: string };
    
    if (errorWithCode.code === 'NETWORK_ERROR') {
      return UX_MESSAGES.error.networkError;
    }
    if (errorWithCode.code.includes('SAVE')) {
      return UX_MESSAGES.error.saveFailed;
    }
    if (errorWithCode.code.includes('LOAD')) {
      return UX_MESSAGES.error.loadFailed;
    }
    if (errorWithCode.code.includes('VALIDATION')) {
      return UX_MESSAGES.error.validationError;
    }
  }
  
  // Default error message
  return {
    title: '⚠️ 문제가 발생했습니다',
    message: '잠시 후 다시 시도해주세요. 문제가 계속되면 고객센터에 문의해주세요.'
  };
}
