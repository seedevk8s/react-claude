// Home.jsx — Day 5 핵심 실습
//
// 오늘 배우는 것:
//   1. 여러 state 조합 (search + category + sortBy)
//   2. 파생 데이터 — 별도 state 없이 렌더링 시 계산
//   3. 제어 컴포넌트 — value={state} + onChange
//   4. 객체 state 불변성 — { ...obj, field: newValue }
//   5. 배열 state 불변성 — map / filter / 스프레드

import { useState } from 'react'
import BookCard from '../components/BookCard.jsx'

// ✏️ 나중에 useEffect + Axios 로 GET /api/books 에서 받아올 데이터
const books = [
  { id: 1, title: '클린 코드',            author: '로버트 마틴',   price: 33000, category: 'BOOK',     inStock: true,  isNew: false, isSale: false },
  { id: 2, title: '리팩터링 2판',          author: '마틴 파울러',   price: 36000, category: 'BOOK',     inStock: true,  isNew: true,  isSale: false },
  { id: 3, title: '자바 ORM 표준 JPA',    author: '김영한',        price: 43000, category: 'BOOK',     inStock: false, isNew: false, isSale: false },
  { id: 4, title: '모던 자바스크립트',      author: '이웅모',        price: 32000, category: 'BOOK',     inStock: true,  isNew: true,  isSale: true  },
  { id: 5, title: '알고리즘 인터뷰',       author: '박종건',        price: 28000, category: 'BOOK',     inStock: false, isNew: false, isSale: true  },
  { id: 6, title: '도메인 주도 설계',      author: '에릭 에반스',   price: 39000, category: 'BOOK',     inStock: true,  isNew: false, isSale: false },
  { id: 7, title: '개발자 무선 키보드',    author: '브랜드A',       price: 89000, category: 'DEVICE',   inStock: true,  isNew: true,  isSale: false },
  { id: 8, title: 'USB-C 허브 7포트',     author: '브랜드B',       price: 45000, category: 'DEVICE',   inStock: false, isNew: false, isSale: true  },
  { id: 9, title: '코딩 스티커 팩',        author: '브랜드C',       price: 5000,  category: 'SUPPLIES', inStock: true,  isNew: false, isSale: false },
  { id: 10,title: '개발자 머그컵',         author: '브랜드D',       price: 12000, category: 'SUPPLIES', inStock: true,  isNew: true,  isSale: false },
]

const CATEGORIES = ['ALL', 'BOOK', 'DEVICE', 'SUPPLIES']

function Home({ onCartChange }) {

  // ── state 선언 ───────────────────────────────────────────────

  // ✏️ 장바구니 state: { id, title, price, qty } 배열
  const [cart, setCart] = useState([])

  // ✏️ 검색·필터·정렬 state — 3개를 조합해서 파생 데이터를 계산
  const [search,   setSearch]   = useState('')
  const [category, setCategory] = useState('ALL')
  const [sortBy,   setSortBy]   = useState('default')

  // ── 파생 데이터 계산 ─────────────────────────────────────────
  //
  // ✏️ 핵심: filter·sort 결과는 별도 state 로 만들지 않는다
  //    렌더링할 때마다 search, category, sortBy state 를 조합해서 직접 계산
  //    → "파생 데이터 (Derived State)" 패턴
  //
  const displayed = books
    // ① 카테고리 필터
    .filter(b => category === 'ALL' || b.category === category)
    // ② 검색어 필터 (제목 또는 저자)
    .filter(b => b.title.includes(search) || b.author.includes(search))
    // ③ 정렬
    .sort((a, b) => {
      if (sortBy === 'price-asc')  return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      return 0  // 기본: 원래 순서 유지
    })

  const cartIds = cart.map(item => item.id)

  // ── 이벤트 핸들러 ───────────────────────────────────────────

  // ✏️ 장바구니 담기: 불변성 — [...cart, newItem] 또는 map
  function handleAddToCart(bookId) {
    const book    = books.find(b => b.id === bookId)
    const exists  = cart.find(item => item.id === bookId)
    if (exists) {
      // ✏️ 배열 수정: map으로 새 배열 생성 (직접 수정 금지)
      setCart(cart.map(item =>
        item.id === bookId ? { ...item, qty: item.qty + 1 } : item
      ))
    } else {
      const newCart = [...cart, { id: book.id, title: book.title, price: book.price, qty: 1 }]
      setCart(newCart)
      onCartChange(newCart.length)
    }
  }

  function handleIncrease(itemId) {
    setCart(cart.map(item =>
      item.id === itemId ? { ...item, qty: item.qty + 1 } : item
    ))
  }

  function handleDecrease(itemId) {
    const item = cart.find(i => i.id === itemId)
    if (item.qty <= 1) {
      // ✏️ 배열 삭제: filter로 새 배열 생성 (직접 splice 금지)
      const newCart = cart.filter(i => i.id !== itemId)
      setCart(newCart)
      onCartChange(newCart.length)
    } else {
      setCart(cart.map(i =>
        i.id === itemId ? { ...i, qty: i.qty - 1 } : i
      ))
    }
  }

  function handleClearCart() {
    setCart([])
    onCartChange(0)
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  // ── 렌더링 ──────────────────────────────────────────────────
  return (
    <div>

      {/* ── 장바구니 패널 ────────────────────────────────────── */}
      <section className="cart-panel">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-gray-700">🛒 장바구니</h2>
          {cart.length > 0 && (
            <button className="btn-danger" onClick={handleClearCart}>비우기</button>
          )}
        </div>
        {cart.length > 0 ? (
          <>
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <div>
                  <p className="cart-item-title">{item.title}</p>
                  <p className="cart-item-price">{(item.price * item.qty).toLocaleString()}원</p>
                </div>
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => handleDecrease(item.id)}>−</button>
                  <span className="qty-num">{item.qty}</span>
                  <button className="qty-btn" onClick={() => handleIncrease(item.id)}>+</button>
                </div>
              </div>
            ))}
            <div className="cart-total">
              <span className="text-sm text-gray-500">
                총 {cart.reduce((s, i) => s + i.qty, 0)}권
              </span>
              <span className="text-lg font-bold text-blue-600">
                {totalPrice.toLocaleString()}원
              </span>
            </div>
          </>
        ) : (
          <div className="cart-empty">
            <p className="text-2xl mb-1">🛒</p>
            <p className="text-sm">장바구니가 비어 있습니다.</p>
          </div>
        )}
      </section>

      {/* ── 검색 · 필터 · 정렬 툴바 ──────────────────────────── */}
      <div className="toolbar">

        {/*
          ✏️ 제어 컴포넌트: value={search} + onChange
             input 의 값이 항상 search state 와 동기화된다
             Thymeleaf: th:value="${search}" → React: value={search}
        */}
        <input
          className="search-input"
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="도서명 또는 저자 검색..."
        />

        {/* ✏️ 카테고리 필터 버튼: 클릭 시 category state 변경 */}
        <div className="filter-group">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              // ✏️ 조건부 className: 선택된 카테고리에만 active 스타일
              className={category === cat ? 'btn-filter-active' : 'btn-filter'}
            >
              {cat}
            </button>
          ))}
        </div>

        {/*
          ✏️ select — onChange 로 sortBy state 변경
             Thymeleaf: th:value="${sortBy}" → React: value={sortBy}
        */}
        <select
          className="sort-select"
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
        >
          <option value="default">기본 순서</option>
          <option value="price-asc">가격 낮은 순</option>
          <option value="price-desc">가격 높은 순</option>
        </select>
      </div>

      {/* ── 결과 요약 ────────────────────────────────────────── */}
      <p className="result-summary">
        {/* ✏️ 파생 데이터: displayed 배열의 길이 — 별도 state 없이 계산 */}
        {search || category !== 'ALL'
          ? `검색 결과: ${displayed.length}권 (전체 ${books.length}권)`
          : `전체 ${books.length}권`
        }
      </p>

      {/* ── 도서 목록 ─────────────────────────────────────────── */}
      <div className="book-grid">
        {displayed.length > 0 ? (
          displayed.map(book => (
            <BookCard
              key={book.id}
              {...book}
              isInCart={cartIds.includes(book.id)}
              onAddToCart={handleAddToCart}
            />
          ))
        ) : (
          // ✏️ 빈 결과 처리
          <div className="empty-result">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-semibold text-gray-500">검색 결과가 없습니다.</p>
            <p className="text-sm mt-1">다른 검색어나 필터를 사용해보세요.</p>
          </div>
        )}
      </div>

    </div>
  )
}

export default Home
