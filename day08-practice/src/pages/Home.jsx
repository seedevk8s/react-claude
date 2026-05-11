// pages/Home.jsx — Day 8: mockData → axios 교체
//
// ✏️ Day 7 vs Day 8 핵심 차이:
//    Day 7: import { fetchBooks } from '../mockData.js'
//           const data = await fetchBooks(category)
//           setBooks(data)
//    Day 8: import { getBooks }   from '../api/bookApi.js'
//           const res = await getBooks(category)
//           setBooks(res.data)   ← axios는 반드시 res.data

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBooks }     from '../api/bookApi.js'
import { MOCK_BOOKS }   from '../mockData.js'      // Fallback용

const CATEGORIES = ['ALL', 'BOOK', 'DEVICE', 'SUPPLIES']
const EMOJI = { BOOK:'📗', DEVICE:'⌨️', SUPPLIES:'🏷️' }

function Home({ cart = [], cartIds = [], onAddToCart }) {
  const navigate = useNavigate()

  const [books,    setBooks]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)
  const [search,   setSearch]   = useState('')
  const [category, setCategory] = useState('ALL')
  const [sortBy,   setSortBy]   = useState('default')

  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      try {
        setLoading(true); setError(null)
        // ✏️ axios 호출 — res.data 에 응답 데이터
        const res = await getBooks(category)
        setBooks(res.data)
      } catch (err) {
        if (err.name === 'CanceledError') return
        // ✏️ 서버 없을 때 Fallback
        console.warn('API 실패, Mock 사용:', err.message)
        const fb = category === 'ALL' ? MOCK_BOOKS : MOCK_BOOKS.filter(b => b.category === category)
        setBooks(fb)
        // 실제 서버 연동 시: setError(err.response?.data?.message || err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => controller.abort()
  }, [category])

  const displayed = books
    .filter(b => b.title.includes(search) || b.author.includes(search))
    .sort((a, b) => {
      if (sortBy === 'price-asc')  return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      return 0
    })

  return (
    <div>
      <div className="toolbar">
        <input className="search-input" type="text" value={search}
          onChange={e => setSearch(e.target.value)} placeholder="도서명 또는 저자 검색..." />
        <div className="filter-group">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={category === cat ? 'btn-filter-active' : 'btn-filter'}>{cat}</button>
          ))}
        </div>
        <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="default">기본 순서</option>
          <option value="price-asc">가격 낮은 순</option>
          <option value="price-desc">가격 높은 순</option>
        </select>
      </div>

      {loading ? (
        <div className="loading-wrap"><div className="loading-spin"/><p className="loading-text">불러오는 중...</p></div>
      ) : error ? (
        <div className="error-wrap">
          <p className="text-5xl">❌</p>
          <p className="text-red-600 font-semibold">{error}</p>
          <button className="btn-retry" onClick={() => setCategory(prev => prev)}>다시 시도</button>
        </div>
      ) : (
        <>
          <p className="result-summary">{search ? `검색: ${displayed.length}권` : `${category} — ${books.length}권`}</p>
          <div className="book-grid">
            {displayed.length > 0 ? displayed.map(book => (
              <div key={book.id} className="book-card" onClick={() => navigate(`/books/${book.id}`)}>
                <div>
                  <div className="book-badges">
                    {book.isNew  && <span className="badge-new">NEW</span>}
                    {book.isSale && <span className="badge-sale">SALE</span>}
                    {cartIds.includes(book.id) && <span className="badge-in-cart">담김</span>}
                  </div>
                  <p className="text-3xl mb-2">{EMOJI[book.category]||'📦'}</p>
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">{book.author}</p>
                  <p className="book-category">{book.category}</p>
                  <p className="book-price">{book.price.toLocaleString()}원</p>
                </div>
                {book.inStock ? (
                  cartIds.includes(book.id)
                    ? <button className="btn-added" onClick={e=>{e.stopPropagation();onAddToCart(book)}}>✅ 담김</button>
                    : <button className="btn-buy"   onClick={e=>{e.stopPropagation();onAddToCart(book)}}>🛒 장바구니</button>
                ) : (
                  <button className="btn-soldout" disabled onClick={e=>e.stopPropagation()}>품절</button>
                )}
              </div>
            )) : (
              <div className="empty-result"><p className="text-4xl mb-3">🔍</p><p className="font-semibold text-gray-500">검색 결과 없음</p></div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
export default Home
