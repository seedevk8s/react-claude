# Day 01 실습 프로젝트 — BookStore (정적 도서 목록)

## 실행 방법

```bash
npm install
npm run dev
```

→ 브라우저에서 http://localhost:5173 접속

---

## 주요 파일 안내

```
day01-practice/
├── index.html          ← 건드릴 필요 없음
├── src/
│   ├── main.jsx        ← 건드릴 필요 없음
│   ├── index.css       ← 건드릴 필요 없음
│   └── App.jsx         ← ✅ 오늘 수강생이 작성하는 파일
```

Day 1은 `App.jsx` 하나가 핵심이다.  
`index.html` → `main.jsx` → `App.jsx` 실행 흐름을 이해하고,  
실제로 코드를 작성하고 결과를 확인하는 파일은 `App.jsx` 하나다.

---

## App.jsx 작성 순서

기본적으로 **위에서 아래로** 작성한다.  
React 컴포넌트 파일의 관례적인 순서는 아래와 같다.

```jsx
// 1. import (외부에서 가져오는 것들)
import { useState } from 'react'

// 2. 데이터 / 상수 (컴포넌트 밖에 선언)
const books = [ ... ]

// 3. 컴포넌트 함수 (핵심)
function App() {

  // 4. state / 변수 선언 (컴포넌트 안, return 위)
  const title = "BookStore"

  // 5. 이벤트 핸들러 함수 (return 바로 위)
  function handleClick() { ... }

  // 6. return — JSX (화면)
  return (
    <div> ... </div>
  )
}

// 7. export (항상 맨 마지막)
export default App
```

Day 1 현재는 import와 state가 없어서 **2 → 3 → 6 → 7** 순서만 있는 가장 단순한 형태다.  
Day가 올라갈수록 항목이 하나씩 추가된다.

---

## JSX 핵심 규칙 6가지

| 규칙 | 틀린 코드 | 올바른 코드 |
|------|-----------|-------------|
| CSS 클래스 | `class="box"` | `className="box"` |
| 빈 태그 닫기 | `<input>` | `<input />` |
| 최상위 태그 | 태그 2개 나란히 | `<>...</>` Fragment |
| JS 표현식 | 변수명 그대로 | `{변수명}` |
| 인라인 스타일 | `style="color:red"` | `style={{ color: 'red' }}` |
| 주석 | `<!-- -->` | `{/* */}` |

---

## Thymeleaf ↔ React 매핑

| Thymeleaf | React |
|-----------|-------|
| `th:text="${book.title}"` | `{book.title}` |
| `th:each="book : ${books}"` | `books.map(book => <div key={book.id}>)` |
| `th:if="${book.inStock}"` | `{book.inStock ? <A /> : <B />}` |
| `class="..."` | `className="..."` |
