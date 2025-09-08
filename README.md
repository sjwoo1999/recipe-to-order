# Recipe-to-Order

레시피 기반 주문 관리 시스템 (MVP)

## 개요

Recipe-to-Order는 레시피를 기반으로 재료를 상품과 매칭하여 주문을 관리하는 시스템입니다. 프론트엔드만으로 구현된 MVP 버전으로, Mock 데이터를 사용하여 전체 플로우를 시뮬레이션합니다.

## 주요 기능

### 1. 레시피 관리
- 레시피 등록/수정/삭제
- 인분별 재료량 자동 계산
- 재료별 대체명 및 메모 관리

### 2. 상품 매칭
- 재료명 기반 상품 자동 매칭
- 도매/소매/계약가 우선순위 정렬
- MOQ(최소 주문량) 및 포장 단위 보정

### 3. 장바구니 & 주문
- 매칭된 상품을 장바구니에 추가
- 수량 조절 및 배송 정보 설정
- 결제 시뮬레이션 및 주문 생성

### 4. 요금제 관리
- Basic/Standard/Premium 요금제
- 기능별 게이팅 (PlanGate)
- 사용량 통계 및 제한

## 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **UI Components**: Custom components with Tailwind

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── login/             # 로그인 페이지
│   ├── recipes/           # 레시피 관련 페이지
│   ├── cart/              # 장바구니 페이지
│   ├── checkout/          # 결제 페이지
│   ├── orders/            # 주문 내역 페이지
│   └── billing/           # 요금제 페이지
├── components/            # 재사용 가능한 컴포넌트
│   ├── ui/               # 기본 UI 컴포넌트
│   └── layout/           # 레이아웃 컴포넌트
├── stores/               # Zustand 상태 관리
├── adapters/             # Mock API 어댑터
├── data/                 # Mock 데이터
├── types/                # TypeScript 타입 정의
└── lib/                  # 유틸리티 함수
```

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

### 3. 브라우저에서 확인

[http://localhost:3000](http://localhost:3000)에서 애플리케이션을 확인할 수 있습니다.

## 사용 방법

### 1. 로그인
- 프리셋 계정으로 빠른 로그인 가능
- 김사장 (Owner) / 이직원 (Staff)

### 2. 레시피 관리
- `/recipes`에서 레시피 목록 확인
- "새 레시피" 버튼으로 레시피 생성
- 레시피 상세에서 인분 조절 및 상품 매칭

### 3. 주문 프로세스
- 레시피에서 "상품 매칭하기" 클릭
- 매칭된 상품을 장바구니에 추가
- 장바구니에서 수량 조절 후 주문

### 4. 요금제 관리
- `/billing`에서 현재 요금제 확인
- 기능별 업그레이드 옵션 제공

## 주요 비즈니스 로직

### 인분 환산
```typescript
환산량 = 기본량 × (선택 인분 / 기본 인분)
```

### 단위 변환
- 큰술: 15ml
- 티스푼: 5ml
- 개: 100g (평균)

### MOQ 보정
```typescript
실구매량 = max(환산량, MOQ) 후 packSize 단위 상향 반올림
```

### 매칭 우선순위
1. 도매 계약가
2. 도매 일반
3. 소매

## 개발 가이드

### 상태 관리
- Zustand를 사용한 전역 상태 관리
- 각 도메인별로 스토어 분리 (auth, recipe, catalog, cart, billing)

### 컴포넌트 구조
- UI 컴포넌트는 `src/components/ui/`에 위치
- 재사용 가능한 컴포넌트로 설계
- Tailwind CSS로 스타일링

### Mock 데이터
- `src/data/mock.ts`에 샘플 데이터 정의
- Adapter 패턴으로 API 추상화
- 지연 및 에러 시뮬레이션 포함

## 향후 개선 사항

- [ ] 실제 API 연동
- [ ] 사용자 인증 시스템
- [ ] 결제 시스템 연동
- [ ] 재고 관리 기능
- [ ] 다국어 지원
- [ ] 모바일 최적화
- [ ] 테스트 코드 추가

## 라이선스

MIT License
