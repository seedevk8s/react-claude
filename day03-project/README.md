# Day 03 — 컴포넌트 분리 설계

## 실행 방법

```bash
npm install
npm run dev
```

## 컴포넌트 트리

```
App
└── Layout                    ← layout/default.html
    ├── Header (props)        ← fragments/header.html
    ├── main
    │   └── ProductCard × 6  ← fragments/productCard.html
    └── Footer                ← fragments/footer.html
```

## Thymeleaf ↔ React 매핑 핵심

| Thymeleaf | React |
|-----------|-------|
| `layout/default.html` | `Layout.jsx` |
| `fragments/header.html` | `Header.jsx` |
| `fragments/footer.html` | `Footer.jsx` |
| `th:replace="~{fragments/...}"` | `<Header />` |
| `th:fragment="content"` (슬롯) | `{children}` props |
| `th:text="${product.name}"` | `{product.name}` |
| `model.addAttribute("products", list)` | `products` 배열 (나중에 API) |

## 파일 구조

```
src/
├── main.jsx
├── App.jsx                   ← 데이터 + 컴포넌트 조립
├── index.css
└── components/
    ├── Layout.jsx            ← 공통 레이아웃 (children 슬롯)
    ├── Header.jsx            ← 공통 헤더 (props: siteName, cartCount)
    ├── Footer.jsx            ← 공통 푸터
    └── ProductCard.jsx       ← 상품 카드 (props: product, onAddToCart)
```

## 학습 포인트

1. **단방향 데이터 흐름**: App → Layout → ProductCard (위에서 아래로만)
2. **props**: 부모가 자식에게 전달하는 읽기 전용 데이터
3. **children props**: Layout이 내부 콘텐츠를 슬롯으로 받는 방식
4. **컴포넌트 재사용**: ProductCard 하나로 N개의 카드를 렌더링
