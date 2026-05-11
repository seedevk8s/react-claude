# Day 8 — Axios + Spring Boot REST API 연동

## 학습 목표
- Axios 설치 및 기본 설정을 할 수 있다
- `axios.get / post / put / delete`로 REST API를 호출할 수 있다
- 공통 baseURL과 인터셉터를 설정할 수 있다
- Spring Boot `@RestController`와 React를 연동할 수 있다
- CORS 문제를 이해하고 해결할 수 있다

---

## 1. fetch vs Axios — 왜 Axios를 쓰는가

| 구분 | fetch (내장) | axios (라이브러리) |
|------|-------------|-------------------|
| 설치 | 불필요 | `npm install axios` |
| JSON 변환 | `res.json()` 수동 | 자동 변환 |
| 에러 처리 | 4xx/5xx도 성공 처리 | 4xx/5xx 자동 에러 |
| 요청 취소 | AbortController 필요 | CancelToken / AbortController |
| 인터셉터 | 직접 구현 | 내장 지원 |
| 타임아웃 | 직접 구현 | 옵션으로 설정 |

> 💡 **실무에서는 Axios가 압도적으로 많이 쓰인다**

---

## 2. Axios 설치

```bash
npm install axios
```

---

## 3. axios 기본 인스턴스 설정 — api.js

```js
// src/api/api.js
import axios from 'axios'

// [매핑] Spring Boot: application.yml server.port=8080
// React: baseURL로 백엔드 서버 주소 설정
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 요청 인터셉터 — 모든 요청 전에 실행
// (예: JWT 토큰 자동 첨부 — Day 10에서 활용)
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 응답 인터셉터 — 모든 응답 후에 실행
// (예: 401 → 로그인 페이지 이동)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
```

---

## 4. CRUD API 호출 패턴

```js
import api from '../api/api.js'

// GET — 목록 조회
// [매핑] @GetMapping("/books")
const fetchBooks = async (category) => {
  const params = category !== 'ALL' ? { category } : {}
  const res = await api.get('/books', { params })
  return res.data  // axios는 자동으로 res.data에 응답 데이터 담김
}

// GET — 단건 조회
// [매핑] @GetMapping("/books/{id}")
const fetchBook = async (id) => {
  const res = await api.get(`/books/${id}`)
  return res.data
}

// POST — 등록
// [매핑] @PostMapping("/books")
const createBook = async (bookData) => {
  const res = await api.post('/books', bookData)
  return res.data
}

// PUT — 수정
// [매핑] @PutMapping("/books/{id}")
const updateBook = async (id, bookData) => {
  const res = await api.put(`/books/${id}`, bookData)
  return res.data
}

// DELETE — 삭제
// [매핑] @DeleteMapping("/books/{id}")
const deleteBook = async (id) => {
  await api.delete(`/books/${id}`)
}
```

---

## 5. Spring Boot @RestController 설정

```java
// BookController.java
@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "http://localhost:5173")  // React 개발 서버 허용
public class BookController {

    @Autowired
    private BookService bookService;

    // GET /api/books 또는 GET /api/books?category=BOOK
    @GetMapping
    public ResponseEntity<List<Book>> getBooks(
            @RequestParam(required = false) String category) {
        List<Book> books = bookService.findAll(category);
        return ResponseEntity.ok(books);
    }

    // GET /api/books/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBook(@PathVariable Long id) {
        Book book = bookService.findById(id);
        return ResponseEntity.ok(book);
    }

    // POST /api/books
    @PostMapping
    public ResponseEntity<Book> createBook(@RequestBody Book book) {
        Book saved = bookService.save(book);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // PUT /api/books/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(
            @PathVariable Long id,
            @RequestBody Book book) {
        Book updated = bookService.update(id, book);
        return ResponseEntity.ok(updated);
    }

    // DELETE /api/books/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

---

## 6. CORS 문제와 해결

### 6-1. CORS란?
브라우저가 `다른 출처(origin)`의 리소스 요청을 차단하는 보안 정책

```
React (localhost:5173) → Spring Boot (localhost:8080)
                       ↑ 포트가 다름 → CORS 오류 발생!
```

### 6-2. 해결 방법

**방법 1: Controller에 @CrossOrigin**
```java
@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class BookController { ... }
```

**방법 2: 전역 CORS 설정 (권장)**
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE");
    }
}
```

**방법 3: Vite 프록시 설정 (개발 환경)**
```js
// vite.config.js — 개발 중 CORS 우회
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
// → axios baseURL을 '/api'로만 설정하면 됨
```

---

## 7. useEffect + Axios 완성 패턴

```jsx
// Day 6의 fetch → axios로 교체 (구조는 동일)
function Home() {
  const [books,   setBooks]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    const controller = new AbortController()  // cleanup용

    async function load() {
      try {
        setLoading(true); setError(null)
        const res = await api.get('/books', {
          signal: controller.signal
        })
        setBooks(res.data)  // axios: res.data에 응답 데이터
      } catch (err) {
        if (err.name === 'CanceledError') return  // cleanup 무시
        // axios 에러: err.response.data에 서버 에러 메시지
        setError(err.response?.data?.message || err.message)
      } finally {
        setLoading(false)
      }
    }

    load()
    return () => controller.abort()  // cleanup
  }, [])
}
```

---

## 8. 오후 프로젝트 실습 가이드

### Step 1. Axios 설치 및 api.js 생성 (20분)
```bash
npm install axios
```
```js
// src/api/api.js 생성
```

### Step 2. mockData.js → axios API 함수로 교체 (40분)
```js
// src/api/bookApi.js
import api from './api.js'

export const getBooks  = (category) => api.get('/books', { params: { category } })
export const getBook   = (id)       => api.get(`/books/${id}`)
export const createBook = (data)    => api.post('/books', data)
export const updateBook = (id, data) => api.put(`/books/${id}`, data)
export const deleteBook = (id)      => api.delete(`/books/${id}`)
```

### Step 3. Home.jsx & BookDetail.jsx에 적용 (40분)
```jsx
// mockData에서 import 제거 → bookApi에서 import
import { getBooks } from '../api/bookApi.js'

// useEffect 안에서
const res = await getBooks(category)
setBooks(res.data)
```

### Step 4. 에러 메시지 개선 (20분)
```jsx
// axios 에러 응답에서 서버 메시지 추출
setError(err.response?.data?.message || '서버에 연결할 수 없습니다.')
```

### 체크리스트
- [ ] `src/api/api.js` 에 baseURL이 올바르게 설정되어 있는가
- [ ] `res.data`로 응답 데이터에 접근하는가
- [ ] 에러 시 `err.response?.data?.message` 를 표시하는가
- [ ] useEffect cleanup에서 요청을 취소하는가

---

## 오늘의 핵심 정리

| # | 핵심 내용 |
|---|-----------|
| ✅ 1 | Axios = fetch 보다 편리한 HTTP 클라이언트 라이브러리 |
| ✅ 2 | `axios.create({ baseURL })` 로 공통 설정 인스턴스 생성 |
| ✅ 3 | 응답 데이터는 `res.data` 에 자동 저장 |
| ✅ 4 | `@CrossOrigin` 또는 전역 CORS 설정으로 포트 차이 해결 |
| ✅ 5 | Day 6 fetch 패턴 → axios로 교체 (구조 동일) |
| ✅ 6 | 에러: `err.response?.data?.message` 로 서버 메시지 추출 |

---

## 참고 자료
- [Axios 공식 문서](https://axios-http.com/docs/intro)
- [Spring Boot CORS](https://spring.io/guides/gs/rest-service-cors/)
