// src/api/bookApi.js — 도서 관련 API 함수 모음
//
// ✏️ Day 7까지: src/mockData.js 에서 가짜 데이터 반환
//    Day 8부터: 실제 Spring Boot REST API 호출
//
// [매핑]
//   getBooks()   → @GetMapping("/api/books")
//   getBook(id)  → @GetMapping("/api/books/{id}")
//   createBook() → @PostMapping("/api/books")
//   updateBook() → @PutMapping("/api/books/{id}")
//   deleteBook() → @DeleteMapping("/api/books/{id}")

import api from './api.js'

// ✏️ GET /api/books?category=BOOK
//    [매핑] @GetMapping, @RequestParam(required=false) String category
export const getBooks = (category = 'ALL') => {
  const params = category !== 'ALL' ? { category } : {}
  return api.get('/books', { params })
  // 반환값: axios Response 객체
  // 응답 데이터: res.data (List<Book> JSON 배열)
}

// ✏️ GET /api/books/:id
//    [매핑] @GetMapping("/{id}"), @PathVariable Long id
export const getBook = (id) => {
  return api.get(`/books/${id}`)
  // 반환값: axios Response 객체
  // 응답 데이터: res.data (Book JSON 객체)
}

// ✏️ POST /api/books
//    [매핑] @PostMapping, @RequestBody Book book
export const createBook = (bookData) => {
  return api.post('/books', bookData)
  // bookData: { title, author, price, category, inStock }
  // 응답: 201 Created + 생성된 Book 객체
}

// ✏️ PUT /api/books/:id
//    [매핑] @PutMapping("/{id}"), @PathVariable Long id, @RequestBody Book book
export const updateBook = (id, bookData) => {
  return api.put(`/books/${id}`, bookData)
}

// ✏️ DELETE /api/books/:id
//    [매핑] @DeleteMapping("/{id}"), @PathVariable Long id
export const deleteBook = (id) => {
  return api.delete(`/books/${id}`)
  // 응답: 204 No Content
}
