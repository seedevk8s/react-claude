# Day 06 실습 프로젝트 — BookStore useEffect 데이터 로딩

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
├── App.jsx
├── components/
│   ├── Header.jsx / Layout.jsx / Footer.jsx / BookCard.jsx
└── pages/
    └── Home.jsx   ← ✅ 오늘의 핵심: useEffect + 로딩/에러 처리
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

### 1. 데이터 로딩 3종 state
```jsx
const [books,   setBooks]   = useState([])     // 데이터
const [loading, setLoading] = useState(true)   // 로딩 중
const [error,   setError]   = useState(null)   // 에러
```

### 2. useEffect + async/await 패턴
```jsx
useEffect(() => {
  async function load() {
    try {
      setLoading(true)
      const data = await fetchBooks(category)
      setBooks(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)  // 성공·실패 상관없이 항상 종료
    }
  }
  load()  // 즉시 호출
}, [category])  // category 바뀔 때마다 재실행
```

### 3. dependency array
```jsx
useEffect(() => { ... }, [])          // 마운트 시 1회
useEffect(() => { ... }, [category]) // category 바뀔 때마다
useEffect(() => { ... })              // 매 렌더링마다 (거의 안 씀)
```

### 4. UI 분기 처리
```jsx
if (loading) return <스피너 />
if (error)   return <에러 메시지 />
// 이후 정상 렌더링
```

---

## 실습 포인트

| 확인 | 방법 |
|------|------|
| 로딩 스피너 | 페이지 새로고침 → 0.8초간 스피너 표시 |
| 카테고리 재로딩 | DEVICE 버튼 클릭 → 스피너 후 필터링된 결과 |
| 에러 UI | Home.jsx 에서 `throw new Error(...)` 주석 해제 |
| 검색 필터 | 검색창 입력 → 로딩 없이 즉시 필터 (파생 데이터) |

---

## Thymeleaf ↔ React 매핑

| Thymeleaf | React |
|-----------|-------|
| `@GetMapping("/books")` | `useEffect(() => {}, [])` |
| `bookService.findAll()` | `fetchBooks()` (→ Day 8: axios.get) |
| `model.addAttribute("books", list)` | `setBooks(data)` |
| 에러 → ErrorPage | `error` state → 안내 UI |
