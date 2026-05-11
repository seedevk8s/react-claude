function Header({ cartCount }) {
  return (
    <header className="header">
      <div className="header-logo">📚 BookStore</div>
      <nav className="header-nav">
        <a href="/">홈</a>
        <a href="/books">도서 목록</a>
        <button className="cart-btn">
          🛒 장바구니
          {cartCount > 0 && (
            <span className="cart-badge">{cartCount}</span>
          )}
        </button>
      </nav>
    </header>
  )
}
export default Header
