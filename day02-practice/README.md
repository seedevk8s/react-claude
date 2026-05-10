# Day 02 실습 프로젝트 — BookStore 관리자 대시보드

## 실행 방법

```bash
npm install
npm run dev
```

→ 브라우저에서 http://localhost:5173 접속

---

## 주요 파일 안내

```
day02-practice/
├── src/
│   ├── App.jsx       ← ✅ 오늘 수강생이 작성하는 파일
│   └── index.css     ← Tailwind @layer components 스타일 정의
```

---

## App.jsx 작성 순서

```
1. import         (없음 — Day 2는 외부 라이브러리 미사용)
2. 데이터 / 상수   컴포넌트 밖에 선언
3. 컴포넌트 함수
   4. 변수 선언   return 위
   6. return JSX  화면 구성
7. export
```

---

## 오늘 적용한 JSX 패턴

### 1. { } 표현식
```jsx
// 변수 출력
{currentUser.name}

// 연산
{books.length}
{book.price.toLocaleString()}

// 메서드 호출
{new Date().toLocaleDateString("ko-KR")}
{member.name[0]}   // 첫 글자만
```

### 2. 조건부 렌더링 — && (보이거나 / 안 보이거나)
```jsx
// Thymeleaf: th:if="${currentUser.isAdmin}"
{currentUser.isAdmin && <span>관리자 계정</span>}
{book.isNew && <span className="badge-new">NEW</span>}
```

### 3. 조건부 렌더링 — 삼항연산자 (A이거나 / B이거나)
```jsx
// Thymeleaf: th:if / th:unless 조합
{member.isAdmin ? <span>관리자</span> : <span>일반회원</span>}
{book.inStock   ? <span>재고 있음</span> : <span>품절</span>}
```

### 4. 리스트 렌더링 — .map() + key
```jsx
// Thymeleaf: th:each="book : ${books}"
{books.map((book) => (
  <tr key={book.id}>...</tr>
))}
```

### 5. 빈 배열 처리
```jsx
// ⚠️ 잘못된 패턴 — length 가 0 이면 숫자 0 이 화면에 출력됨
{orders.length && <div>목록</div>}

// ✅ 올바른 패턴
{orders.length > 0
  ? <div>목록</div>
  : <div>주문 내역이 없습니다.</div>
}
```

---

## 실습 포인트

`src/App.jsx` 상단 `orders` 배열을 빈 배열로 바꿔보면 빈 상태 UI를 확인할 수 있다.

```js
// const orders = [...]  ← 주석 처리
const orders = []        // ← 빈 배열로 교체
```
