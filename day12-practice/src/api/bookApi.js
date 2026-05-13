import api from './api'

// ✏️ Thymeleaf: @GetMapping("/books") → Model에 books 추가
// React: Axios로 JSON 목록 가져오기
export const getBooks = () => api.get('/books')

// ✏️ Thymeleaf: @GetMapping("/books/{id}")
export const getBook = (id) => api.get(`/books/${id}`)

// ─── Day 9에서 실제로 호출되는 함수들 ─────────────────────

// ✏️ Thymeleaf: @PostMapping("/books") + redirect:/books
// React: POST 요청 후 navigate('/books')
export const createBook = (data) => api.post('/books', data)

// ✏️ Thymeleaf: @PutMapping("/books/{id}") + redirect:/books
// React: PUT 요청 후 navigate('/books')
export const updateBook = (id, data) => api.put(`/books/${id}`, data)

// ✏️ Thymeleaf: @DeleteMapping("/books/{id}") + redirect:/books
// React: DELETE 요청 후 navigate('/books')
export const deleteBook = (id) => api.delete(`/books/${id}`)
