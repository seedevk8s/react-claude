# Day 2 — JSX 문법 완전 정복

## 학습 목표
- JSX 표현식 `{ }`로 동적 데이터를 출력할 수 있다
- 조건부 렌더링 2가지 패턴(`&&`, 삼항연산자)을 상황에 맞게 사용할 수 있다
- 리스트 렌더링에서 `.map()`과 `key`를 올바르게 사용할 수 있다
- Thymeleaf 코드를 보고 JSX로 변환할 수 있다

---

## 1. JSX 표현식 `{ }` — 동적 데이터 출력

### 1-1. 기본 사용법

```jsx
const name = "김수강"
const score = 95
const today = new Date().toLocaleDateString()

return (
  <div>
    <p>이름: {name}</p>
    <p>점수: {score}</p>
    <p>오늘: {today}</p>
    <p>내년 점수: {score + 5}</p>
    <p>대문자: {name.toUpperCase()}</p>
  </div>
)
```

> `{ }` 안에는 **표현식**(값을 반환하는 코드)만 가능하다.
> `if문`, `for문`은 `{ }` 안에 직접 쓸 수 없다.

### 1-2. Thymeleaf vs JSX 표현식 비교

| Thymeleaf | JSX | 설명 |
|-----------|-----|------|
| `th:text="${name}"` | `{name}` | 변수 출력 |
| `th:text="${score + 5}"` | `{score + 5}` | 연산 결과 출력 |
| `th:text="${#strings.toUpperCase(name)}"` | `{name.toUpperCase()}` | 메서드 호출 |
| `th:text="${item.price * item.qty}"` | `{item.price * item.qty}` | 복합 연산 |

### 1-3. `{ }` 안에 넣을 수 있는 것 / 없는 것

```jsx
// ✅ 가능 — 표현식
{name}
{score > 90 ? "합격" : "불합격"}
{items.length}
{isLoggedIn && <button>로그아웃</button>}

// ❌ 불가능 — 문(Statement)
{if (score > 90) { ... }}
{for (let i = 0; ...) { ... }}
```

---

## 2. 조건부 렌더링

### 2-1. `&&` 연산자 — "이것이 참일 때만 보여줘"

```jsx
const isLoggedIn = true

return (
  <div>
    {isLoggedIn && <button>로그아웃</button>}
  </div>
)
```

⚠ **주의:** `0 && <Component />` 는 `0`이 화면에 출력된다!
```jsx
// ❌ 잘못된 예
{items.length && <List />}

// ✅ 올바른 예
{items.length > 0 && <List />}
```

### 2-2. 삼항 연산자 — "참이면 A, 거짓이면 B"

```jsx
return (
  <span>{score >= 90 ? "합격" : "불합격"}</span>
)

// JSX 요소도 삼항 결과로 사용 가능
return (
  <div>
    {isLoggedIn
      ? <button>로그아웃</button>
      : <button>로그인</button>
    }
  </div>
)
```

### 2-3. 언제 어떤 패턴을 쓸까?

| 상황 | 사용 패턴 |
|------|----------|
| 보이거나 / 안 보이거나 | `&&` |
| A이거나 / B이거나 | 삼항연산자 |
| 복잡한 조건 | 함수로 분리 |

---

## 3. 리스트 렌더링

### 3-1. `.map()` 기본 패턴

```jsx
const items = [
  { id: 1, name: "노트북" },
  { id: 2, name: "마우스" },
  { id: 3, name: "키보드" },
]

return (
  <ul>
    {items.map((item) => (
      <li key={item.id}>{item.name}</li>
    ))}
  </ul>
)
```

### 3-2. `key` prop이 반드시 필요한 이유

- key가 없으면 React는 전체 리스트를 다시 그린다 → 성능 저하 + 경고
- 주로 DB의 `id` 값 사용
- index는 권장하지 않음 (순서 변경 시 버그 가능)

### 3-3. 복잡한 리스트 + 빈 배열 처리

```jsx
return (
  <div>
    {products.length > 0
      ? (
        <ul>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.price.toLocaleString()}원</td>
              <td>{product.inStock ? "재고 있음" : "품절"}</td>
            </tr>
          ))}
        </ul>
      )
      : <p>등록된 상품이 없습니다.</p>
    }
  </div>
)
```

---

## 4. Thymeleaf → JSX 변환 실습 문제

### 문제 1 — 회원 정보 카드

**Thymeleaf:**
```html
<div class="user-card">
  <h2 th:text="${user.name}"></h2>
  <span th:if="${user.isAdmin}" class="badge">관리자</span>
  <span th:unless="${user.isAdmin}" class="badge">일반회원</span>
</div>
```

**JSX 정답:**
```jsx
<div className="user-card">
  <h2>{user.name}</h2>
  <span className="badge">
    {user.isAdmin ? "관리자" : "일반회원"}
  </span>
</div>
```

### 문제 2 — 게시글 목록

**Thymeleaf:**
```html
<ul>
  <li th:each="post : ${posts}">
    <a th:href="@{/post/{id}(id=${post.id})}" th:text="${post.title}"></a>
  </li>
</ul>
<p th:if="${#lists.isEmpty(posts)}">게시글이 없습니다.</p>
```

**JSX 정답:**
```jsx
{posts.length > 0
  ? (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <a href={`/post/${post.id}`}>{post.title}</a>
        </li>
      ))}
    </ul>
  )
  : <p>게시글이 없습니다.</p>
}
```

### 문제 3 — 상품 카드 (도전!)

**Thymeleaf:**
```html
<div th:each="product : ${products}" class="product-card">
  <h3 th:text="${product.name}"></h3>
  <button th:if="${product.inStock}" class="btn-buy">구매하기</button>
  <button th:unless="${product.inStock}" class="btn-soldout" disabled>품절</button>
</div>
```

**JSX 정답:**
```jsx
{products.map((product) => (
  <div key={product.id} className="product-card">
    <h3>{product.name}</h3>
    {product.inStock
      ? <button className="btn-buy">구매하기</button>
      : <button className="btn-soldout" disabled>품절</button>
    }
  </div>
))}
```

---

## 5. 오후 프로젝트 실습 가이드

### Step 1. 변환 대상 선정 (15분)
- 팀프로젝트에서 가장 단순한 목록 페이지 1개 선택

### Step 2. 정적 JSX 변환 (60분)
```jsx
// src/pages/PostList.jsx
function PostList() {
  const posts = [
    { id: 1, title: "첫 번째 게시글", author: "홍길동" },
    { id: 2, title: "두 번째 게시글", author: "김수강" },
  ]
  return (
    <div className="post-list">
      <h1>게시글 목록</h1>
      {posts.map((post) => (
        <div key={post.id} className="post-item">
          <h3>{post.title}</h3>
          <span>{post.author}</span>
        </div>
      ))}
    </div>
  )
}
export default PostList
```

### Step 3. App.jsx 연결 + 체크리스트
- [ ] `class` → `className` 변환 완료
- [ ] 모든 태그 닫기 완료
- [ ] `th:text` → `{ }` 변환 완료
- [ ] `th:each` → `.map() + key` 변환 완료
- [ ] `th:if / th:unless` → 삼항/`&&` 변환 완료

---

## 오늘의 핵심 정리

| # | 핵심 내용 |
|---|-----------|
| ✅ 1 | `{ }` 안에는 표현식만 가능 — `if문`, `for문` 직접 사용 불가 |
| ✅ 2 | 보이거나 안 보이거나 → `&&` / A이거나 B이거나 → 삼항연산자 |
| ✅ 3 | `th:each` → `.map()` + 반드시 `key={고유id}` |
| ✅ 4 | `key`는 index 대신 DB의 `id` 값 사용 |
| ✅ 5 | 빈 배열 → `length > 0 ? 목록 : 안내문` 패턴 |
