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
