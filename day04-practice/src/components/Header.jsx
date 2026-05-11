// [매핑] Thymeleaf: templates/fragments/header.html
//        React    : src/components/Header.jsx
//
// ✏️ Day 4 변경: cartCount prop 을 받아서 헤더에 장바구니 수량 표시
//    props 는 부모(App.jsx)가 내려주는 값 — 자식(Header)은 읽기만 가능

function Header({ cartCount }) {
  return (
    <header className="header">
      <div className="header-logo">📚 BookStore</div>
      <nav className="header-nav">
        <a href="/">홈</a>
        <a href="/books">도서 목록</a>

        {/* ✏️ 장바구니 버튼: cartCount prop 으로 수량 표시 */}
        <button className="cart-btn">
          🛒 장바구니
          {/*
            ✏️ && 조건부 렌더링: 수량이 0 이면 뱃지를 숨긴다
               cartCount 가 0 이면 falsy → 렌더링 안 됨
          */}
          {cartCount > 0 && (
            <span className="cart-badge">{cartCount}</span>
          )}
        </button>
      </nav>
    </header>
  )
}

export default Header
