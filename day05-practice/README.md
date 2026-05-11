# Day 05 실습 프로젝트 — BookStore 검색·필터·정렬

## 실행 방법

```bash
npm install
npm run dev
```

→ http://localhost:5173

---

## 파일 구조

```
src/
├── App.jsx              ← cartCount state (Day 4와 동일)
├── components/
│   ├── Header.jsx
│   ├── Layout.jsx
│   ├── Footer.jsx
│   └── BookCard.jsx     ← category prop 추가
└── pages/
    └── Home.jsx         ← ✅ 오늘의 핵심: 검색·필터·정렬 + 불변성
```

---

## App.jsx 작성 순서

```
1. import       useState, Layout, Home
3. 컴포넌트 함수
   4. state     [cartCount, setCartCount]
   6. return    <Layout><Home /></Layout>
7. export
```

---

## 오늘의 핵심 개념 (Home.jsx)

### 1. 여러 state 선언
```jsx
const [cart,     setCart]     = useState([])
const [search,   setSearch]   = useState('')
const [category, setCategory] = useState('ALL')
const [sortBy,   setSortBy]   = useState('default')
```

### 2. 파생 데이터 — 별도 state 없이 계산
```jsx
// ✅ 렌더링 시 직접 계산 (setDisplayed 같은 state 불필요)
const displayed = books
  .filter(b => category === 'ALL' || b.category === category)
  .filter(b => b.title.includes(search) || b.author.includes(search))
  .sort((a, b) => sortBy === 'price-asc' ? a.price - b.price : ...)
```

### 3. 제어 컴포넌트 (Controlled Component)
```jsx
// value(state) + onChange(setter) 반드시 쌍으로 작성
<input
  value={search}
  onChange={e => setSearch(e.target.value)}
/>
<select
  value={sortBy}
  onChange={e => setSortBy(e.target.value)}
/>
```

### 4. 불변성 — 배열 수정 패턴
```jsx
// 추가
setCart([...cart, newItem])

// 수정 (qty +1)
setCart(cart.map(item =>
  item.id === id ? { ...item, qty: item.qty + 1 } : item
))

// 삭제
setCart(cart.filter(item => item.id !== id))
```

---

## 실습 포인트

| 기능 | 확인 방법 |
|------|----------|
| 검색 | 검색창에 "클린" 입력 → 즉시 필터링 |
| 카테고리 필터 | DEVICE 버튼 클릭 → 도서만 사라짐 |
| 정렬 | 가격 낮은 순 선택 → 재정렬 |
| 빈 결과 | "없는책" 검색 → 안내 메시지 |
| 조합 | BOOK + "김" 검색 → 교집합 필터 |
