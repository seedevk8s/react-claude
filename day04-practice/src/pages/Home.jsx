// Home.jsx — 홈 페이지
//
// ✏️ Day 4 핵심: useState + 이벤트 처리
//
// [매핑] Thymeleaf: 버튼 클릭 → 서버 요청 → 서버에서 상태 변경 → 새 HTML 전송
//        React    : 버튼 클릭 → useState 변경 → 화면 자동 리렌더링 (서버 요청 없음)

import { useState } from 'react'
import BookCard from '../components/BookCard.jsx'

// ✏️ 나중에 useEffect + Axios 로 GET /api/books 에서 받아올 데이터
const books = [
  { id: 1, title: '클린 코드',           author: '로버트 마틴',  price: 33000, inStock: true,  isNew: false, isSale: false },
  { id: 2, title: '리팩터링 2판',         author: '마틴 파울러',  price: 36000, inStock: true,  isNew: true,  isSale: false },
  { id: 3, title: '자바 ORM 표준 JPA',   author: '김영한',       price: 43000, inStock: false, isNew: false, isSale: false },
  { id: 4, title: '모던 자바스크립트',     author: '이웅모',       price: 32000, inStock: true,  isNew: true,  isSale: true  },
  { id: 5, title: '알고리즘 인터뷰',      author: '박종건',       price: 28000, inStock: false, isNew: false, isSale: true  },
  { id: 6, title: '도메인 주도 설계',     author: '에릭 에반스',  price: 39000, inStock: true,  isNew: false, isSale: false },
  { id: 7, title: 'HTTP 완벽 가이드',     author: '데이빗 고울리', price: 56000, inStock: true,  isNew: false, isSale: true  },
  { id: 8, title: '객체지향의 사실과 오해', author: '조영호',      price: 24000, inStock: true,  isNew: false, isSale: false },
]

function Home({ onCartChange }) {

  // ────────────────────────────────────────────────────────────────
  // ✏️ useState — React 의 상태 관리
  //
  // [매핑] Thymeleaf: 상태를 서버(세션/DB)에서 관리
  //        React    : 상태를 컴포넌트 안에서 직접 관리
  //
  // const [값, 값을바꾸는함수] = useState(초기값)
  //
  // ⚠️ 규칙: 값을 직접 수정하면 화면이 갱신되지 않는다
  //    ❌ cart.push(item)        → 화면 갱신 안 됨
  //    ✅ setCart([...cart, item]) → 화면 자동 갱신
  // ────────────────────────────────────────────────────────────────

  // 장바구니: { id, title, price, qty } 객체 배열
  const [cart, setCart] = useState([])

  // ── 이벤트 핸들러 ──────────────────────────────────────────────

  // ✏️ 장바구니 담기
  //    이미 담긴 책이면 수량 +1, 없으면 새로 추가
  function handleAddToCart(bookId) {
    const book = books.find(b => b.id === bookId)

    // 이미 장바구니에 있는지 확인
    const exists = cart.find(item => item.id === bookId)

    if (exists) {
      // ✏️ 기존 항목 수량 +1: map 으로 새 배열을 만들어서 교체 (불변성)
      setCart(cart.map(item =>
        item.id === bookId
          ? { ...item, qty: item.qty + 1 }  // 해당 항목만 qty 증가
          : item                             // 나머지는 그대로
      ))
    } else {
      // ✏️ 새 항목 추가: 스프레드로 기존 배열 복사 후 새 항목 추가
      const newCart = [...cart, { id: book.id, title: book.title, price: book.price, qty: 1 }]
      setCart(newCart)
      // 부모(App)에게 장바구니 총 종류 수 알림
      onCartChange(newCart.length)
    }
  }

  // ✏️ 수량 증가
  function handleIncrease(itemId) {
    setCart(cart.map(item =>
      item.id === itemId ? { ...item, qty: item.qty + 1 } : item
    ))
  }

  // ✏️ 수량 감소: 1 이하면 장바구니에서 제거
  function handleDecrease(itemId) {
    const item = cart.find(i => i.id === itemId)
    if (item.qty <= 1) {
      // 수량이 1이면 항목 제거
      const newCart = cart.filter(i => i.id !== itemId)
      setCart(newCart)
      onCartChange(newCart.length)
    } else {
      setCart(cart.map(i =>
        i.id === itemId ? { ...i, qty: i.qty - 1 } : i
      ))
    }
  }

  // ✏️ 장바구니 비우기
  function handleClearCart() {
    setCart([])
    onCartChange(0)
  }

  // 장바구니 총 금액 계산
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  // 장바구니에 담긴 도서 id 목록 (BookCard 에 isInCart prop 전달용)
  const cartIds = cart.map(item => item.id)

  // ── 렌더링 ────────────────────────────────────────────────────

  return (
    <div>

      {/* ── 장바구니 패널 ────────────────────────────────────── */}
      <section className="cart-panel">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title mb-0">🛒 장바구니</h2>
          {cart.length > 0 && (
            // ✏️ 이벤트 핸들러: onClick 에 함수 참조를 넘긴다
            <button className="btn-danger" onClick={handleClearCart}>
              비우기
            </button>
          )}
        </div>

        {/*
          ✏️ 빈 배열 처리: cart.length > 0 이면 목록, 아니면 안내문
        */}
        {cart.length > 0 ? (
          <>
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-info">
                  <p className="cart-item-title">{item.title}</p>
                  <p className="cart-item-price">
                    {(item.price * item.qty).toLocaleString()}원
                  </p>
                </div>

                {/* 수량 조절 버튼 */}
                <div className="qty-control">
                  {/*
                    ✏️ onClick={() => 함수(인자)} 패턴
                       인자를 넘겨야 할 때는 화살표 함수로 감싼다
                  */}
                  <button className="qty-btn" onClick={() => handleDecrease(item.id)}>−</button>
                  <span className="qty-num">{item.qty}</span>
                  <button className="qty-btn" onClick={() => handleIncrease(item.id)}>+</button>
                </div>
              </div>
            ))}

            {/* 총 금액 */}
            <div className="cart-total">
              <span className="text-gray-500 text-sm">
                총 {cart.reduce((sum, i) => sum + i.qty, 0)}권
              </span>
              <span className="text-xl font-bold text-blue-600">
                {totalPrice.toLocaleString()}원
              </span>
            </div>
          </>
        ) : (
          <div className="cart-empty">
            <p className="text-3xl mb-2">🛒</p>
            <p>장바구니가 비어 있습니다.</p>
          </div>
        )}
      </section>

      {/* ── 도서 목록 ─────────────────────────────────────────── */}
      <h2 className="section-title">📚 도서 목록</h2>
      <div className="book-grid">
        {books.map(book => (
          <BookCard
            key={book.id}
            id={book.id}
            title={book.title}
            author={book.author}
            price={book.price}
            inStock={book.inStock}
            isNew={book.isNew}
            isSale={book.isSale}
            // ✏️ 이미 장바구니에 담긴 책인지 알려주는 prop
            isInCart={cartIds.includes(book.id)}
            // ✏️ 이벤트 핸들러를 prop 으로 자식에게 내려준다
            //    자식(BookCard)은 버튼 클릭 시 이 함수를 호출
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>

    </div>
  )
}

export default Home
