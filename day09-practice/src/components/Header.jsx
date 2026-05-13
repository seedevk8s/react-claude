import { Link } from 'react-router-dom'

// ✏️ Thymeleaf: th:fragment="header" → 모든 페이지 공통 헤더
// React: Layout.jsx에서 항상 렌더링되는 공통 Header 컴포넌트

export default function Header({ cartCount = 0 }) {
  return (
    <header className="header">
      <div className="header-inner">
        {/* ✏️ Thymeleaf: th:href="@{/}" */}
        <Link to="/" className="header-logo">
          📚 BookStore
        </Link>

        <nav className="header-nav">
          <Link to="/" className="header-link">홈</Link>
          <Link to="/books/new" className="header-link">
            + 도서 등록
          </Link>
          <Link to="/cart" className="header-link">
            🛒 장바구니
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  )
}
