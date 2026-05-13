// src/components/Header.jsx
// ✏️ Day 9: props(cartCount) 수신 → Day 10: useAuth/useCart로 직접 접근
// ✏️ Thymeleaf: th:if="${#authorization.expression('isAuthenticated()')}" 대응

import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Header() {
  const { user, isLoggedIn, logout } = useAuth()  // ← props 없음!
  const { cartCount } = useCart()                  // ← props 없음!
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-logo">📚 BookStore</Link>

        <nav className="header-nav">
          {isLoggedIn ? (
            <>
              <span className="text-sm text-indigo-200 hidden sm:inline">
                👤 {user?.name}님
              </span>
              {user?.role === 'ADMIN' && (
                <Link to="/books/new" className="header-link">+ 도서 등록</Link>
              )}
              <Link to="/cart" className="header-link">
                🛒 장바구니
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
              <button onClick={handleLogout} className="header-link">로그아웃</button>
            </>
          ) : (
            <Link to="/login" className="header-link">로그인</Link>
          )}
        </nav>
      </div>
    </header>
  )
}
