// src/context/CartContext.jsx
// ✏️ Day 9: App.jsx에서 props로 cart 전달 → Day 10: Context로 전역 이동
// 이제 어느 컴포넌트에서든 useCart()로 장바구니 접근 가능

import { createContext, useContext, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  // ─── 장바구니 담기 ────────────────────────────────
  const addToCart = (book) => {
    setCart(prev => {
      // 중복 방지 (같은 책은 한 번만)
      if (prev.find(item => item.id === book.id)) return prev
      return [...prev, book]
    })
  }

  // ─── 장바구니 제거 ────────────────────────────────
  const removeFromCart = (bookId) => {
    setCart(prev => prev.filter(item => item.id !== bookId))
  }

  // ─── 장바구니 초기화 ──────────────────────────────
  const clearCart = () => setCart([])

  // 파생 값: 매번 계산
  const cartCount = cart.length
  const cartTotal = cart.reduce((sum, item) => sum + (item.price || 0), 0)

  const value = { cart, addToCart, removeFromCart, clearCart, cartCount, cartTotal }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart는 반드시 CartProvider 안에서 사용해야 합니다')
  }
  return ctx
}
