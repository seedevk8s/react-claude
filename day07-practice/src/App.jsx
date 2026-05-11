// App.jsx — Day 7
//
// ✏️ 오늘의 핵심: BrowserRouter + Routes + Route 구성
//
// [매핑] Spring MVC → React Router
//   @GetMapping("/")          → <Route path="/"          element={<Home />} />
//   @GetMapping("/books/{id}") → <Route path="/books/:id" element={<BookDetail />} />
//   @GetMapping("/cart")       → <Route path="/cart"      element={<CartPage />} />

import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import BookDetail from './pages/BookDetail.jsx'
import CartPage from './pages/CartPage.jsx'
import NotFound from './pages/NotFound.jsx'

function App() {
  // ✏️ 장바구니 state: 여러 페이지(Home, CartPage)가 공유하므로 최상위 App이 보유
  //    Day 10에서 Context API로 교체 예정
  const [cart, setCart] = useState([])

  // 장바구니 추가/수정/삭제 핸들러 — pages에 props로 전달
  function handleAddToCart(book) {
    const exists = cart.find(i => i.id === book.id)
    if (exists) {
      setCart(cart.map(i => i.id === book.id ? {...i, qty: i.qty+1} : i))
    } else {
      setCart([...cart, {id:book.id, title:book.title, price:book.price, qty:1}])
    }
  }

  function handleIncrease(id) {
    setCart(cart.map(i => i.id===id ? {...i, qty:i.qty+1} : i))
  }

  function handleDecrease(id) {
    const item = cart.find(i => i.id===id)
    if (item.qty <= 1) {
      setCart(cart.filter(i => i.id!==id))
    } else {
      setCart(cart.map(i => i.id===id ? {...i, qty:i.qty-1} : i))
    }
  }

  function handleRemove(id)   { setCart(cart.filter(i => i.id!==id)) }
  function handleClearCart()  { setCart([]) }

  const cartCount = cart.length
  const cartIds   = cart.map(i => i.id)

  return (
    <BrowserRouter>
      <Routes>

        {/*
          ✏️ 레이아웃 라우트: Layout 을 공통 부모로 감싼다
             모든 자식 페이지에 Header + Footer 가 자동 적용
             Layout 내부의 <Outlet />에 자식 컴포넌트가 렌더링됨
        */}
        <Route element={<Layout cartCount={cartCount} />}>

          {/* ✏️ index Route: path="/" 와 동일 */}
          <Route path="/" element={
            <Home
              cart={cart}
              cartIds={cartIds}
              onAddToCart={handleAddToCart}
            />
          } />

          {/*
            ✏️ URL 파라미터: :id
               /books/1 → BookDetail 에서 useParams()로 "1" 읽음
               [매핑] @GetMapping("/books/{id}")
          */}
          <Route path="/books/:id" element={
            <BookDetail
              cartIds={cartIds}
              onAddToCart={handleAddToCart}
            />
          } />

          <Route path="/cart" element={
            <CartPage
              cart={cart}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              onRemove={handleRemove}
              onClear={handleClearCart}
            />
          } />

        </Route>

        {/* ✏️ 404 처리: path="*" — 위 Route 중 아무것도 매칭 안 될 때 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
