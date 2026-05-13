import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'

import Layout     from './components/Layout'
import Home       from './pages/Home'
import BookDetail from './pages/BookDetail'
import BookForm   from './pages/BookForm'     // ✏️ Day 9 신규
import CartPage   from './pages/CartPage'
import NotFound   from './pages/NotFound'

// ✏️ Thymeleaf: DispatcherServlet이 URL에 맞는 컨트롤러 매핑
// React Router: 클라이언트 사이드에서 URL에 맞는 컴포넌트 렌더링

export default function App() {
  // ✏️ 장바구니 상태 — App 최상위에서 관리 (Day 10에서 Context로 이동 예정)
  const [cart, setCart] = useState([])

  const handleAddCart = (book) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === book.id)
      if (exists) return prev // 중복 방지
      return [...prev, book]
    })
  }

  const handleRemoveCart = (bookId) => {
    setCart(prev => prev.filter(item => item.id !== bookId))
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout cartCount={cart.length} />}>
          {/* 홈 (도서 목록) */}
          <Route index element={<Home onAddCart={handleAddCart} />} />

          {/* 도서 상세 */}
          <Route path="books/:id" element={<BookDetail onAddCart={handleAddCart} />} />

          {/* ✏️ Day 9 신규: 도서 등록 ───────────────────────
              ⚠️ 반드시 /books/:id/edit 보다 위에 위치해야 함!
              React Router는 위에서 아래로 순서대로 매칭 */}
          <Route path="books/new"      element={<BookForm />} />

          {/* ✏️ Day 9 신규: 도서 수정 */}
          <Route path="books/:id/edit" element={<BookForm />} />

          {/* 장바구니 */}
          <Route path="cart" element={
            <CartPage cart={cart} onRemove={handleRemoveCart} />
          } />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
