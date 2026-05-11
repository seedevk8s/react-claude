# Day 08 실습 프로젝트 — BookStore Axios + Spring Boot 연동

## 실행 방법

```bash
npm install
npm run dev
```

→ http://localhost:5173

Spring Boot 서버 없이도 실행 가능 (Mock Fallback 자동 동작)

---

## 파일 구조

```
src/
├── api/
│   ├── api.js         ← ✅ axios 공통 인스턴스 (baseURL, 인터셉터)
│   └── bookApi.js     ← ✅ 도서 API 함수 (getBooks, getBook, ...)
├── mockData.js        ← Fallback 데이터 (서버 없을 때)
├── App.jsx
├── components/  Header / Layout / Footer / BookCard
└── pages/
    ├── Home.jsx       ← ✅ axios 버전 (getBooks)
    ├── BookDetail.jsx ← ✅ axios 버전 (getBook)
    ├── CartPage.jsx
    └── NotFound.jsx
```

---

## App.jsx 작성 순서

```
1. import   useState, BrowserRouter/Routes/Route, 페이지 컴포넌트
2. 컴포넌트
   3. state   cart
   4. 핸들러  handleAddToCart, handleIncrease, handleDecrease, ...
   5. return  <BrowserRouter><Routes>...</Routes></BrowserRouter>
6. export
```

---

## Day 7 → Day 8 핵심 변경

### Home.jsx
```jsx
// Day 7 (mockData)
import { fetchBooks } from '../mockData.js'
const data = await fetchBooks(category)
setBooks(data)

// Day 8 (axios)
import { getBooks } from '../api/bookApi.js'
const res = await getBooks(category)
setBooks(res.data)   // axios: 반드시 res.data
```

### BookDetail.jsx
```jsx
// Day 7
import { fetchBook } from '../mockData.js'
const data = await fetchBook(Number(id))
setBook(data)

// Day 8
import { getBook } from '../api/bookApi.js'
const res = await getBook(Number(id))
setBook(res.data)
```

---

## axios 에러 구조

```jsx
} catch (err) {
  err.response?.data?.message  // 서버가 보낸 에러 (4xx/5xx)
  err.message                  // 네트워크 오류
  err.name === 'CanceledError' // 요청 취소 (cleanup)
}
```

---

## Spring Boot 연동 방법

### BookController.java
```java
@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "http://localhost:5173")
public class BookController {
    @GetMapping
    public List<Book> getBooks(@RequestParam(required=false) String category) { ... }

    @GetMapping("/{id}")
    public Book getBook(@PathVariable Long id) { ... }
}
```

### api.js baseURL
```js
baseURL: '/api'                          // Vite 프록시 사용 (기본값)
baseURL: 'http://localhost:8080/api'     // 직접 연결 시
```

---

## CORS 해결 방법

**방법 1: Vite 프록시 (이미 설정됨)**
```js
// vite.config.js
proxy: { '/api': 'http://localhost:8080' }
```

**방법 2: Spring Boot @CrossOrigin**
```java
@CrossOrigin(origins = "http://localhost:5173")
```
