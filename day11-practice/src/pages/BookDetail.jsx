// src/pages/BookDetail.jsx — Day 11 리팩토링: useFetch + notify 적용
import { useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getBook, deleteBook } from '../api/bookApi'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useFetch } from '../hooks/useFetch'
import { notify } from '../utils/notify'
import ConfirmModal from '../components/ConfirmModal'

export default function BookDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)

  // ✅ useFetch로 단순화
  const fetchFn = useCallback(() => getBook(id), [id])
  const { data: book, loading } = useFetch(fetchFn, [id])

  const handleDelete = async () => {
    try {
      await deleteBook(id)
      notify.success('도서가 삭제되었습니다.')  // ✅ notify 사용
      navigate('/')
    } catch {
      notify.error('삭제에 실패했습니다. 다시 시도하세요.')
      setIsModalOpen(false)
    }
  }

  if (loading) return <div className="loading-box">도서 정보를 불러오는 중...</div>
  if (!book)   return <div className="error-box">도서를 찾을 수 없습니다.</div>

  return (
    <div className="detail-container">
      <Link to="/" className="text-indigo-600 text-sm hover:underline mb-6 inline-block">← 목록으로</Link>
      <div className="detail-card">
        <img src={book.coverImage || `https://via.placeholder.com/200x280/4338CA/FFFFFF?text=${encodeURIComponent(book.title)}`}
          alt={book.title} className="detail-img" />
        <div className="detail-info">
          <h1 className="detail-title">{book.title}</h1>
          <p className="detail-author">{book.author}</p>
          <p className="detail-price">{book.price?.toLocaleString()}원</p>
          <p className="detail-desc">{book.description || '설명이 없습니다.'}</p>
          <div className="detail-actions">
            <button className="btn-primary" onClick={() => addToCart(book)}>🛒 장바구니 담기</button>
            {user?.role === 'ADMIN' && (
              <>
                <Link to={`/books/${id}/edit`} className="btn-secondary">✏️ 수정</Link>
                <button className="btn-danger" onClick={() => setIsModalOpen(true)}>🗑️ 삭제</button>
              </>
            )}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <ConfirmModal title="도서 삭제"
          message={`"${book.title}"을(를) 정말 삭제하시겠습니까?`}
          onConfirm={handleDelete} onCancel={() => setIsModalOpen(false)} />
      )}
    </div>
  )
}
