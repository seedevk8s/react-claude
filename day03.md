# Day 3 — 컴포넌트 설계 + Props

## 학습 목표
- 함수형 컴포넌트를 작성하고 `th:fragment`와 매핑할 수 있다
- Props로 부모→자식 데이터를 전달하고 구조분해 할당을 사용할 수 있다
- 컴포넌트 분리 기준(재사용성, 단일 책임)을 적용할 수 있다
- `children` props로 레이아웃 컴포넌트를 구성할 수 있다

---

## 1. 컴포넌트란? — th:fragment 매핑

```html
<!-- Thymeleaf: fragments/header.html -->
<header th:fragment="header">
  <nav>
    <a href="/">홈</a>
    <a href="/products">상품</a>
  </nav>
</header>

<!-- 사용 -->
<div th:replace="~{fragments/header :: header}"></div>
```

```jsx
// React: src/components/Header.jsx
function Header() {
  return (
    <header>
      <nav>
        <a href="/">홈</a>
        <a href="/products">상품</a>
      </nav>
    </header>
  )
}
export default Header

// 사용
<Header />
```

### 컴포넌트 기본 규칙

| 규칙 | 이유 |
|------|------|
| 이름은 **대문자**로 시작 | 소문자는 HTML 태그로 인식됨 |
| 최상위 태그 **1개**만 반환 | JSX 문법 규칙 |
| `export default` 필수 | 다른 파일에서 import 가능하게 |
| 파일명 = 컴포넌트명 | 관례 (ProductCard.jsx) |

---

## 2. Props — 부모에서 자식으로 데이터 전달

### 2-1. Props 기본

```jsx
// 자식 컴포넌트 — props 받기
function ProductCard(props) {
  return (
    <div className="card">
      <h3>{props.name}</h3>
      <p>{props.price.toLocaleString()}원</p>
    </div>
  )
}

// 부모 컴포넌트 — props 전달
function App() {
  return (
    <div>
      <ProductCard name="노트북" price={1200000} />
      <ProductCard name="마우스" price={35000} />
    </div>
  )
}
```

### 2-2. Props 전달 방식

```jsx
<ProductCard name="노트북" />               // 문자열 — 따옴표
<ProductCard price={1200000} inStock={true} /> // 숫자/불리언 — 중괄호
<ProductCard name={productName} />           // 변수 — 중괄호
<ProductCard onDelete={handleDelete} />      // 함수 — 중괄호
```

### 2-3. 구조분해 할당 — 실무 표준

```jsx
// ❌ props.xxx 방식
function ProductCard(props) {
  return <h3>{props.name}</h3>
}

// ✅ 구조분해 할당 — 실무 표준
function ProductCard({ name, price, inStock }) {
  return (
    <div className="card">
      <h3>{name}</h3>
      <p>{price.toLocaleString()}원</p>
      {inStock
        ? <button>구매하기</button>
        : <button disabled>품절</button>
      }
    </div>
  )
}
```

### 2-4. Props 기본값 설정

```jsx
function Badge({ text, color = "blue" }) {
  return (
    <span style={{ backgroundColor: color }}>
      {text}
    </span>
  )
}

<Badge text="신규" />              // color = "blue" (기본값)
<Badge text="할인" color="red" /> // color = "red"
```

---

## 3. 컴포넌트 분리 기준

### 분리해야 하는 신호

| 신호 | 예시 |
|------|------|
| 여러 곳에서 반복 사용 | 게시글 카드, 상품 카드 |
| 한 컴포넌트가 너무 길어짐 | 100줄 이상 |
| 독립적인 역할이 명확 | Header, Footer, Modal |
| 상태나 로직이 분리 가능 | 검색창, 페이지네이션 |

```jsx
// ✅ 분리 후
function App() {
  return (
    <div>
      <Header />
      <main>
        {products.map((p) => (
          <ProductCard key={p.id} name={p.name} price={p.price} />
        ))}
      </main>
      <Footer />
    </div>
  )
}
```

---

## 4. children Props — 레이아웃 컴포넌트

```jsx
// Thymeleaf layout:fragment="content" → React children
function Layout({ children }) {
  return (
    <div>
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  )
}

// 사용
function App() {
  return (
    <Layout>
      <h1>페이지 내용</h1>
      <p>상품 목록...</p>
    </Layout>
  )
}
```

---

## 5. 컴포넌트 파일 구조 관례

```
src/
├── components/         ← 재사용 공통 컴포넌트
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── Layout.jsx
│   └── Card.jsx
├── pages/              ← 페이지 단위 컴포넌트
│   ├── Home.jsx
│   └── ProductList.jsx
└── App.jsx
```

---

## 6. 오후 프로젝트 실습 가이드

### Step 1. 폴더 구조 생성 (15분)
```
src/components/Header.jsx
src/components/Footer.jsx
src/components/Layout.jsx
src/pages/Home.jsx
```

### Step 2. Header 컴포넌트 (30분)
```jsx
function Header() {
  return (
    <header className="header">
      <div className="logo"><a href="/">팀프로젝트명</a></div>
      <nav className="nav">
        <a href="/">홈</a>
        <a href="/products">상품</a>
        <a href="/login">로그인</a>
      </nav>
    </header>
  )
}
export default Header
```

### Step 3. Layout 컴포넌트 (30분)
```jsx
import Header from './Header'
import Footer from './Footer'

function Layout({ children }) {
  return (
    <div className="wrapper">
      <Header />
      <main className="container">{children}</main>
      <Footer />
    </div>
  )
}
export default Layout
```

### Step 4. App.jsx 연결 + 체크리스트
- [ ] 컴포넌트 이름이 대문자로 시작하는가
- [ ] 각 파일에 `export default` 가 있는가
- [ ] import 경로가 올바른가
- [ ] `{children}`이 올바르게 렌더링되는가

---

## 오늘의 핵심 정리

| # | 핵심 내용 |
|---|-----------|
| ✅ 1 | 컴포넌트 이름은 **대문자** 시작, `export default` 필수 |
| ✅ 2 | `th:fragment` → 컴포넌트 함수, `th:replace` → `<컴포넌트 />` |
| ✅ 3 | Props는 **부모→자식** 단방향 — 자식에서 직접 수정 불가 |
| ✅ 4 | 구조분해 할당 `{ name, price }` 이 실무 표준 |
| ✅ 5 | `children` props = Thymeleaf `layout:fragment="content"` |
| ✅ 6 | `components/` 재사용 UI, `pages/` 페이지 단위로 폴더 분리 |
