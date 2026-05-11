# Day 03 실습 프로젝트 — BookStore 컴포넌트 분리

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
├── App.jsx                   ← 어떤 페이지를 보여줄지 결정 (Day 7에서 라우터로 교체)
├── main.jsx                  ← 건드릴 필요 없음
├── index.css                 ← Tailwind @layer components 스타일 정의
├── components/               ← 재사용 공통 컴포넌트
│   ├── Header.jsx            ← 공통 헤더 (네비게이션)
│   ├── Footer.jsx            ← 공통 푸터
│   ├── Layout.jsx            ← 레이아웃 틀 (children 슬롯)
│   └── BookCard.jsx          ← 도서 카드 (props 받아서 렌더링)
└── pages/                    ← 페이지 단위 컴포넌트
    └── Home.jsx              ← 홈 페이지 (데이터 보유 + BookCard 나열)
```

---

## App.jsx 작성 순서

```
1. import       Layout, Home 등 컴포넌트 가져오기
3. 컴포넌트 함수
   6. return JSX  <Layout><Home /></Layout>
7. export
```

> Day 3부터 데이터는 App.jsx 가 아닌 각 pages/ 파일이 가진다.

---

## 오늘의 핵심 개념

### 컴포넌트 규칙
| 규칙 | 이유 |
|------|------|
| 이름은 **대문자** 시작 | 소문자는 HTML 태그로 인식됨 |
| 최상위 태그 **1개**만 반환 | JSX 문법 규칙 |
| `export default` 필수 | 다른 파일에서 import 가능하게 |
| 파일명 = 컴포넌트명 | 관례 (BookCard.jsx) |

### Props 전달 방식
```jsx
// 문자열 → 따옴표
<BookCard title="클린 코드" />

// 숫자 / 불리언 / 변수 → 중괄호
<BookCard price={33000} inStock={true} isNew={book.isNew} />
```

### 구조분해 할당 (실무 표준)
```jsx
// ❌ 비추천
function BookCard(props) {
  return <h3>{props.title}</h3>
}

// ✅ 추천
function BookCard({ title, author, price }) {
  return <h3>{title}</h3>
}
```

### Props 기본값
```jsx
// isNew, isSale 을 전달하지 않으면 자동으로 false 가 된다
function BookCard({ title, isNew = false, isSale = false }) { ... }
```

### children props — Layout 슬롯
```jsx
// [매핑] Thymeleaf layout:fragment="content" → React children

// Layout.jsx
function Layout({ children }) {
  return (
    <div>
      <Header />
      <main>{children}</main>   {/* 여기에 삽입됨 */}
      <Footer />
    </div>
  )
}

// App.jsx — <Layout> 사이에 넣은 내용이 {children} 자리에 출력
<Layout>
  <Home />
</Layout>
```

---

## Thymeleaf ↔ React 매핑 요약

| Thymeleaf | React |
|-----------|-------|
| `templates/fragments/header.html` | `components/Header.jsx` |
| `templates/layout/default.html` | `components/Layout.jsx` |
| `templates/home.html` | `pages/Home.jsx` |
| `th:replace="~{fragments/header}"` | `<Header />` |
| `layout:fragment="content"` | `{children}` |
| `th:text="${book.title}"` | `{title}` (prop으로 받은 값) |
