# Day 11 — 통합 점검 + 코드 리뷰

> 대상: Spring Boot + Thymeleaf 경험자 취준생  
> 시나리오: Day 1~10 BookStore 전체 코드를 점검하고, 리팩토링 포인트를 익힌다

---

## 학습 목표

- Day 1~10 전체 아키텍처를 **한눈에** 복습한다
- 코드 리뷰 관점에서 **좋은 코드 vs 나쁜 코드** 패턴을 비교한다
- 반복 코드를 `useFetch` **커스텀 훅**으로 추출하는 방법을 익힌다
- `useCallback` / `React.memo`로 **불필요한 리렌더링**을 방지한다
- 에러 처리 패턴을 **일관성 있게** 통일한다
- 면접에서 자주 나오는 **React Q&A**를 정리한다

---

## 1. 전체 아키텍처 복습

```
[ 브라우저 ]
    │
    ▼
[ React App ]
  ├── AuthProvider (로그인 전역 상태)
  │     └── CartProvider (장바구니 전역 상태)
  │           └── BrowserRouter
  │                 ├── /login  → LoginPage
  │                 └── PrivateRoute (인증 확인)
  │                       └── Layout (Header + Outlet + Footer)
  │                             ├── /            → Home
  │                             ├── /books/:id   → BookDetail
  │                             ├── /books/new   → BookForm (등록)
  │                             ├── /books/:id/edit → BookForm (수정)
  │                             └── /cart        → CartPage
    │
    ▼  (Axios + Vite Proxy)
[ Spring Boot REST API ]
  ├── GET    /api/books        → 도서 목록
  ├── GET    /api/books/:id    → 도서 상세
  ├── POST   /api/books        → 도서 등록
  ├── PUT    /api/books/:id    → 도서 수정
  ├── DELETE /api/books/:id    → 도서 삭제
  ├── POST   /api/auth/login   → 로그인
  └── POST   /api/auth/logout  → 로그아웃
```

---

## 2. 코드 리뷰 — 반복 패턴 추출

### 문제: loading/error 처리 코드가 모든 페이지에 반복

```jsx
// ❌ 나쁜 패턴: Home.jsx, BookDetail.jsx, 모든 페이지에 동일 코드 반복
const [data, setData]       = useState(null)
const [loading, setLoading] = useState(true)
const [error, setError]     = useState(null)

useEffect(() => {
  api.get('/books')
    .then(res => setData(res.data))
    .catch(err => setError(err))
    .finally(() => setLoading(false))
}, [])
```

### 해결: useFetch 커스텀 훅으로 추출

```jsx
// ✅ 좋은 패턴: src/hooks/useFetch.js
// ✏️ Spring: @Service 클래스로 공통 로직을 분리하는 것과 동일

import { useState, useEffect } from 'react'

export function useFetch(fetchFn, deps = []) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const refetch = () => {
    setLoading(true)
    setError(null)
    fetchFn()
      .then(res => setData(res.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => { refetch() }, deps)
  return { data, loading, error, refetch }
}

// 사용 예시 — Home.jsx
import { useFetch } from '../hooks/useFetch'
import { getBooks } from '../api/bookApi'

export default function Home() {
  const { data: books = [], loading, error, refetch } = useFetch(getBooks)

  if (loading) return <div className="loading-box">불러오는 중...</div>
  if (error)   return <div className="error-box">오류 발생 <button onClick={refetch}>재시도</button></div>
  // ...
}
```

---

## 3. 코드 리뷰 — 불필요한 리렌더링 방지

### 문제: BookCard가 부모 리렌더링 때마다 재렌더링

```jsx
// ❌ 나쁜 패턴: Home이 리렌더링될 때마다 모든 BookCard 재렌더링
function Home() {
  const { addToCart } = useCart()  // 안정적인 참조 아님

  return books.map(book => (
    <BookCard key={book.id} book={book} onAddCart={addToCart} />
  ))
}
```

### 해결: React.memo + useCallback

```jsx
// ✅ 좋은 패턴

// 1) CartContext의 addToCart를 useCallback으로 안정화
export function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  // useCallback: 참조가 바뀌지 않으므로 BookCard 리렌더링 방지
  const addToCart = useCallback((book) => {
    setCart(prev => {
      if (prev.find(item => item.id === book.id)) return prev
      return [...prev, book]
    })
  }, [])  // 의존성 없음 → 항상 동일 참조

  // ...
}

// 2) BookCard를 React.memo로 감싸기
// props가 바뀌지 않으면 리렌더링 건너뜀
const BookCard = React.memo(function BookCard({ book }) {
  const { addToCart } = useCart()
  return ( /* ... */ )
})

export default BookCard
```

---

## 4. 코드 리뷰 — 에러 처리 일관성

### 문제: API 에러 처리 방식이 컴포넌트마다 다름

```jsx
// ❌ 일관성 없음
// BookDetail: alert() 사용
alert('삭제에 실패했습니다.')

// BookForm: console.error만
console.error('저장 실패:', err)

// Home: 아무 처리 없음
.catch(() => {})
```

### 해결: 공통 에러 알림 유틸리티

```jsx
// src/utils/notify.js
// ✏️ Spring: @ControllerAdvice 전역 에러 처리와 유사

export const notify = {
  success: (msg) => {
    // 실제 프로젝트: react-hot-toast 등 라이브러리 사용
    console.log('✅', msg)
    // toast.success(msg)
  },
  error: (msg) => {
    console.error('❌', msg)
    // toast.error(msg)
  },
}

// 사용
import { notify } from '../utils/notify'

try {
  await deleteBook(id)
  notify.success('도서가 삭제되었습니다.')
  navigate('/')
} catch {
  notify.error('삭제에 실패했습니다. 다시 시도하세요.')
}
```

---

## 5. 코드 리뷰 — BookForm 개선

### 문제: handleChange가 매 렌더마다 새 함수 생성

```jsx
// ❌ 렌더마다 새 함수 객체 생성
const handleChange = (e) => {
  const { name, value } = e.target
  setForm(prev => ({ ...prev, [name]: value }))
}
```

### 해결: useCallback 적용

```jsx
// ✅ 메모이제이션 적용
const handleChange = useCallback((e) => {
  const { name, value } = e.target
  setForm(prev => ({ ...prev, [name]: value }))
  setErrors(prev => ({ ...prev, [name]: '' }))
}, [])  // setForm, setErrors는 안정적이므로 의존성 없음
```

### 문제: 폼 초기화 로직이 useEffect 안에만 있음

```jsx
// ❌ isEdit 변경 시 폼이 초기화되지 않을 수 있음
useEffect(() => {
  if (isEdit) getBook(id).then(res => setForm(res.data))
}, [id])
```

### 해결: 명시적 초기화

```jsx
// ✅ isEdit 변경(new → edit 등) 시에도 안전
useEffect(() => {
  if (isEdit) {
    getBook(id).then(res => setForm(res.data)).catch(() => navigate('/'))
  } else {
    // 등록 모드 진입 시 폼 초기화
    setForm({ title:'', author:'', price:'', description:'', coverImage:'' })
    setErrors({})
  }
}, [id, isEdit])
```

---

## 6. 자주 하는 실수 패턴

### ① useEffect 무한루프

```jsx
// ❌ 무한루프: setBooks가 리렌더링 → useEffect 재실행 반복
useEffect(() => {
  getBooks().then(res => setBooks(res.data))
})  // 의존성 배열 누락!

// ✅ 마운트 시 1회만 실행
useEffect(() => {
  getBooks().then(res => setBooks(res.data))
}, [])  // 빈 배열 = 마운트 1회
```

### ② 비동기 상태 업데이트 (언마운트 후)

```jsx
// ❌ 컴포넌트가 사라진 후 setBooks 호출 → 경고 발생
useEffect(() => {
  getBooks().then(res => setBooks(res.data))
  // cleanup 없음!
}, [])

// ✅ cleanup으로 요청 취소 (AbortController)
useEffect(() => {
  const controller = new AbortController()
  api.get('/books', { signal: controller.signal })
    .then(res => setBooks(res.data))
    .catch(err => { if (err.name !== 'AbortError') setError(err) })
  return () => controller.abort()  // 언마운트 시 요청 취소
}, [])
```

### ③ key prop 잘못 사용

```jsx
// ❌ index를 key로 사용 → 목록 순서 변경 시 버그
books.map((book, index) => <BookCard key={index} book={book} />)

// ✅ 고유 id 사용
books.map(book => <BookCard key={book.id} book={book} />)
```

### ④ 상태 직접 변경

```jsx
// ❌ 불변성 위반 → React가 변경 감지 못함
cart.push(book)   // 직접 변경
setCart(cart)     // 같은 참조라 리렌더링 안 됨

// ✅ 새 배열 생성
setCart(prev => [...prev, book])
```

### ⑤ Context 재렌더링 최적화

```jsx
// ❌ value 객체가 매 렌더마다 새로 생성 → 모든 소비자 리렌더링
<AuthContext.Provider value={{ user, login, logout }}>

// ✅ useMemo로 안정화
const value = useMemo(() => ({ user, isLoggedIn, login, logout }), [user])
<AuthContext.Provider value={value}>
```

---

## 7. 전체 코드 체크리스트

| 항목 | 확인 포인트 |
|------|------------|
| useEffect | 의존성 배열 명시 여부 |
| API 에러 | catch 블록이 모든 API 호출에 있는가 |
| key prop | index 대신 고유 id 사용 |
| 불변성 | 배열/객체 직접 변경 없이 새 참조 반환 |
| Context | value 객체 useMemo 안정화 |
| 폼 유효성 | 클라이언트 검사 + 서버 에러 처리 |
| 로딩 상태 | 모든 API 호출에 loading 표시 |
| navigate | 뒤로가기 시 navigate(-1) vs navigate('/') 적절히 사용 |
| 환경변수 | API URL 등을 .env로 분리했는가 |
| PropTypes | 타입 명시 (TypeScript 전환 권장) |

---

## 8. 면접 대비 Q&A

**Q1. 리액트에서 상태(state)와 props의 차이는?**
> - state: 컴포넌트가 직접 소유하고 관리하는 데이터. 변경 시 리렌더링 발생  
> - props: 부모가 자식에게 전달하는 데이터. 읽기 전용  
> - Thymeleaf 비유: state ≈ 서버 세션 데이터 / props ≈ th:fragment의 파라미터

**Q2. useEffect의 의존성 배열 역할은?**
> - 빈 배열 `[]`: 마운트 시 1회만 실행 (Thymeleaf 페이지 첫 로드와 유사)  
> - `[id]`: id가 바뀔 때마다 실행  
> - 배열 없음: 렌더링마다 실행 (무한루프 주의)

**Q3. Context API와 Redux의 차이는?**
> - Context: React 내장. 소규모~중간 규모 앱에 적합. 설정 간단  
> - Redux: 별도 라이브러리. 대규모 앱, 복잡한 상태 로직에 적합. DevTools 강력  
> - 이 프로젝트 규모에서는 Context API로 충분

**Q4. React에서 불변성이 중요한 이유는?**
> React는 이전 state와 새 state를 **참조(reference) 비교**로 변경을 감지한다.  
> 배열/객체를 직접 수정하면 같은 참조라 변경을 감지 못해 리렌더링이 발생하지 않는다.

**Q5. PrivateRoute를 직접 구현한 이유는?**
> React Router는 인증 기능을 내장하지 않는다. PrivateRoute는 `isLoggedIn` 확인 후  
> Outlet(인증됨) 또는 Navigate(미인증)을 반환하는 패턴으로, Spring Security의  
> `@PreAuthorize("isAuthenticated()")`를 클라이언트에서 구현한 것이다.

**Q6. 커스텀 훅(Custom Hook)을 만드는 기준은?**
> 여러 컴포넌트에서 동일한 로직(상태 + 사이드이펙트)이 반복될 때 추출한다.  
> `use` 접두사가 필수. Thymeleaf에서 공통 로직을 `@Service`로 분리하는 것과 동일.

---

## 9. 실습 과제

| 번호 | 과제 |
|------|------|
| ① | `useFetch` 훅을 Home.jsx와 BookDetail.jsx에 적용하여 코드 단순화 |
| ② | CartContext의 `addToCart`에 `useCallback` 적용 |
| ③ | `BookCard`를 `React.memo`로 감싸고 리렌더링 여부 확인 (React DevTools) |
| ④ | (도전) `ErrorBoundary` 컴포넌트 추가하여 런타임 에러 처리 |
| ⑤ | (도전) `.env` 파일로 `VITE_API_BASE_URL` 분리하고 `api.js`에서 사용 |

---

## 10. 오늘의 핵심 정리

| 개념 | 설명 |
|------|------|
| 커스텀 훅 | 반복 로직을 `use*` 함수로 추출. @Service 분리와 동일 |
| React.memo | props 변화 없으면 리렌더링 건너뜀. 퍼포먼스 최적화 |
| useCallback | 함수 참조 안정화. memo와 함께 사용 시 효과적 |
| 불변성 | 배열/객체 직접 수정 금지. 새 참조로 교체 |
| 에러 일관성 | 모든 API 호출에 동일한 에러 처리 패턴 적용 |
| 의존성 배열 | useEffect / useCallback / useMemo의 핵심. 실수 1순위 |
