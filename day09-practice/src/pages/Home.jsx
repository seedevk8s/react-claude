import { useEffect, useState } from 'react'
import BookCard from '../components/BookCard'
import { getBooks } from '../api/bookApi'
import { mockBooks } from '../mockData'

// ✏️ Thymeleaf: @GetMapping("/") → model.addAttribute("books", books)
// React: useEffect로 컴포넌트 마운트 시 데이터 로드

export default function Home({ onAddCart }) {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ✏️ useEffect: 컴포넌트가 화면에 나타날 때 API 호출
  useEffect(() => {
    getBooks()
      .then(res => setBooks(res.data))
      .catch(() => {
        console.warn('API 연결 실패 → Mock 데이터 사용')
        setBooks(mockBooks)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading-box">도서 목록을 불러오는 중...</div>
  if (error)   return <div className="error-box">오류가 발생했습니다.</div>

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title mb-0">📚 전체 도서 목록</h1>
        <span className="text-sm text-gray-400">총 {books.length}권</span>
      </div>

      {books.length === 0 ? (
        <div className="empty-box">
          <p className="text-4xl mb-3">📭</p>
          <p>등록된 도서가 없습니다.</p>
        </div>
      ) : (
        <div className="books-grid">
          {/* ✏️ Thymeleaf: th:each="book : ${books}" */}
          {books.map(book => (
            <BookCard key={book.id} book={book} onAddCart={onAddCart} />
          ))}
        </div>
      )}
    </div>
  )
}
