# Day 7 — React Router + 페이지 라우팅

## 학습 목표
- React Router의 동작 원리와 SPA 라우팅 개념을 설명할 수 있다
- `BrowserRouter`, `Routes`, `Route`로 페이지를 구성할 수 있다
- `Link`, `useNavigate`로 페이지를 이동할 수 있다
- `useParams`로 URL 파라미터를 읽을 수 있다
- 중첩 라우트와 레이아웃 라우트를 구성할 수 있다

---

## 1. SPA 라우팅 — Thymeleaf와의 차이

### 1-1. Thymeleaf 방식 (MPA)

```
URL 변경 (/books → /books/1)
    → 서버로 새 GET 요청
    → @GetMapping("/books/{id}")
    → 새 HTML 완성 → 전송
    → 브라우저 전체 새로고침
```

### 1-2. React Router 방식 (SPA)

```
URL 변경 (/books → /books/1)
    → 서버 요청 없음
    → React Router가 URL 감지
    → 해당 컴포넌트로 교체 (화면 일부만 변경)
    → 새로고침 없음 ✅
```

### 1-3. 매핑 정리

| Thymeleaf / Spring MVC | React Router |
|------------------------|--------------|
| `@GetMapping("/books")` | `<Route path="/books" element={<Home />} />` |
| `@GetMapping("/books/{id}")` | `<Route path="/books/:id" element={<BookDetail />} />` |
| `<a th:href="@{/books}">` | `<Link to="/books">` |
| `return "redirect:/books"` | `navigate('/books')` |
| `@PathVariable Long id` | `const { id } = useParams()` |

---

## 2. React Router 설치

```bash
npm install react-router-dom
```

---

## 3. 기본 라우터 구성

```jsx
// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import BookDetail from './pages/BookDetail.jsx'
import CartPage from './pages/CartPage.jsx'
import NotFound from './pages/NotFound.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 레이아웃 라우트: Layout 을 공통으로 감싼다 */}
        <Route element={<Layout />}>
          <Route path="/"          element={<Home />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/cart"      element={<CartPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  )
}
```

---

## 4. Link — 페이지 이동 (a 태그 대체)

```jsx
import { Link } from 'react-router-dom'

// ✅ Link: 서버 요청 없이 SPA 내부 이동
// Thymeleaf: <a th:href="@{/books}">도서 목록</a>
<Link to="/books">도서 목록</Link>
<Link to={`/books/${book.id}`}>상세 보기</Link>

// ❌ 일반 a 태그: 서버 요청 발생 → SPA 특성 깨짐
<a href="/books">도서 목록</a>  // SPA에서 사용 금지
```

---

## 5. useNavigate — 코드로 페이지 이동

```jsx
import { useNavigate } from 'react-router-dom'

function BookCard({ book }) {
  const navigate = useNavigate()

  function handleClick() {
    // Thymeleaf: return "redirect:/books/" + id
    navigate(`/books/${book.id}`)
  }

  function handleBack() {
    navigate(-1)   // 브라우저 뒤로가기
  }

  return (
    <button onClick={handleClick}>상세 보기</button>
  )
}
```

---

## 6. useParams — URL 파라미터 읽기

```jsx
// Route 설정: path="/books/:id"
// URL 접근:   /books/3

import { useParams } from 'react-router-dom'

function BookDetail() {
  // Thymeleaf: @PathVariable Long id
  const { id } = useParams()   // "3" (문자열)

  useEffect(() => {
    fetchBook(Number(id))   // 숫자 변환 후 API 요청
  }, [id])
}
```

---

## 7. 레이아웃 라우트 — Outlet

```jsx
// Layout.jsx
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div>
      <Header />
      <main>
        {/* Outlet: 자식 Route의 컴포넌트가 여기에 렌더링 */}
        {/* Thymeleaf: layout:fragment="content" 슬롯과 동일 */}
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
```

> 💡 Day 3에서 사용한 `{children}` props 방식 → Day 7에서 `<Outlet />` 으로 교체

---

## 8. 오후 프로젝트 실습 가이드

### Step 1. react-router-dom 설치 (10분)
```bash
npm install react-router-dom
```

### Step 2. App.jsx 라우터 구성 (30분)
```jsx
<BrowserRouter>
  <Routes>
    <Route element={<Layout />}>
      <Route path="/"          element={<Home />} />
      <Route path="/books/:id" element={<BookDetail />} />
      <Route path="/cart"      element={<CartPage />} />
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
```

### Step 3. Layout.jsx — Outlet 적용 (20분)
```jsx
import { Outlet } from 'react-router-dom'
// {children} → <Outlet /> 으로 교체
```

### Step 4. BookDetail 페이지 (40분)
```jsx
const { id } = useParams()
useEffect(() => { fetchBook(Number(id)) }, [id])
```

### Step 5. Header 네비게이션 링크 (20분)
```jsx
import { Link } from 'react-router-dom'
<Link to="/">홈</Link>
<Link to="/cart">장바구니</Link>
```

### 체크리스트
- [ ] `<a href>` 대신 `<Link to>` 를 사용하는가
- [ ] Layout이 `{children}` 아닌 `<Outlet />`을 사용하는가
- [ ] useParams 로 id를 Number로 변환 후 사용하는가
- [ ] 존재하지 않는 URL 접근 시 404 페이지가 나오는가

---

## 오늘의 핵심 정리

| # | 핵심 내용 |
|---|-----------|
| ✅ 1 | React Router = SPA에서 URL을 관리하는 라이브러리 |
| ✅ 2 | `<Route path="/" element={<Home />} />` — URL과 컴포넌트 매핑 |
| ✅ 3 | `<Link to="/path">` — a 태그 대체, 서버 요청 없음 |
| ✅ 4 | `useNavigate()` — 코드로 페이지 이동 (redirect 대응) |
| ✅ 5 | `useParams()` — URL 파라미터 읽기 (@PathVariable 대응) |
| ✅ 6 | `<Outlet />` — 레이아웃 라우트의 content 슬롯 |

---

## 참고 자료
- [React Router 공식 문서](https://reactrouter.com/en/main)
- [useParams](https://reactrouter.com/en/main/hooks/use-params)
- [useNavigate](https://reactrouter.com/en/main/hooks/use-navigate)
