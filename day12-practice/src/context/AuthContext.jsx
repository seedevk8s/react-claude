// src/context/AuthContext.jsx — Day 11 리팩토링: useMemo 적용
import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { loginApi, logoutApi } from '../api/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('bookstore_user')
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })

  const login = useCallback(async (email, password) => {
    const res = await loginApi({ email, password })
    setUser(res.data)
    localStorage.setItem('bookstore_user', JSON.stringify(res.data))
    return res.data
  }, [])

  const logout = useCallback(async () => {
    try { await logoutApi() } catch {}
    setUser(null)
    localStorage.removeItem('bookstore_user')
  }, [])

  // ✅ useMemo: value 객체 안정화 → 소비자 불필요한 리렌더링 방지
  const value = useMemo(() => ({
    user,
    isLoggedIn: Boolean(user),
    login,
    logout,
  }), [user, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth는 AuthProvider 안에서만 사용 가능합니다')
  return ctx
}
