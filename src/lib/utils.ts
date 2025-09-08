import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Unit conversion utilities
export const UNIT_CONVERSIONS = {
  '큰술': 15, // ml
  '티스푼': 5, // ml
  '개': 1, // 기본 단위 (평균 100g)
} as const;

export function convertToStandardUnit(qty: number, unit: string): { qty: number; unit: string } {
  switch (unit) {
    case '큰술':
      return { qty: qty * UNIT_CONVERSIONS.큰술, unit: 'ml' };
    case '티스푼':
      return { qty: qty * UNIT_CONVERSIONS.티스푼, unit: 'ml' };
    case '개':
      return { qty: qty * 100, unit: 'g' }; // 평균 100g
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
