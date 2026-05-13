import { useEffect, useState } from 'react'
import BookCard from '../components/BookCard'
import { getBooks } from '../api/bookApi'
import { mockBooks } from '../mockData'

// ✏️ Day 10: onAddCart props 제거 → BookCard 내부에서 useCart() 사용
export default function Home() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBooks()
      .then(res => setBooks(res.data))
      .catch(() => { console.warn('Mock 데이터 사용'); setBooks(mockBooks) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading-box">도서 목록을 불러오는 중...</div>

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title mb-0">📚 전체 도서 목록</h1>
        <span className="text-sm text-gray-400">총 {books.length}권</span>
      </div>
      {books.length === 0 ? (
        <div className="empty-box"><p className="text-4xl mb-3">📭</p><p>등록된 도서가 없습니다.</p></div>
      ) : (
        <div className="books-grid">
          {books.map(book => <BookCard key={book.id} book={book} />)}
        </div>
      )}
    </div>
  )
}
