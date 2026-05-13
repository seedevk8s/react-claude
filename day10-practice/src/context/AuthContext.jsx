// src/context/AuthContext.jsx
// ✏️ Thymeleaf: Spring Security HttpSession + SecurityContextHolder
// React: createContext로 로그인 상태를 전역으로 관리

import { createContext, useContext, useState } from 'react'
import { loginApi, logoutApi } from '../api/authApi'

// ── 1단계: Context 생성 ─────────────────────────────
// ✏️ Spring의 ApplicationContext(빈 컨테이너) 생성과 비유
const AuthContext = createContext(null)

// ── 2단계: Provider — 값을 하위 컴포넌트에 제공 ─────
// ✏️ Spring의 @Configuration + @Bean 등록과 비유
export function AuthProvider({ children }) {
  // ✏️ Thymeleaf: HttpSession에 저장된 로그인 사용자 → React state로 대체
  // useState 초기값을 함수로 전달하면 컴포넌트 마운트 시 1회만 실행 (지연 초기화)
  const [user, setUser] = useState(() => {
    // 새로고침 시 localStorage에서 복원
    // ✏️ Spring: 서버 세션이 유지되어 자동 복원
    //    React: 클라이언트에서 localStorage로 수동 복원
    try {
      const saved = localStorage.getItem('bookstore_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  // isLoggedIn: user가 null이 아니면 true
  // ✏️ Spring: SecurityContextHolder.getContext().getAuthentication().isAuthenticated()
  const isLoggedIn = Boolean(user)

  // ─── 로그인 ───────────────────────────────────────
  // ✏️ @PostMapping("/auth/login") + HttpSession.setAttribute("user", user) 대응
  const login = async (email, password) => {
    const res = await loginApi({ email, password }) // API 호출
    const userData = res.data                        // { id, name, email, role }
    setUser(userData)
    // localStorage에 저장 → 새로고침 후에도 유지
    localStorage.setItem('bookstore_user', JSON.stringify(userData))
    return userData
  }

  // ─── 로그아웃 ─────────────────────────────────────
  // ✏️ @PostMapping("/auth/logout") + HttpSession.invalidate() 대응
  const logout = async () => {
    try {
      await logoutApi()  // 백엔드에 로그아웃 요청
    } catch {
      // API 실패해도 클라이언트는 초기화
    }
    setUser(null)
    localStorage.removeItem('bookstore_user')
  }

  // Provider가 제공하는 값
  const value = {
    user,        // { id, name, email, role } | null
    isLoggedIn,  // boolean
    login,       // async (email, pw) => void
    logout,      // async () => void
  }

  return (
    // ✏️ children: Provider 안에 중첩된 모든 컴포넌트
    //    이들은 모두 useAuth()로 value에 접근 가능
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// ── 3단계: 커스텀 훅 — useContext 래핑 ──────────────
// ✏️ Spring의 @Autowired 의존성 주입과 비유
// useContext(AuthContext) 를 매번 쓰는 대신 useAuth() 로 간결하게
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth는 반드시 AuthProvider 안에서 사용해야 합니다')
  }
  return ctx
}
