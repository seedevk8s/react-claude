import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getBook, deleteBook } from '../api/bookApi'
import { mockBooks } from '../mockData'
import ConfirmModal from '../components/ConfirmModal'

// ✏️ Thymeleaf: @GetMapping("/books/{id}") → model.addAttribute("book", book)
// React: useParams로 URL에서 id를 읽고 API 호출

export default function BookDetail({ onAddCart }) {
  const { id } = useParams()                   // ✏️ @PathVariable Long id 와 동일
  const navigate = useNavigate()

  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)

  // ─── Day 9 신규: 삭제 모달 상태 ───────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    getBook(id)
      .then(res => setBook(res.data))
      .catch(() => {
        // Fallback: mockData에서 찾기
        const found = mockBooks.find(b => String(b.id) === id)
        if (found) setBook(found)
        else navigate('/404')
      })
      .finally(() => setLoading(false))
  }, [id])

  // ✏️ Thymeleaf: @DeleteMapping("/books/{id}") + redirect:/books
  const handleDelete = async () => {
    try {
      await deleteBook(id)          // DELETE /api/books/:id
      navigate('/books')             // 삭제 후 목록으로 이동
    } catch (err) {
      console.error('삭제 실패:', err)
      alert('삭제에 실패했습니다. 다시 시도하세요.')
      setIsModalOpen(false)
    }
  }

  if (loading) return <div className="loading-box">도서 정보를 불러오는 중...</div>
  if (!book)   return <div className="error-box">도서를 찾을 수 없습니다.</div>

  return (
    <div className="detail-container">
      {/* 뒤로가기 */}
      <Link to="/" className="text-indigo-600 text-sm hover:underline mb-6 inline-block">
        ← 목록으로
      </Link>

      <div className="detail-card">
        {/* 커버 이미지 */}
        <img
          src={book.coverImage || `https://via.placeholder.com/200x280/4338CA/FFFFFF?text=${encodeURIComponent(book.title)}`}
          alt={book.title}
          className="detail-img"
        />

        {/* 도서 정보 */}
        <div className="detail-info">
          <h1 className="detail-title">{book.title}</h1>
          <p className="detail-author">{book.author}</p>
          <p className="detail-price">{book.price?.toLocaleString()}원</p>
          <p className="detail-desc">{book.description || '설명이 없습니다.'}</p>

          {/* ─── 액션 버튼 ─────────────────────────────── */}
          <div className="detail-actions">
            <button className="btn-primary" onClick={() => onAddCart?.(book)}>
              🛒 장바구니 담기
            </button>

            {/* ✏️ Day 9 신규: 수정 버튼 → BookForm (수정 모드) */}
            <Link to={`/books/${id}/edit`} className="btn-secondary">
              ✏️ 수정
            </Link>

            {/* ✏️ Day 9 신규: 삭제 버튼 → 확인 모달 표시 */}
            <button className="btn-danger" onClick={() => setIsModalOpen(true)}>
              🗑️ 삭제
            </button>
          </div>
        </div>
      </div>

      {/* ─── 삭제 확인 모달 ────────────────────────────────
          ✏️ isModalOpen이 true일 때만 렌더링 (조건부 렌더링) */}
      {isModalOpen && (
        <ConfirmModal
          title="도서 삭제"
          message={`"${book.title}"을(를) 정말 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`}
          onConfirm={handleDelete}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}
