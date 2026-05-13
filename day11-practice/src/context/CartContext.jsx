// src/context/CartContext.jsx — Day 11 리팩토링: useCallback + useMemo 적용
import { createContext, useContext, useState, useCallback, useMemo } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  // ✅ useCallback: 참조 안정화 → React.memo BookCard 리렌더링 방지
  const addToCart = useCallback((book) => {
    setCart(prev => {
      if (prev.find(item => item.id === book.id)) return prev
      return [...prev, book]
    })
  }, [])

  const removeFromCart = useCallback((bookId) => {
    setCart(prev => prev.filter(item => item.id !== bookId))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  // ✅ useMemo: value 객체 매 렌더마다 재생성 방지 → Context 소비자 리렌더링 방지
  const value = useMemo(() => ({
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    cartCount: cart.length,
    cartTotal: cart.reduce((sum, item) => sum + (item.price || 0), 0),
  }), [cart, addToCart, removeFromCart, clearCart])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart는 CartProvider 안에서만 사용 가능합니다')
  return ctx
}
