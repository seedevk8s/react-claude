// src/App.jsx — Day 11: ErrorBoundary 추가
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider }  from './context/AuthContext'
import { CartProvider }  from './context/CartContext'
import ErrorBoundary     from './components/ErrorBoundary'
import PrivateRoute      from './components/PrivateRoute'
import Layout            from './components/Layout'
import LoginPage         from './pages/LoginPage'
import Home              from './pages/Home'
import BookDetail        from './pages/BookDetail'
import BookForm          from './pages/BookForm'
import CartPage          from './pages/CartPage'
import NotFound          from './pages/NotFound'

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
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
    </ErrorBoundary>
  )
}
