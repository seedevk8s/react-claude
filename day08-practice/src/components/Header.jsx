// Header.jsx
//
// ✏️ Day 7 변경: <a href> → <Link to> 로 교체
//    Link: 서버 요청 없이 SPA 내부 이동
//    Thymeleaf: <a th:href="@{/}">홈</a>
//    React    : <Link to="/">홈</Link>

import { Link } from 'react-router-dom'

function Header({ cartCount = 0 }) {
  return (
    <header className="header">
      {/*
        ✏️ Link to="/" : 클릭해도 서버 요청 없음
           Thymeleaf: <a th:href="@{/}">📚 BookStore</a>
      */}
      <Link to="/" className="header-logo">📚 BookStore</Link>

      <nav className="header-nav">
        <Link to="/">홈</Link>

        {/* ✏️ /cart 페이지로 이동 */}
        <Link to="/cart" className="cart-btn">
          🛒 장바구니
          {cartCount > 0 && (
            <span className="cart-badge">{cartCount}</span>
          )}
        </Link>
      </nav>
    </header>
  )
}

export default Header
