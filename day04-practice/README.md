# Day 04 실습 프로젝트 — BookStore 장바구니 (useState + 이벤트 처리)

## 실행 방법

```bash
npm install
npm run dev
```

→ 브라우저에서 http://localhost:5173 접속

---

## 파일 구조

```
src/
├── App.jsx                  ← cartCount state 관리 (헤더 뱃지용)
├── components/
│   ├── Header.jsx           ← cartCount prop 받아서 뱃지 표시
│   ├── Footer.jsx
│   ├── Layout.jsx           ← cartCount → Header 로 전달
│   └── BookCard.jsx         ← onAddToCart 이벤트 핸들러 prop 추가
└── pages/
    └── Home.jsx             ← ✅ 오늘의 핵심: useState + 이벤트 핸들러
```

---

## App.jsx 작성 순서

```
1. import       useState, Layout, Home
2. 데이터       (없음 — 데이터는 pages/Home.jsx 가 보유)
3. 컴포넌트 함수
   4. state     const [cartCount, setCartCount] = useState(0)
   6. return    <Layout><Home /></Layout>
7. export
```

---

## 오늘의 핵심 개념

### useState 선언
```jsx
// const [읽는값, 바꾸는함수] = useState(초기값)
const [cart, setCart] = useState([])
const [cartCount, setCartCount] = useState(0)
```

### ⚠️ state 는 직접 수정하면 화면이 갱신되지 않는다
```jsx
// ❌ 잘못된 방식 — 화면 갱신 안 됨
cart.push(newItem)

// ✅ 올바른 방식 — 새 배열로 교체해야 갱신됨
setCart([...cart, newItem])
```

### 이벤트 핸들러 onClick
```jsx
// ❌ 잘못된 방식 — 렌더링 즉시 실행됨
<button onClick={handleAddToCart(book.id)}>담기</button>

// ✅ 올바른 방식 — 클릭할 때만 실행됨
<button onClick={() => handleAddToCart(book.id)}>담기</button>

// ✅ 인자가 없으면 함수 참조만 넘겨도 됨
<button onClick={handleClearCart}>비우기</button>
```

### 배열 state 업데이트 패턴
```jsx
// 추가
setCart([...cart, newItem])

// 수정 (특정 항목만)
setCart(cart.map(item =>
  item.id === targetId ? { ...item, qty: item.qty + 1 } : item
))

// 삭제
setCart(cart.filter(item => item.id !== targetId))
```

### 상태 끌어올리기 (Lifting State Up)
```
App         ← cartCount state 보유 (Header + Home 이 공유하므로)
├── Layout
│   └── Header  ← cartCount prop 받아서 뱃지 표시 (읽기만)
└── Home        ← onCartChange prop 받아서 변경 요청 (쓰기만)
```

---

## Thymeleaf ↔ React 매핑

| Thymeleaf | React |
|-----------|-------|
| 서버 세션에 장바구니 저장 | `useState` 로 컴포넌트 안에서 관리 |
| `<form method="post">` 로 서버 요청 | `onClick` 핸들러로 state 변경 |
| 서버 → 새 HTML 전송 → 화면 갱신 | state 변경 → React 자동 리렌더링 |
| `th:text="${cart.size()}"` | `{cart.length}` |
