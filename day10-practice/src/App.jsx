// src/App.jsx — Day 10: Provider 중첩 + PrivateRoute 적용
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import PrivateRoute from './components/PrivateRoute'
import Layout       from './components/Layout'
import LoginPage    from './pages/LoginPage'
import Home         from './pages/Home'
import BookDetail   from './pages/BookDetail'
import BookForm     from './pages/BookForm'
import CartPage     from './pages/CartPage'
import NotFound     from './pages/NotFound'

export default function App() {
  return (
    // ✏️ AuthProvider(바깥) → CartProvider(안쪽) 순서 중요
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* 공개 라우트 */}
            <Route path="/login" element={<LoginPage />} />

            {/* 보호 라우트 — PrivateRoute: isLoggedIn 확인 */}
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Layout />}>
                <Route index               element={<Home />} />
                <Route path="books/:id"    element={<BookDetail />} />
                <Route path="books/new"    element={<BookForm />} />
                <Route path="books/:id/edit" element={<BookForm />} />
                <Route path="cart"         element={<CartPage />} />
                <Route path="*"            element={<NotFound />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}
