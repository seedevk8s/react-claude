// pages/BookDetail.jsx — 도서 상세 페이지
//
// ✏️ 오늘의 핵심: useParams + useNavigate
//    [매핑] @GetMapping("/books/{id}") + @PathVariable Long id
//           → useParams() → const { id } = useParams()

import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { fetchBook } from '../mockData.js'

const EMOJI = { BOOK:'📗', DEVICE:'⌨️', SUPPLIES:'🏷️' }

function BookDetail({ cartIds = [], onAddToCart }) {

  // ✏️ useParams: URL의 :id 파라미터를 읽는다
  //    [매핑] @PathVariable Long id
  //    /books/3 접속 시 → id = "3" (항상 문자열!)
  const { id } = useParams()

  // ✏️ useNavigate: 코드로 페이지 이동
  //    [매핑] return "redirect:/books"
  const navigate = useNavigate()

  const [book,    setBook]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true); setError(null)
        // ✏️ useParams는 문자열 반환 → Number()로 변환 필수
        //    [매핑] Long id → parseInt 자동 변환되지만
        //           React에서는 명시적으로 변환해야 한다
        const data = await fetchBook(Number(id))
        setBook(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])  // ✏️ id 바뀌면 재요청 (다른 책 상세로 이동할 때)

  if (loading) return (
    <div className="loading-wrap">
      <div className="loading-spin" />
      <p className="loading-text">도서 정보를 불러오는 중...</p>
    </div>
  )

  if (error) return (
    <div className="error-wrap">
      <p className="text-5xl">❌</p>
      <p className="text-red-600 font-semibold">{error}</p>
      {/* ✏️ useNavigate(-1): 브라우저 뒤로가기 */}
      <button className="btn-retry" onClick={() => navigate(-1)}>← 뒤로</button>
    </div>
  )

  if (!book) return null

  const isInCart = cartIds.includes(book.id)

  return (
    <div className="detail-wrap">

      {/* 뒤로가기 */}
      <div className="flex items-center gap-3 mb-6">
        {/*
          ✏️ navigate(-1): 이전 페이지로 이동 (브라우저 히스토리)
             [매핑] response.sendRedirect("history.back()") 개념
        */}
        <button className="btn-secondary" onClick={() => navigate(-1)}>
          ← 뒤로가기
        </button>
        {/*
          ✏️ Link to="/": 홈으로 이동
             [매핑] <a th:href="@{/}">홈으로</a>
        */}
        <Link to="/" className="btn-secondary">🏠 홈으로</Link>
      </div>

      {/* 상세 카드 */}
      <div className="detail-card">
        <div className="flex flex-col sm:flex-row gap-8">

          {/* 이미지 영역 */}
          <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-8 min-w-[200px]">
            <span className="detail-emoji">{EMOJI[book.category] || '📦'}</span>
            <span className="text-sm text-gray-400">{book.category}</span>
          </div>

          {/* 정보 영역 */}
          <div className="flex-1">
            {/* 뱃지 */}
            <div className="flex gap-2 mb-3">
              {book.isNew  && <span className="detail-badge bg-green-100 text-green-700">NEW</span>}
              {book.isSale && <span className="detail-badge bg-red-100 text-red-700">SALE</span>}
              {isInCart    && <span className="detail-badge bg-rose-100 text-rose-700">장바구니에 담김</span>}
            </div>

            <h1 className="detail-title">{book.title}</h1>
            <p className="detail-author">저자: {book.author}</p>
            <p className="text-sm text-gray-500 mt-1">
              {/* ✏️ URL 파라미터 id를 화면에 표시 */}
              도서 ID: {id}  ←  useParams()로 읽은 값
            </p>

            <p className="detail-price">{book.price.toLocaleString()}원</p>

            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {book.description}
            </p>

            {/* 재고 상태 */}
            <p className={`text-sm font-semibold mb-4 ${book.inStock ? 'text-green-600' : 'text-red-500'}`}>
              {book.inStock ? '✅ 재고 있음' : '❌ 품절'}
            </p>

            {/* 구매 버튼 */}
            {book.inStock ? (
              <button
                className={isInCart ? 'btn-added w-full sm:w-auto px-8 py-3' : 'btn-buy w-full sm:w-auto px-8 py-3'}
                onClick={() => onAddToCart(book)}
              >
                {isInCart ? '✅ 장바구니에 담김 (추가)' : '🛒 장바구니에 담기'}
              </button>
            ) : (
              <button className="btn-soldout w-full sm:w-auto px-8 py-3" disabled>
                품절
              </button>
            )}

            {/* 장바구니 바로가기 */}
            {isInCart && (
              <div className="mt-3">
                {/*
                  ✏️ Link to="/cart": 장바구니 페이지로 이동
                     [매핑] <a th:href="@{/cart}">
                */}
                <Link to="/cart" className="text-sm text-rose-600 underline">
                  장바구니 보기 →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetail
