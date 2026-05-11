// pages/Home.jsx — 홈 페이지 (도서 목록)
//
// ✏️ Day 7 변경:
//   - 도서 카드 클릭 → useNavigate로 /books/:id 이동
//   - 장바구니 state는 App.jsx가 보유, props로 내려받음

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchBooks, MOCK_BOOKS } from '../mockData.js'

const CATEGORIES = ['ALL', 'BOOK', 'DEVICE', 'SUPPLIES']
const EMOJI = { BOOK:'📗', DEVICE:'⌨️', SUPPLIES:'🏷️' }

function Home({ cart = [], cartIds = [], onAddToCart }) {

  const navigate = useNavigate()

  // 데이터 로딩 state
  const [books,   setBooks]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  // 검색·필터·정렬 state
  const [search,   setSearch]   = useState('')
  const [category, setCategory] = useState('ALL')
  const [sortBy,   setSortBy]   = useState('default')

  // ✏️ useEffect: category 바뀔 때마다 데이터 재로딩
  useEffect(() => {
    async function load() {
      try {
        setLoading(true); setError(null)
        const data = await fetchBooks(category)
        setBooks(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [category])

  // 파생 데이터
  const displayed = books
    .filter(b => b.title.includes(search) || b.author.includes(search))
    .sort((a, b) => {
      if (sortBy === 'price-asc')  return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      return 0
    })

  return (
    <div>
      {/* 툴바 */}
      <div className="toolbar">
        <input className="search-input" type="text" value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="도서명 또는 저자 검색..." />
        <div className="filter-group">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={category===cat ? 'btn-filter-active' : 'btn-filter'}>
              {cat}
            </button>
          ))}
        </div>
        <select className="sort-select" value={sortBy}
          onChange={e => setSortBy(e.target.value)}>
          <option value="default">기본 순서</option>
          <option value="price-asc">가격 낮은 순</option>
          <option value="price-desc">가격 높은 순</option>
        </select>
      </div>

      {/* UI 분기 */}
      {loading ? (
        <div className="loading-wrap">
          <div className="loading-spin" />
          <p className="loading-text">도서 목록을 불러오는 중...</p>
        </div>
      ) : error ? (
        <div className="error-wrap">
          <p className="text-5xl">❌</p>
          <p className="text-red-600 font-semibold">{error}</p>
        </div>
      ) : (
        <>
          <p className="result-summary">
            {search ? `검색: ${displayed.length}권` : `${category} — ${books.length}권`}
          </p>
          <div className="book-grid">
            {displayed.length > 0 ? displayed.map(book => (
              <div key={book.id} className="book-card"
                onClick={() => navigate(`/books/${book.id}`)}>
                {/*
                  ✏️ 카드 전체 클릭 → /books/:id 이동
                     useNavigate 사용 (onClick 이벤트이므로 Link 대신)
                     [매핑] <a th:href="@{/books/{id}(id=${book.id})}">
                */}
                <div>
                  <div className="book-badges">
                    {book.isNew  && <span className="badge-new">NEW</span>}
                    {book.isSale && <span className="badge-sale">SALE</span>}
                    {cartIds.includes(book.id) && <span className="badge-in-cart">담김</span>}
                  </div>
                  <p className="text-3xl mb-2">{EMOJI[book.category] || '📦'}</p>
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">{book.author}</p>
                  <p className="book-category">{book.category}</p>
                  <p className="book-price">{book.price.toLocaleString()}원</p>
                </div>

                {/* 버튼 클릭은 카드 이동과 별도 처리 */}
                {book.inStock ? (
                  cartIds.includes(book.id) ? (
                    <button className="btn-added"
                      onClick={e => { e.stopPropagation(); onAddToCart(book) }}>
                      ✅ 담김 (추가)
                    </button>
                  ) : (
                    <button className="btn-buy"
                      onClick={e => { e.stopPropagation(); onAddToCart(book) }}>
                      🛒 장바구니
                    </button>
                  )
                ) : (
                  <button className="btn-soldout" disabled
                    onClick={e => e.stopPropagation()}>
                    품절
                  </button>
                )}
              </div>
            )) : (
              <div className="empty-result">
                <p className="text-4xl mb-3">🔍</p>
                <p className="font-semibold text-gray-500">검색 결과가 없습니다.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default Home
