// pages/BookDetail.jsx — Day 8: mockData → axios 교체
//
// ✏️ Day 7 vs Day 8 핵심 차이:
//    Day 7: import { fetchBook } from '../mockData.js'
//           const data = await fetchBook(Number(id))
//           setBook(data)
//    Day 8: import { getBook }  from '../api/bookApi.js'
//           const res = await getBook(Number(id))
//           setBook(res.data)

import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getBook }     from '../api/bookApi.js'
import { MOCK_BOOKS }  from '../mockData.js'   // Fallback용

const EMOJI = { BOOK:'📗', DEVICE:'⌨️', SUPPLIES:'🏷️' }

function BookDetail({ cartIds = [], onAddToCart }) {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [book,    setBook]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true); setError(null)
        // ✏️ axios 호출 — useParams의 id는 문자열이므로 Number() 변환 필수
        const res = await getBook(Number(id))
        setBook(res.data)   // ← axios: res.data 에 응답 객체
      } catch (err) {
        // ✏️ Fallback: API 실패 시 Mock 데이터에서 찾기
        console.warn('API 실패, Mock 사용:', err.message)
        const fallback = MOCK_BOOKS.find(b => b.id === Number(id))
        if (fallback) setBook(fallback)
        else setError(err.response?.data?.message || `도서(id:${id})를 찾을 수 없습니다.`)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return (
    <div className="loading-wrap"><div className="loading-spin"/><p className="loading-text">도서 정보 로딩 중...</p></div>
  )
  if (error) return (
    <div className="error-wrap">
      <p className="text-5xl">❌</p>
      <p className="text-red-600 font-semibold">{error}</p>
      <button className="btn-retry" onClick={() => navigate(-1)}>← 뒤로</button>
    </div>
  )
  if (!book) return null

  const isInCart = cartIds.includes(book.id)

  return (
    <div className="detail-wrap">
      <div className="flex items-center gap-3 mb-6">
        <button className="btn-secondary" onClick={() => navigate(-1)}>← 뒤로가기</button>
        <Link to="/" className="btn-secondary">🏠 홈으로</Link>
      </div>

      <div className="detail-card">
        <div className="flex flex-col sm:flex-row gap-8">
          <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-8 min-w-[200px]">
            <span className="detail-emoji">{EMOJI[book.category]||'📦'}</span>
            <span className="text-sm text-gray-400">{book.category}</span>
          </div>
          <div className="flex-1">
            <div className="flex gap-2 mb-3">
              {book.isNew  && <span className="detail-badge bg-green-100 text-green-700">NEW</span>}
              {book.isSale && <span className="detail-badge bg-red-100 text-red-700">SALE</span>}
              {isInCart    && <span className="detail-badge bg-rose-100 text-rose-700">장바구니 담김</span>}
            </div>
            <h1 className="detail-title">{book.title}</h1>
            <p className="detail-author">저자: {book.author}</p>
            <p className="text-xs text-gray-400 mt-1">
              ID: {id}  ←  useParams()  /  GET /api/books/{id}
            </p>
            <p className="detail-price">{book.price.toLocaleString()}원</p>
            {book.description && (
              <p className="text-gray-600 text-sm leading-relaxed mb-6">{book.description}</p>
            )}
            <p className={`text-sm font-semibold mb-4 ${book.inStock ? 'text-green-600' : 'text-red-500'}`}>
              {book.inStock ? '✅ 재고 있음' : '❌ 품절'}
            </p>
            {book.inStock ? (
              <button
                className={`${isInCart ? 'btn-added' : 'btn-buy'} w-full sm:w-auto px-8 py-3`}
                onClick={() => onAddToCart(book)}>
                {isInCart ? '✅ 장바구니에 담김 (추가)' : '🛒 장바구니에 담기'}
              </button>
            ) : (
              <button className="btn-soldout w-full sm:w-auto px-8 py-3" disabled>품절</button>
            )}
            {isInCart && (
              <div className="mt-3">
                <Link to="/cart" className="text-sm text-rose-600 underline">장바구니 보기 →</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default BookDetail
