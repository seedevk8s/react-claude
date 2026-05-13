# Day 9 — CRUD 완성 (도서 등록 / 수정 / 삭제)

> 대상: Spring Boot + Thymeleaf 경험자 취준생  
> 시나리오: BookStore 도서 쇼핑몰 — 관리자가 도서를 등록·수정·삭제하는 기능 완성

---

## 학습 목표

- React에서 **폼(Form)** 을 제어 컴포넌트(Controlled Component)로 다루는 방법을 이해한다
- `useParams`로 URL 파라미터를 읽어 **등록/수정을 하나의 컴포넌트**에서 처리한다
- Axios로 **POST / PUT / DELETE** 요청을 보내고 결과를 반영한다
- 삭제 전 **확인 모달(Confirm Modal)** 을 띄워 UX를 개선한다
- 클라이언트 사이드 **폼 유효성 검사**를 직접 구현한다

---

## Thymeleaf 대응표

| Thymeleaf / Spring MVC | React |
|---|---|
| `<form th:action="@{/books}" method="post">` | `<form onSubmit={handleSubmit}>` |
| `<input th:field="*{title}">` | `<input value={form.title} onChange={...}>` |
| `th:if="${errors}"` 로 에러 표시 | `{errors.title && <span>...</span>}` |
| `@PostMapping("/books")` | `POST /api/books` (Spring Boot REST) |
| `@PutMapping("/books/{id}")` | `PUT /api/books/:id` (Spring Boot REST) |
| `@DeleteMapping("/books/{id}")` | `DELETE /api/books/:id` (Spring Boot REST) |
| `redirect:/books` | `navigate('/books')` (useNavigate) |
| `th:value="${book?.title}"` | `defaultValue` or 초기 state 세팅 |

---

## 1. 오늘의 변경 사항 요약 (Day 8 → Day 9)

```
Day 9 신규/변경 파일:
├── src/pages/BookForm.jsx       ← 🆕 등록/수정 통합 폼 컴포넌트
├── src/pages/BookDetail.jsx     ← ✏️ 삭제 버튼 + 확인 모달 추가
├── src/App.jsx                  ← ✏️ 라우트 2개 추가 (/books/new, /books/:id/edit)
└── src/api/bookApi.js           ← ✏️ createBook/updateBook/deleteBook 실제 호출
```

---

## 2. 제어 컴포넌트 (Controlled Component)

### Thymeleaf 방식 vs React 방식

```html
<!-- Thymeleaf: 서버가 폼 값을 바인딩 -->
<form th:action="@{/books}" th:object="${bookForm}" method="post">
  <input type="text" th:field="*{title}" />
  <span th:if="${#fields.hasErrors('title')}" th:errors="*{title}"></span>
</form>
```

```jsx
// React: 상태(state)가 폼 값을 바인딩 — "제어 컴포넌트"
function BookForm() {
  const [form, setForm] = useState({ title: '', author: '', price: '' });
  const [errors, setErrors] = useState({});

  // ✏️ Thymeleaf의 th:field 역할 → value + onChange
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="title"
        value={form.title}          // ← Thymeleaf: th:field="*{title}"
        onChange={handleChange}
        placeholder="도서 제목"
      />
      {errors.title && <span className="error-msg">{errors.title}</span>}
    </form>
  );
}
```

> **핵심**: React에서 폼 값은 항상 state에서 온다. input이 state를 "제어"하므로 "제어 컴포넌트"라고 부른다.

---

## 3. 등록/수정 통합 폼 — BookForm.jsx

### 등록 vs 수정 판별 로직

```jsx
// ✏️ Thymeleaf: th:action="${book == null ? '/books' : '/books/'+book.id}"
// React: URL 파라미터(id)로 판별

import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getBook, createBook, updateBook } from '../api/bookApi';

function BookForm() {
  const { id } = useParams();          // /books/:id/edit → id 존재
  const isEdit = Boolean(id);          // id가 있으면 수정 모드
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '', author: '', price: '', description: '', coverImage: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ✏️ 수정 모드: 기존 도서 데이터 불러오기 (Thymeleaf: th:value="${book.title}")
  useEffect(() => {
    if (isEdit) {
      getBook(id)
        .then(res => setForm(res.data))
        .catch(() => navigate('/books'));
    }
  }, [id]);

  // ...
}
```

### 유효성 검사

```jsx
// ✏️ Thymeleaf: @Valid + BindingResult → 서버 검사
// React: 제출 전 클라이언트 검사 → UX 향상 (서버 검사도 병행 필요)
const validate = () => {
  const newErrors = {};
  if (!form.title.trim())          newErrors.title = '제목을 입력하세요';
  if (!form.author.trim())         newErrors.author = '저자를 입력하세요';
  if (!form.price || form.price <= 0) newErrors.price = '올바른 가격을 입력하세요';
  return newErrors;
};

const handleSubmit = async (e) => {
  e.preventDefault();                      // ← Thymeleaf 없음 (서버 제출 막기)
  const newErrors = validate();
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setLoading(true);
  try {
    if (isEdit) {
      await updateBook(id, form);          // PUT /api/books/:id
    } else {
      await createBook(form);              // POST /api/books
    }
    navigate('/books');                    // ← Thymeleaf: redirect:/books
  } catch (err) {
    alert('저장에 실패했습니다.');
  } finally {
    setLoading(false);
  }
};
```

### 전체 BookForm.jsx

```jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getBook, createBook, updateBook } from '../api/bookApi';

export default function BookForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '', author: '', price: '', description: '', coverImage: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      getBook(id)
        .then(res => setForm(res.data))
        .catch(() => navigate('/books'));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // ✏️ 입력 시 해당 필드 에러 즉시 제거
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim())               newErrors.title = '제목을 입력하세요';
    if (!form.author.trim())              newErrors.author = '저자를 입력하세요';
    if (!form.price || Number(form.price) <= 0) newErrors.price = '올바른 가격을 입력하세요';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setLoading(true);
    try {
      if (isEdit) {
        await updateBook(id, form);
      } else {
        await createBook(form);
      }
      navigate('/books');
    } catch {
      alert('저장에 실패했습니다. 다시 시도하세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <h1 className="form-title">{isEdit ? '도서 수정' : '도서 등록'}</h1>

      <form onSubmit={handleSubmit} className="book-form">
        {/* 제목 */}
        <div className="form-group">
          <label>제목 *</label>
          <input name="title" value={form.title} onChange={handleChange} placeholder="도서 제목" />
          {errors.title && <span className="error-msg">{errors.title}</span>}
        </div>

        {/* 저자 */}
        <div className="form-group">
          <label>저자 *</label>
          <input name="author" value={form.author} onChange={handleChange} placeholder="저자명" />
          {errors.author && <span className="error-msg">{errors.author}</span>}
        </div>

        {/* 가격 */}
        <div className="form-group">
          <label>가격 *</label>
          <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="0" />
          {errors.price && <span className="error-msg">{errors.price}</span>}
        </div>

        {/* 설명 */}
        <div className="form-group">
          <label>설명</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} />
        </div>

        {/* 커버 이미지 URL */}
        <div className="form-group">
          <label>커버 이미지 URL</label>
          <input name="coverImage" value={form.coverImage} onChange={handleChange} placeholder="https://..." />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
            취소
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? '저장 중...' : (isEdit ? '수정 완료' : '등록')}
          </button>
        </div>
      </form>
    </div>
  );
}
```

---

## 4. 삭제 기능 — 확인 모달

### 삭제 흐름

```
사용자: 삭제 버튼 클릭
  → 확인 모달 표시 (isModalOpen = true)
  → "확인" 클릭 → DELETE /api/books/:id 호출
  → 성공 → navigate('/books')
  → "취소" 클릭 → 모달 닫기
```

### ConfirmModal 컴포넌트

```jsx
// ✏️ Thymeleaf: <dialog> 또는 JavaScript confirm() 사용
// React: 상태로 모달 표시/숨김 제어

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <p>{message}</p>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onCancel}>취소</button>
          <button className="btn-danger"   onClick={onConfirm}>삭제</button>
        </div>
      </div>
    </div>
  );
}
```

### BookDetail.jsx에서 모달 사용

```jsx
import { deleteBook } from '../api/bookApi';
import { useNavigate, useParams } from 'react-router-dom';

// ... 기존 BookDetail 코드에 추가

const [isModalOpen, setIsModalOpen] = useState(false);

const handleDelete = async () => {
  try {
    await deleteBook(id);              // DELETE /api/books/:id
    navigate('/books');               // 삭제 후 목록으로
  } catch {
    alert('삭제에 실패했습니다.');
  }
};

// JSX
<>
  <button className="btn-secondary" onClick={() => navigate(`/books/${id}/edit`)}>
    수정
  </button>
  <button className="btn-danger" onClick={() => setIsModalOpen(true)}>
    삭제
  </button>

  {isModalOpen && (
    <ConfirmModal
      message="정말 이 도서를 삭제하시겠습니까?"
      onConfirm={handleDelete}
      onCancel={() => setIsModalOpen(false)}
    />
  )}
</>
```

---

## 5. 라우트 추가 — App.jsx

```jsx
// ✏️ Thymeleaf: @GetMapping("/books/new"), @GetMapping("/books/{id}/edit")
// React Router: 클라이언트 사이드 라우팅

import BookForm from './pages/BookForm';

// Routes 안에 추가
<Route path="/books/new"       element={<BookForm />} />
<Route path="/books/:id/edit"  element={<BookForm />} />
```

> ⚠️ `/books/new`가 `/books/:id`보다 **위에** 있어야 한다. React Router는 위에서 아래로 매칭한다.

---

## 6. bookApi.js 업데이트

```javascript
// src/api/bookApi.js

import api from './api';

// ✏️ Day 8에서 이미 선언했던 함수들 — 오늘은 실제로 호출됨!
export const getBooks   = ()        => api.get('/books');
export const getBook    = (id)      => api.get(`/books/${id}`);
export const createBook = (data)    => api.post('/books', data);      // POST
export const updateBook = (id, data)=> api.put(`/books/${id}`, data); // PUT
export const deleteBook = (id)      => api.delete(`/books/${id}`);    // DELETE
```

---

## 7. Tailwind 스타일 — index.css

```css
@layer components {
  /* 폼 전체 컨테이너 */
  .form-page {
    @apply max-w-2xl mx-auto py-10 px-4;
  }
  .form-title {
    @apply text-2xl font-bold text-gray-800 mb-6;
  }
  .book-form {
    @apply bg-white rounded-2xl shadow-sm p-8 space-y-5;
  }

  /* 폼 그룹 */
  .form-group {
    @apply flex flex-col gap-1;
  }
  .form-group label {
    @apply text-sm font-medium text-gray-700;
  }
  .form-group input,
  .form-group textarea {
    @apply border border-gray-300 rounded-lg px-4 py-2 text-sm
           focus:outline-none focus:ring-2 focus:ring-indigo-400;
  }
  .error-msg {
    @apply text-red-500 text-xs mt-0.5;
  }

  /* 버튼 그룹 */
  .form-actions {
    @apply flex justify-end gap-3 pt-2;
  }
  .btn-primary {
    @apply bg-indigo-600 text-white px-6 py-2 rounded-lg
           hover:bg-indigo-700 disabled:opacity-50 transition;
  }
  .btn-secondary {
    @apply bg-gray-100 text-gray-700 px-6 py-2 rounded-lg
           hover:bg-gray-200 transition;
  }
  .btn-danger {
    @apply bg-red-500 text-white px-6 py-2 rounded-lg
           hover:bg-red-600 transition;
  }

  /* 확인 모달 */
  .modal-overlay {
    @apply fixed inset-0 bg-black/40 flex items-center justify-center z-50;
  }
  .modal-box {
    @apply bg-white rounded-2xl shadow-xl p-8 w-80 text-center;
  }
  .modal-actions {
    @apply flex justify-center gap-3 mt-6;
  }
}
```

---

## 8. Spring Boot 백엔드 대응 (참고)

```java
// BookController.java (Spring Boot)
@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "http://localhost:5173")  // Vite 개발서버
public class BookController {

    @PostMapping                          // POST /api/books
    public ResponseEntity<Book> create(@RequestBody BookDto dto) { ... }

    @PutMapping("/{id}")                  // PUT /api/books/:id
    public ResponseEntity<Book> update(@PathVariable Long id, @RequestBody BookDto dto) { ... }

    @DeleteMapping("/{id}")               // DELETE /api/books/:id
    public ResponseEntity<Void> delete(@PathVariable Long id) { ... }
}
```

---

## 9. 오늘의 데이터 흐름 요약

```
[BookForm - 등록]
  사용자 입력 → state(form) 업데이트
  → 제출 → validate() 검사
  → 통과 시 createBook(form) 호출 (POST /api/books)
  → 성공 → navigate('/books')

[BookForm - 수정]
  useEffect → getBook(id) 호출 → form state 초기화
  → 사용자 수정 → 제출 → updateBook(id, form) (PUT /api/books/:id)
  → 성공 → navigate('/books')

[BookDetail - 삭제]
  삭제 버튼 클릭 → isModalOpen = true
  → 확인 → deleteBook(id) (DELETE /api/books/:id)
  → 성공 → navigate('/books')
```

---

## 10. 실습 과제

| 번호 | 과제 |
|------|------|
| ① | BookForm.jsx 완성 후 `/books/new` 에서 도서 등록 테스트 |
| ② | BookDetail.jsx 수정 버튼 클릭 시 `/books/:id/edit` 이동 확인 |
| ③ | 삭제 모달에서 "취소" 클릭 시 이동 없이 닫히는지 확인 |
| ④ | (도전) 폼에 `coverImage` URL 입력 시 미리보기 이미지 표시 |
| ⑤ | (도전) 가격 필드에 숫자 외 입력 차단 (`onKeyDown` 활용) |

---

## 오늘의 핵심 정리

| 개념 | 설명 |
|------|------|
| 제어 컴포넌트 | state가 input 값을 항상 제어. `value + onChange` 세트 필수 |
| 등록/수정 통합 | `useParams`로 id 여부 판별 → 하나의 컴포넌트로 두 역할 수행 |
| 폼 유효성 검사 | 제출 전 validate() → errors state에 저장 → 조건부 렌더링 |
| 삭제 확인 모달 | state로 표시/숨김 제어. 불가역 작업에 반드시 확인 단계 추가 |
| navigate(-1) | 뒤로가기. Thymeleaf의 redirect와 달리 히스토리 스택 활용 |
