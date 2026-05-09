# Day 02 — JSX 심화 실습

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:3000 접속

## 컴포넌트 구조

```
App
├── ConditionalSection    ← 조건부 렌더링 4가지 패턴
├── ListSection           ← 리스트 렌더링 4가지 패턴
└── JsxRulesSection       ← JSX 문법 규칙 7가지
```

## Thymeleaf ↔ React 매핑 핵심

| Thymeleaf | React (JSX) |
|-----------|-------------|
| `th:if="${condition}"` | `{condition && <JSX>}` |
| `th:unless="${condition}"` | `{!condition && <JSX>}` |
| if/else (컨트롤러 분기) | `{a ? <A/> : <B/>}` |
| `th:switch` / `th:case` | 헬퍼 함수로 분리 |
| `th:each="item : ${list}"` | `{list.map(item => <JSX key={item.id}>)}` |
| `th:class="${...}"` | `className={...}` |
| `th:style="${...}"` | `style={{ key: value }}` |

## 각 컴포넌트 학습 포인트

### ConditionalSection.jsx — 조건부 렌더링
```jsx
// 패턴 1: && 연산자 (th:if)
{isLoggedIn && <p>환영합니다!</p>}

// 패턴 2: 삼항 연산자 (if-else)
{stock > 0 ? <span>재고 있음</span> : <span>품절</span>}

// 패턴 3: 헬퍼 함수 (th:switch 대응)
function getRoleBadge(role) {
  if (role === 'ADMIN') return <span>관리자</span>
  if (role === 'USER')  return <span>사용자</span>
  return                       <span>게스트</span>
}

// 패턴 4: 동적 style (th:class 대응)
<p style={{ color: score >= 60 ? 'green' : 'red' }}>...</p>
```

### ListSection.jsx — 리스트 렌더링
```jsx
// 기본 map (th:each)
{products.map(p => <li key={p.id}>{p.name}</li>)}

// filter + sort + map 조합 (컨트롤러 로직을 JSX 안에서)
{products
  .filter(p => p.category === 'BOOK' && p.stock > 0)
  .sort((a, b) => a.price - b.price)
  .map(p => <li key={p.id}>{p.name}</li>)
}
```

### JsxRulesSection.jsx — 주요 문법 규칙
| 규칙 | 틀린 코드 | 올바른 코드 |
|------|-----------|-------------|
| 루트 태그 | `<h1/><p/>` 나란히 | `<>...</>` Fragment 사용 |
| CSS 클래스 | `class="..."` | `className="..."` |
| 빈 태그 | `<input>` | `<input />` |
| JS 표현식 | `이름: name` | `이름: {name}` |
| 인라인 스타일 | `style="color:red"` | `style={{ color: 'red' }}` |
| 리스트 key | `<li>{item}</li>` | `<li key={id}>{item}</li>` |
| 주석 | `<!-- 주석 -->` | `{/* 주석 */}` |
