// Home.jsx — Day 6 핵심 실습
//
// 오늘 배우는 것:
//   1. useEffect 로 컴포넌트 마운트 시 데이터 로딩
//   2. loading / error / data — 3종 state 패턴
//   3. async/await 패턴 (내부 함수 정의 후 즉시 호출)
//   4. dependency array [category] — 값 변경 시 재로딩
//   5. 로딩 중 / 에러 / 빈 데이터 / 정상 — 4가지 UI 분기
//
// [매핑] Thymeleaf @GetMapping → React useEffect + fetch
//        model.addAttribute("books", list) → setBooks(data)

import { useState, useEffect } from 'react'
import BookCard from '../components/BookCard.jsx'

// ✏️ Day 8 에서 실제 Spring Boot API 로 교체될 Mock 데이터
//    useEffect 안에서 setTimeout 으로 API 호출을 시뮬레이션
const MOCK_BOOKS = [
  { id:1,  title:'클린 코드',           author:'로버트 마틴',   price:33000, category:'BOOK',     inStock:true,  isNew:false, isSale:false },
  { id:2,  title:'리팩터링 2판',         author:'마틴 파울러',   price:36000, category:'BOOK',     inStock:true,  isNew:true,  isSale:false },
  { id:3,  title:'자바 ORM 표준 JPA',   author:'김영한',        price:43000, category:'BOOK',     inStock:false, isNew:false, isSale:false },
  { id:4,  title:'모던 자바스크립트',     author:'이웅모',        price:32000, category:'BOOK',     inStock:true,  isNew:true,  isSale:true  },
  { id:5,  title:'알고리즘 인터뷰',      author:'박종건',        price:28000, category:'BOOK',     inStock:false, isNew:false, isSale:true  },
  { id:6,  title:'도메인 주도 설계',     author:'에릭 에반스',   price:39000, category:'BOOK',     inStock:true,  isNew:false, isSale:false },
  { id:7,  title:'개발자 무선 키보드',   author:'브랜드A',       price:89000, category:'DEVICE',   inStock:true,  isNew:true,  isSale:false },
  { id:8,  title:'USB-C 허브 7포트',    author:'브랜드B',       price:45000, category:'DEVICE',   inStock:false, isNew:false, isSale:true  },
  { id:9,  title:'코딩 스티커 팩',       author:'브랜드C',       price:5000,  category:'SUPPLIES', inStock:true,  isNew:false, isSale:false },
  { id:10, title:'개발자 머그컵',        author:'브랜드D',       price:12000, category:'SUPPLIES', inStock:true,  isNew:true,  isSale:false },
]

// ✏️ 실제 API 시뮬레이션 함수
//    Day 8 에서 아래 내용을 axios.get('/api/books?category='+category) 로 교체
async function fetchBooks(category) {
  // 네트워크 지연 시뮬레이션 (800ms)
  await new Promise(r => setTimeout(r, 800))

  // ✏️ 실습: 에러 시뮬레이션 — 아래 주석 해제하면 에러 UI 확인 가능
  // throw new Error('서버에 연결할 수 없습니다.')

  const result = category === 'ALL'
    ? MOCK_BOOKS
    : MOCK_BOOKS.filter(b => b.category === category)
  return result
}

const CATEGORIES = ['ALL', 'BOOK', 'DEVICE', 'SUPPLIES']

function Home({ onCartChange }) {

  // ── state 선언 ───────────────────────────────────────────────

  // ✏️ 데이터 로딩 3종 state — 항상 세트로 관리
  const [books,   setBooks]   = useState([])    // 서버에서 받은 데이터
  const [loading, setLoading] = useState(true)  // 로딩 중 여부
  const [error,   setError]   = useState(null)  // 에러 메시지

  // Day 5 에서 이어받은 state
  const [cart,     setCart]     = useState([])
  const [search,   setSearch]   = useState('')
  const [category, setCategory] = useState('ALL')
  const [sortBy,   setSortBy]   = useState('default')

  // ── useEffect: 카테고리 변경 시 데이터 재로딩 ────────────────
  //
  // ✏️ [category]: category state 가 바뀔 때마다 실행
  //    처음 마운트 시에도 실행 (초기 데이터 로딩)
  //
  // [매핑] Thymeleaf: @GetMapping("/books?category=ALL") 로 요청
  //        React    : useEffect → fetchBooks(category) 호출
  //
  useEffect(() => {

    // ✏️ async/await 패턴:
    //    useEffect 콜백 자체를 async 로 만들 수 없으므로
    //    내부 async 함수를 정의하고 즉시 호출한다
    async function load() {
      try {
        setLoading(true)  // ① 로딩 시작
        setError(null)    // 이전 에러 초기화

        const data = await fetchBooks(category) // ② API 호출

        setBooks(data)    // ③ 데이터 저장
        // [매핑] model.addAttribute("books", data) 와 동일한 효과

      } catch (err) {
        setError(err.message) // ④ 에러 저장

      } finally {
        // ✏️ finally: 성공이든 실패든 항상 로딩 종료
        setLoading(false)
      }
    }

    load() // 즉시 호출

    // ✏️ cleanup (선택): 컴포넌트 언마운트 시 진행 중 요청 취소
    // Day 8 Axios 연동 시 AbortController 추가 예정

  }, [category]) // category 가 바뀔 때마다 재실행

  // ── 파생 데이터 ──────────────────────────────────────────────
  const displayed = books
    .filter(b => b.title.includes(search) || b.author.includes(search))
    .sort((a, b) => {
      if (sortBy === 'price-asc')  return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      return 0
    })

  const cartIds = cart.map(i => i.id)

  // ── 이벤트 핸들러 ────────────────────────────────────────────
  function handleAddToCart(bookId) {
    const book   = books.find(b => b.id === bookId)
    const exists = cart.find(i => i.id === bookId)
    if (exists) {
      setCart(cart.map(i => i.id === bookId ? {...i, qty: i.qty+1} : i))
    } else {
      const newCart = [...cart, {id:book.id, title:book.title, price:book.price, qty:1}]
      setCart(newCart)
      onCartChange(newCart.length)
    }
  }

  function handleIncrease(id) {
    setCart(cart.map(i => i.id===id ? {...i, qty:i.qty+1} : i))
  }

  function handleDecrease(id) {
    const item = cart.find(i => i.id===id)
    if (item.qty <= 1) {
      const nc = cart.filter(i => i.id!==id)
      setCart(nc); onCartChange(nc.length)
    } else {
      setCart(cart.map(i => i.id===id ? {...i, qty:i.qty-1} : i))
    }
  }

  function handleClearCart() { setCart([]); onCartChange(0) }

  // ✏️ 재시도 핸들러: 에러 발생 시 category 를 그대로 유지하며 다시 로딩
  function handleRetry() {
    // category state 를 변경하지 않고 강제로 같은 category 로 재요청하려면
    // category 를 임시로 바꿨다 되돌리거나, 별도 trigger state 를 사용
    setError(null)
    setLoading(true)
    fetchBooks(category)
      .then(data => setBooks(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }

  const totalPrice = cart.reduce((s,i) => s+i.price*i.qty, 0)

  // ── 렌더링 ──────────────────────────────────────────────────

  return (
    <div>

      {/* ── 장바구니 패널 ──────────────────────────────────── */}
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
                  <p className="cart-item-price">{(item.price*item.qty).toLocaleString()}원</p>
                </div>
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => handleDecrease(item.id)}>−</button>
                  <span className="qty-num">{item.qty}</span>
                  <button className="qty-btn" onClick={() => handleIncrease(item.id)}>+</button>
                </div>
              </div>
            ))}
            <div className="cart-total">
              <span className="text-sm text-gray-500">총 {cart.reduce((s,i)=>s+i.qty,0)}권</span>
              <span className="text-lg font-bold text-teal-600">{totalPrice.toLocaleString()}원</span>
            </div>
          </>
        ) : (
          <div className="cart-empty">
            <p className="text-2xl mb-1">🛒</p>
            <p className="text-sm">장바구니가 비어 있습니다.</p>
          </div>
        )}
      </section>

      {/* ── 툴바 ──────────────────────────────────────────── */}
      <div className="toolbar">
        <input className="search-input" type="text" value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="도서명 또는 저자 검색..." />
        <div className="filter-group">
          {/*
            ✏️ 카테고리 버튼 클릭 → setCategory → useEffect 재실행 → API 재요청
               Thymeleaf: <a th:href="@{/books(category=${cat})}"> 링크 클릭과 동일한 효과
          */}
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

      {/* ── 4가지 UI 분기 ─────────────────────────────────── */}

      {/*
        ✏️ 분기 순서:
           1. loading → 스피너
           2. error   → 에러 메시지 + 재시도
           3. 빈 데이터 → 안내
           4. 정상    → BookCard 목록
      */}

      {loading ? (
        // ① 로딩 중
        <div className="loading-wrap">
          <div className="loading-spin" />
          <p className="loading-text">도서 목록을 불러오는 중...</p>
        </div>

      ) : error ? (
        // ② 에러 발생
        <div className="error-wrap">
          <p className="error-icon">❌</p>
          <p className="error-msg">{error}</p>
          <button className="btn-retry" onClick={handleRetry}>다시 시도</button>
        </div>

      ) : (
        // ③ 데이터 정상 로딩됨
        <>
          <p className="result-summary">
            {search
              ? `검색 결과: ${displayed.length}권 (전체 ${books.length}권)`
              : `${category} — 총 ${books.length}권`}
          </p>

          <div className="book-grid">
            {displayed.length > 0 ? (
              displayed.map(book => (
                <BookCard key={book.id} {...book}
                  isInCart={cartIds.includes(book.id)}
                  onAddToCart={handleAddToCart} />
              ))
            ) : (
              // ④ 검색 결과 없음
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
