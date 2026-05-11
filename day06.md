# Day 6 — useEffect + 데이터 로딩 흐름

## 학습 목표
- `useEffect` 훅의 실행 시점과 동작 원리를 설명할 수 있다
- dependency array의 3가지 형태를 구분하고 적용할 수 있다
- 로딩·에러·데이터 상태를 useState로 관리할 수 있다
- 컴포넌트 마운트 시 데이터를 불러오는 패턴을 작성할 수 있다
- cleanup 함수의 필요성과 작성법을 이해할 수 있다

---

## 1. useEffect란? — Thymeleaf와의 매핑

### 1-1. Thymeleaf 방식

```
브라우저 요청
    → @GetMapping("/books")
    → bookService.findAll() ← DB 조회
    → model.addAttribute("books", books)
    → templates/books.html 렌더링 → 브라우저 전송
```

서버가 HTML을 만들기 **전에** 데이터를 준비한다.

### 1-2. React 방식

```
컴포넌트 렌더링 (빈 화면)
    → useEffect 실행
    → API 호출 (fetch / Axios)
    → 응답 받으면 setState → 화면 자동 갱신
```

화면이 먼저 그려지고, **이후에** 데이터를 가져온다.

### 1-3. 매핑 정리

| Thymeleaf | React |
|-----------|-------|
| `@GetMapping` 메서드 | `useEffect` |
| `bookService.findAll()` | `axios.get('/api/books')` |
| `model.addAttribute(...)` | `setBooks(data)` |
| 컨트롤러 실행 시점 | 컴포넌트 마운트 시점 |

---

## 2. useEffect 기본 문법

```jsx
import { useEffect } from 'react'

useEffect(() => {
  // 실행할 코드 (사이드 이펙트)
  console.log('useEffect 실행')

  // cleanup 함수 (선택)
  return () => {
    console.log('컴포넌트 언마운트 또는 재실행 전 정리')
  }
}, [의존성배열])
```

---

## 3. dependency array 3가지 패턴

```jsx
// ① 빈 배열 [] — 마운트 시 1회만 실행 (가장 많이 씀)
useEffect(() => {
  fetchBooks()   // 컴포넌트가 처음 나타날 때 한 번만 실행
}, [])

// ② 의존성 지정 — 해당 값이 바뀔 때마다 실행
useEffect(() => {
  fetchBooks(category)   // category 가 바뀔 때마다 재요청
}, [category])

// ③ 배열 없음 — 렌더링마다 실행 (거의 안 씀, 주의)
useEffect(() => {
  console.log('매 렌더링마다 실행')
})
```

> 💡 **한 줄 비유**
> - `[]` : 페이지 첫 로드 시 1회 실행 (Spring의 `@PostConstruct`)
> - `[dep]` : dep 값이 바뀔 때마다 재실행

---

## 4. 데이터 로딩 패턴 — 3가지 state

```jsx
function BookList() {
  // ✅ 데이터 로딩에 필요한 3가지 state
  const [books,   setBooks]   = useState([])      // 데이터
  const [loading, setLoading] = useState(true)    // 로딩 여부
  const [error,   setError]   = useState(null)    // 에러 메시지

  useEffect(() => {
    // ① 로딩 시작
    setLoading(true)
    setError(null)

    // ② API 호출 (Day 8에서 axios.get('/api/books') 로 교체)
    fetch('/api/books')
      .then(res => {
        if (!res.ok) throw new Error('서버 오류')
        return res.json()
      })
      .then(data => {
        setBooks(data)    // ③ 데이터 저장
        setLoading(false) // ④ 로딩 종료
      })
      .catch(err => {
        setError(err.message) // ⑤ 에러 저장
        setLoading(false)
      })
  }, [])  // 마운트 시 1회

  // 로딩 중
  if (loading) return <p>데이터를 불러오는 중...</p>

  // 에러
  if (error) return <p>오류: {error}</p>

  // 데이터 표시
  return (
    <ul>
      {books.map(b => <li key={b.id}>{b.title}</li>)}
    </ul>
  )
}
```

---

## 5. async/await 패턴 (더 가독성 좋은 방식)

```jsx
useEffect(() => {
  // useEffect 콜백 자체를 async로 만들 수 없으므로
  // 내부 async 함수를 정의 후 즉시 호출
  async function loadBooks() {
    try {
      setLoading(true)
      const res  = await fetch('/api/books')
      const data = await res.json()
      setBooks(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  loadBooks()   // 즉시 호출
}, [])
```

> ⚠️ `useEffect(async () => {...})` 는 사용 금지
> → useEffect는 cleanup 함수(일반 함수)만 반환할 수 있기 때문

---

## 6. cleanup 함수

```jsx
useEffect(() => {
  // AbortController: 컴포넌트가 사라질 때 진행 중인 요청을 취소
  const controller = new AbortController()

  async function loadBooks() {
    try {
      const res = await fetch('/api/books', {
        signal: controller.signal
      })
      const data = await res.json()
      setBooks(data)
    } catch (err) {
      if (err.name === 'AbortError') return  // 취소된 요청은 무시
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  loadBooks()

  // cleanup: 컴포넌트 언마운트 시 요청 취소
  return () => controller.abort()
}, [])
```

---

## 7. 오후 프로젝트 실습 가이드

### Step 1. 3가지 state 선언 (20분)
```jsx
const [books,   setBooks]   = useState([])
const [loading, setLoading] = useState(true)
const [error,   setError]   = useState(null)
```

### Step 2. useEffect + 데이터 로딩 (40분)
```jsx
useEffect(() => {
  async function load() {
    try {
      setLoading(true)
      // Day 8 전까지 setTimeout 으로 API 호출을 시뮬레이션
      await new Promise(r => setTimeout(r, 800))
      setBooks(MOCK_DATA)
    } catch (err) {
      setError('데이터를 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }
  load()
}, [])
```

### Step 3. 로딩/에러/빈데이터 UI 처리 (30분)
```jsx
if (loading) return <LoadingSpinner />
if (error)   return <ErrorMessage message={error} />
if (books.length === 0) return <EmptyState />
```

### Step 4. 카테고리별 재요청 (30분)
```jsx
// category 가 바뀔 때마다 데이터 다시 로드
useEffect(() => {
  load(category)
}, [category])
```

### 체크리스트
- [ ] useEffect dependency array 가 올바른가 (`[]` 로 마운트 1회)
- [ ] 로딩 중 스피너 또는 메시지가 표시되는가
- [ ] 에러 발생 시 안내 메시지가 표시되는가
- [ ] 데이터 없을 때 빈 상태 UI가 표시되는가

---

## 오늘의 핵심 정리

| # | 핵심 내용 |
|---|-----------|
| ✅ 1 | `useEffect` = 컴포넌트 렌더링 이후 실행되는 사이드 이펙트 |
| ✅ 2 | `[]` = 마운트 시 1회 / `[dep]` = dep 변경 시마다 |
| ✅ 3 | 데이터 로딩 state 3종: `data`, `loading`, `error` |
| ✅ 4 | `useEffect` 안에서 async/await: 내부 함수 정의 후 즉시 호출 |
| ✅ 5 | cleanup 함수로 언마운트 시 요청 취소 (AbortController) |
| ✅ 6 | Thymeleaf `@GetMapping` → React `useEffect` + API 호출 |

---

## 참고 자료
- [useEffect 공식 문서](https://react.dev/reference/react/useEffect)
- [데이터 페칭 패턴](https://react.dev/learn/synchronizing-with-effects)
