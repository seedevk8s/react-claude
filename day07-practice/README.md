# Day 07 실습 프로젝트 — BookStore React Router

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
├── App.jsx            ← ✅ BrowserRouter + Routes + Route 구성
├── mockData.js        ← Mock 데이터 (Day 8에서 API로 교체)
├── components/
│   ├── Header.jsx     ← Link 사용 (a 태그 대체)
│   ├── Layout.jsx     ← Outlet 사용 ({children} 대체)
│   └── Footer.jsx
└── pages/
    ├── Home.jsx       ← 도서 목록 + navigate로 상세 이동
    ├── BookDetail.jsx ← useParams + useNavigate 핵심 실습
    ├── CartPage.jsx   ← 장바구니 페이지
    └── NotFound.jsx   ← 404 처리
```

---

## App.jsx 작성 순서

```
1. import   useState, BrowserRouter/Routes/Route, Layout/Home/BookDetail/CartPage/NotFound
2. 데이터   없음 (mockData.js에서 import)
3. 컴포넌트
   4. state   cart (여러 페이지가 공유하므로 App이 보유)
   5. 핸들러  handleAddToCart, handleIncrease, handleDecrease, ...
   6. return  <BrowserRouter><Routes>...<Routes/></BrowserRouter>
7. export
```

---

## 오늘의 핵심 개념

### Route 구성
```jsx
<BrowserRouter>
  <Routes>
    <Route element={<Layout />}>        // 레이아웃 라우트
      <Route path="/" element={<Home />} />
      <Route path="/books/:id" element={<BookDetail />} />
      <Route path="/cart" element={<CartPage />} />
    </Route>
    <Route path="*" element={<NotFound />} />  // 404
  </Routes>
</BrowserRouter>
```

### Link vs a 태그
```jsx
// ✅ Link: 서버 요청 없음
<Link to="/books">도서 목록</Link>

// ❌ a 태그: 서버 요청 발생 → SPA 특성 깨짐
<a href="/books">도서 목록</a>
```

### useNavigate
```jsx
const navigate = useNavigate()
navigate('/books/1')   // 이동
navigate(-1)           // 뒤로가기
```

### useParams
```jsx
// Route: path="/books/:id"
// URL: /books/3
const { id } = useParams()    // "3" (문자열!)
fetchBook(Number(id))          // 숫자 변환 필수
```

### Outlet (레이아웃 라우트)
```jsx
// Layout.jsx: {children} → <Outlet /> 으로 교체
import { Outlet } from 'react-router-dom'
<main><Outlet /></main>
```

---

## 확인 포인트

| 기능 | URL | 확인 방법 |
|------|-----|----------|
| 홈 | `/` | 도서 목록 표시 |
| 상세 | `/books/1` | 도서 상세 표시, URL에 id 확인 |
| 장바구니 | `/cart` | 담은 도서 목록 |
| 404 | `/없는경로` | 404 페이지 표시 |
| 뒤로가기 | 상세에서 ← 클릭 | 이전 페이지로 이동 |
