import { User, Recipe, Product, Plan } from '@/types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: '김사장',
    role: 'Owner',
    storeId: 'store-1',
    plan: 'Standard',
  },
  {
    id: 'user-2',
    name: '이직원',
    role: 'Staff',
    storeId: 'store-1',
    plan: 'Standard',
  },
];

// Mock Recipes
export const mockRecipes: Recipe[] = [
  {
    id: 'recipe-1',
    storeId: 'store-1',
    name: '김치찌개',
    category: '한식',
    baseServings: 4,
    items: [
      { name: '돼지고기', baseQty: 200, unit: 'g', altNames: ['돼지목살', '삼겹살'] },
      { name: '김치', baseQty: 300, unit: 'g', altNames: ['신김치', '묵은지'] },
      { name: '두부', baseQty: 1, unit: '개', altNames: ['연두부', '부드러운두부'] },
      { name: '대파', baseQty: 2, unit: '개', altNames: ['파', '대파'] },
      { name: '고춧가루', baseQty: 2, unit: '큰술', altNames: ['고추가루'] },
      { name: '된장', baseQty: 1, unit: '큰술', altNames: ['된장'] },
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'recipe-2',
    storeId: 'store-1',
    name: '파스타',
    category: '양식',
    baseServings: 2,
    items: [
      { name: '스파게티면', baseQty: 200, unit: 'g', altNames: ['파스타면', '면'] },
      { name: '토마토소스', baseQty: 200, unit: 'ml', altNames: ['마리나라소스'] },
      { name: '올리브오일', baseQty: 2, unit: '큰술', altNames: ['엑스트라버진오일'] },
      { name: '마늘', baseQty: 3, unit: '개', altNames: ['다진마늘'] },
      { name: '파마산치즈', baseQty: 50, unit: 'g', altNames: ['치즈'] },
    ],
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
];

// Mock Products
export const mockProducts: Product[] = [
  // 돼지고기
  {
    id: 'prod-1',
    supplierType: '계약가',
    brand: '농협',
    spec: '목살',
    unit: 'g',
    packSize: 1000,
    moq: 500,
    price: 12000,
    leadTime: 1,
    category: '육류',
  },
  {
    id: 'prod-2',
    supplierType: '도매',
    brand: 'CJ',
    spec: '목살',
    unit: 'g',
    packSize: 500,
    moq: 200,
    price: 7000,
    leadTime: 2,
    category: '육류',
  },
  {
    id: 'prod-3',
    supplierType: '소매',
    brand: '이마트',
    spec: '목살',
    unit: 'g',
    packSize: 300,
    moq: 100,
    price: 4500,
    leadTime: 0,
    category: '육류',
  },
  // 김치
  {
    id: 'prod-4',
    supplierType: '계약가',
    brand: '종가집',
    spec: '포기김치',
    unit: 'g',
    packSize: 2000,
    moq: 1000,
    price: 15000,
    leadTime: 1,
    category: '김치',
  },
  {
    id: 'prod-5',
    supplierType: '도매',
    brand: '풀무원',
    spec: '포기김치',
    unit: 'g',
    packSize: 1000,
    moq: 500,
    price: 8000,
    leadTime: 2,
    category: '김치',
  },
  // 두부
  {
    id: 'prod-6',
    supplierType: '도매',
    brand: '대림',
    spec: '연두부',
    unit: '개',
    packSize: 20,
    moq: 10,
    price: 15000,
    leadTime: 1,
    category: '두부',
  },
  {
    id: 'prod-7',
    supplierType: '소매',
    brand: '이마트',
    spec: '연두부',
    unit: '개',
    packSize: 4,
    moq: 1,
    price: 3000,
    leadTime: 0,
    category: '두부',
  },
  // 대파
  {
    id: 'prod-8',
    supplierType: '도매',
    brand: '농산물직거래',
    spec: '대파',
    unit: '개',
    packSize: 50,
    moq: 20,
    price: 25000,
    leadTime: 1,
    category: '채소',
  },
  {
    id: 'prod-9',
    supplierType: '소매',
    brand: '이마트',
    spec: '대파',
    unit: '개',
    packSize: 5,
    moq: 1,
    price: 2500,
    leadTime: 0,
    category: '채소',
  },
  // 고춧가루
  {
    id: 'prod-10',
    supplierType: '도매',
    brand: '청정원',
    spec: '고춧가루',
    unit: 'g',
    packSize: 1000,
    moq: 500,
    price: 8000,
    leadTime: 2,
    category: '조미료',
  },
  {
    id: 'prod-11',
    supplierType: '소매',
    brand: '청정원',
    spec: '고춧가루',
    unit: 'g',
    packSize: 200,
    moq: 100,
    price: 2000,
    leadTime: 0,
    category: '조미료',
  },
  // 된장
  {
    id: 'prod-12',
    supplierType: '도매',
    brand: '청정원',
    spec: '된장',
    unit: 'g',
    packSize: 2000,
    moq: 1000,
    price: 12000,
    leadTime: 2,
    category: '조미료',
  },
  {
    id: 'prod-13',
    supplierType: '소매',
    brand: '청정원',
    spec: '된장',
    unit: 'g',
    packSize: 500,
    moq: 200,
    price: 3500,
    leadTime: 0,
    category: '조미료',
  },
];

// Mock Plans
export const mockPlans: Plan[] = [
  {
    name: 'Basic',
    features: {
      통합정산: false,
      다점포: false,
      추천AI: false,
      자동주문: false,
      고급분석: false,
    },
    price: 0,
  },
  {
    name: 'Standard',
    features: {
      통합정산: true,
      다점포: false,
      추천AI: true,
      자동주문: false,
      고급분석: false,
    },
    price: 50000,
  },
  {
    name: 'Premium',
    features: {
      통합정산: true,
      다점포: true,
      추천AI: true,
      자동주문: true,
      고급분석: true,
    },
    price: 100000,
  },
];

// Mock delay function for simulating API calls
export function mockDelay(ms: number = 500): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Mock error injection
export function shouldInjectError(errorRate: number = 0.1): boolean {
  return Math.random() < errorRate;
}
