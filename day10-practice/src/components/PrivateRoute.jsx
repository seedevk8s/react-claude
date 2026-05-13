// src/components/PrivateRoute.jsx
// ✏️ Spring Security: @PreAuthorize("isAuthenticated()") 와 동일 역할
//    미인증 사용자가 보호된 페이지에 접근하면 /login으로 리다이렉트

import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PrivateRoute() {
  const { isLoggedIn } = useAuth()

  if (isLoggedIn) {
    // ✅ 인증됨 → Outlet: 자식 라우트(Layout > Home 등) 렌더링
    return <Outlet />
  }

  // ❌ 미인증 → /login으로 리다이렉트
  // replace: 히스토리 스택에 /login이 남지 않도록 (뒤로가기 방지)
  // ✏️ Spring Security: HttpSecurity.formLogin().loginPage("/login") 대응
  return <Navigate to="/login" replace />
}
