# Day 4 — useState + 이벤트 처리

## 학습 목표
- `useState` 훅의 동작 원리를 이해하고 state를 선언할 수 있다
- state 변경 시 화면이 자동으로 리렌더링되는 원리를 설명할 수 있다
- `onClick` 등 이벤트 핸들러를 올바르게 작성할 수 있다
- 배열 state의 추가·수정·삭제 패턴을 적용할 수 있다
- 상태 끌어올리기(Lifting State Up) 개념을 이해할 수 있다

---

## 1. useState란? — Thymeleaf와의 근본적 차이

### 1-1. Thymeleaf 방식 — 서버가 상태를 관리

```
사용자 버튼 클릭
    → 브라우저가 서버로 POST 요청
    → 서버(Spring Boot)가 세션/DB에서 상태 변경
    → 서버가 새 HTML을 완성해서 응답
    → 브라우저 전체 화면 새로고침
```

### 1-2. React 방식 — 컴포넌트가 상태를 관리

```
사용자 버튼 클릭
    → 이벤트 핸들러(JS 함수) 실행
    → useState setter 호출 → state 변경
    → React가 변경된 부분만 화면 자동 갱신 (서버 요청 없음)
```

### 1-3. useState 선언 문법

```jsx
import { useState } from 'react'

// const [읽는값, 바꾸는함수] = useState(초기값)
const [count, setCount]   = useState(0)       // 숫자
const [name, setName]     = useState('')       // 문자열
const [isOpen, setIsOpen] = useState(false)   // 불리언
const [cart, setCart]     = useState([])      // 배열
const [user, setUser]     = useState(null)    // 객체
```

> 💡 **한 줄 비유**
> - Thymeleaf: 주방(서버)에서 주문표를 관리
> - React: 손님(브라우저) 테이블에 자체 주문표 보유

---

## 2. state 업데이트 규칙

### 2-1. ⚠️ state는 직접 수정하면 화면이 갱신되지 않는다

```jsx
// ❌ 잘못된 방식 — 화면 갱신 안 됨
count = count + 1
cart.push(newItem)

// ✅ 올바른 방식 — setter를 호출해야 갱신됨
setCount(count + 1)
setCart([...cart, newItem])
```

React는 setter가 호출될 때만 "값이 바뀌었다"는 것을 감지하고 리렌더링한다.

### 2-2. 배열 state 패턴 3가지

```jsx
// ① 추가 (스프레드로 기존 배열 복사 후 새 항목 추가)
setCart([...cart, newItem])

// ② 수정 (map으로 새 배열 생성 — 해당 항목만 교체)
setCart(cart.map(item =>
  item.id === targetId
    ? { ...item, qty: item.qty + 1 }  // 해당 항목만 변경
    : item                             // 나머지는 그대로
))

// ③ 삭제 (filter로 해당 항목 제거)
setCart(cart.filter(item => item.id !== targetId))
```

---

## 3. 이벤트 핸들러 — onClick

### 3-1. 기본 패턴

```jsx
// Thymeleaf: <form th:action="@{/cart/add}" method="post">
// React:     onClick={핸들러함수}

function App() {
  const [count, setCount] = useState(0)

  // 이벤트 핸들러: return 위, 컴포넌트 안에 선언
  function handleClick() {
    setCount(count + 1)
  }

  return (
    <button onClick={handleClick}>클릭 ({count})</button>
  )
}
```

### 3-2. ⚠️ 흔한 실수 — 즉시 실행 vs 참조 전달

```jsx
// ❌ 잘못된 방식 — 렌더링 즉시 실행됨 (클릭 전에 실행)
<button onClick={handleClick()}>버튼</button>

// ✅ 올바른 방식 — 함수 참조 전달 (클릭할 때만 실행)
<button onClick={handleClick}>버튼</button>

// ✅ 인자를 넘겨야 할 때 — 화살표 함수로 감싼다
<button onClick={() => handleAddToCart(book.id)}>담기</button>
```

### 3-3. 자주 쓰는 이벤트

| 이벤트 | HTML | JSX |
|--------|------|-----|
| 클릭 | `onclick` | `onClick` |
| 입력 변경 | `onchange` | `onChange` |
| 폼 제출 | `onsubmit` | `onSubmit` |
| 키보드 | `onkeydown` | `onKeyDown` |
| 마우스 오버 | `onmouseover` | `onMouseOver` |

> 💡 JSX 이벤트는 모두 camelCase

---

## 4. 상태 끌어올리기 (Lifting State Up)

두 컴포넌트가 같은 데이터를 공유해야 할 때,
**공통 부모**가 state를 보유하고 자식에게 props로 내려준다.

```
App (cartCount state 보유)
├── Layout → Header  : cartCount prop으로 뱃지 숫자 표시 (읽기)
└── Home             : onCartChange prop으로 변경 요청   (쓰기)
```

```jsx
// App.jsx — 공통 부모가 state 보유
function App() {
  const [cartCount, setCartCount] = useState(0)

  return (
    <Layout cartCount={cartCount}>
      <Home onCartChange={setCartCount} />
    </Layout>
  )
}

// Header.jsx — cartCount prop 읽기만
function Header({ cartCount }) {
  return <span>{cartCount}</span>
}

// Home.jsx — onCartChange 호출로 변경 요청
function Home({ onCartChange }) {
  function handleAddToCart() {
    // ...
    onCartChange(newCount)
  }
}
```

> 💡 **Thymeleaf 대응**: 세션에 장바구니 저장 → 헤더에서 `${session.cartCount}` 표시
> React는 세션 대신 공통 부모의 state가 이 역할을 한다

---

## 5. 오후 프로젝트 실습 가이드

### Step 1. useState 기본 연습 (30분)
```jsx
// Home.jsx에 장바구니 state 추가
const [cart, setCart] = useState([])

// 도서 담기 핸들러 작성
function handleAddToCart(bookId) {
  const book = books.find(b => b.id === bookId)
  setCart([...cart, { ...book, qty: 1 }])
}
```

### Step 2. 수량 증가/감소 (30분)
```jsx
function handleIncrease(itemId) {
  setCart(cart.map(item =>
    item.id === itemId ? { ...item, qty: item.qty + 1 } : item
  ))
}

function handleDecrease(itemId) {
  if (cart.find(i => i.id === itemId).qty <= 1) {
    setCart(cart.filter(i => i.id !== itemId))
  } else {
    setCart(cart.map(item =>
      item.id === itemId ? { ...item, qty: item.qty - 1 } : item
    ))
  }
}
```

### Step 3. 헤더 뱃지 연동 (30분)
- App.jsx에 cartCount state 추가
- Home → App → Header 로 데이터 흐름 연결

### Step 4. 체크리스트
- [ ] state를 직접 수정하지 않고 setter를 사용하는가
- [ ] onClick에 함수를 즉시 실행하지 않고 참조로 넘기는가
- [ ] 배열 수정 시 새 배열을 만들어 setter에 전달하는가
- [ ] 헤더 뱃지와 장바구니 수량이 동기화되는가

---

## 오늘의 핵심 정리

| # | 핵심 내용 |
|---|-----------|
| ✅ 1 | `const [값, setter] = useState(초기값)` — 선언 패턴 |
| ✅ 2 | state는 **setter를 통해서만** 변경 — 직접 수정 금지 |
| ✅ 3 | `onClick={함수}` — 함수 **참조** 전달 (호출 아님) |
| ✅ 4 | 인자 필요 시 `onClick={() => 함수(인자)}` |
| ✅ 5 | 배열: 추가 `[...arr, item]` / 수정 `.map()` / 삭제 `.filter()` |
| ✅ 6 | 두 컴포넌트가 공유할 state → **공통 부모로 끌어올린다** |

---

## 참고 자료
- [useState 공식 문서](https://react.dev/reference/react/useState)
- [이벤트 핸들러](https://react.dev/learn/responding-to-events)
- [상태 끌어올리기](https://react.dev/learn/sharing-state-between-components)
