// pages/CartPage.jsx — 장바구니 페이지
//
// ✏️ /cart URL로 접근하면 이 컴포넌트가 Outlet 위치에 렌더링
//    [매핑] @GetMapping("/cart") → templates/cart.html

import { Link, useNavigate } from 'react-router-dom'

function CartPage({ cart = [], onIncrease, onDecrease, onRemove, onClear }) {

  const navigate = useNavigate()
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const totalQty   = cart.reduce((s, i) => s + i.qty, 0)

  return (
    <div className="max-w-2xl mx-auto">

      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">🛒 장바구니</h1>
        <div className="flex gap-3">
          {/*
            ✏️ Link to="/": 쇼핑 계속하기
               [매핑] <a th:href="@{/}">계속 쇼핑</a>
          */}
          <Link to="/" className="btn-secondary">← 계속 쇼핑</Link>
          {cart.length > 0 && (
            <button className="btn-danger" onClick={onClear}>전체 비우기</button>
          )}
        </div>
      </div>

      {/* 장바구니 목록 */}
      {cart.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">

          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <div className="flex-1">
                {/*
                  ✏️ Link to={`/books/${item.id}`}: 상품 클릭 시 상세 이동
                */}
                <Link to={`/books/${item.id}`}
                  className="cart-item-title hover:text-rose-600 transition-colors">
                  {item.title}
                </Link>
                <p className="cart-item-price">
                  {(item.price * item.qty).toLocaleString()}원
                  <span className="text-gray-400 font-normal ml-1">
                    ({item.price.toLocaleString()}원 × {item.qty})
                  </span>
                </p>
              </div>

              {/* 수량 조절 */}
              <div className="qty-control mx-4">
                <button className="qty-btn" onClick={() => onDecrease(item.id)}>−</button>
                <span className="qty-num">{item.qty}</span>
                <button className="qty-btn" onClick={() => onIncrease(item.id)}>+</button>
              </div>

              {/* 삭제 */}
              <button className="text-gray-400 hover:text-red-500 transition-colors text-lg"
                onClick={() => onRemove(item.id)}>
                ✕
              </button>
            </div>
          ))}

          {/* 합계 */}
          <div className="cart-total">
            <span className="text-gray-600">총 {totalQty}권</span>
            <span className="text-2xl font-bold text-rose-600">
              {totalPrice.toLocaleString()}원
            </span>
          </div>

          {/* 주문 버튼 (Day 9에서 실제 구현) */}
          <button
            className="btn-primary w-full py-3 mt-4 text-base"
            onClick={() => alert('Day 9에서 주문 기능을 구현합니다!')}>
            주문하기
          </button>
        </div>

      ) : (
        // 빈 장바구니
        <div className="empty-wrap">
          <p className="text-6xl">🛒</p>
          <p className="font-semibold text-xl">장바구니가 비어 있습니다.</p>
          <p className="text-sm">마음에 드는 상품을 담아보세요!</p>
          {/*
            ✏️ Link: 도서 목록으로 이동
               [매핑] <a th:href="@{/}">쇼핑 계속하기</a>
          */}
          <Link to="/" className="btn-primary px-8 py-3 mt-2">
            도서 목록 보기
          </Link>
        </div>
      )}
    </div>
  )
}

export default CartPage
