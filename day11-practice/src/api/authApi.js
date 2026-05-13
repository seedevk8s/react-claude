// src/api/authApi.js
// ✏️ Thymeleaf: Spring Security formLogin() + @PostMapping("/auth/login")
// React: Axios로 백엔드 REST API 호출

import api from './api'

// ────────────────────────────────────────────────────
// Mock 모드 (백엔드 없을 때 실습용)
// 실제 백엔드 연결 시 아래 주석 처리 후 실제 API 함수 사용
// ────────────────────────────────────────────────────
const USE_MOCK = true  // ← 백엔드 준비되면 false로 변경

// Mock 계정 (테스트용)
const MOCK_ACCOUNTS = [
  { email: 'admin@bookstore.com', password: 'admin123', user: { id: 1, name: '관리자', email: 'admin@bookstore.com', role: 'ADMIN' } },
  { email: 'user@bookstore.com',  password: 'user123',  user: { id: 2, name: '사용자', email: 'user@bookstore.com',  role: 'USER'  } },
]

// ✏️ @PostMapping("/api/auth/login") 대응
export const loginApi = async ({ email, password }) => {
  if (USE_MOCK) {
    // 네트워크 딜레이 시뮬레이션
    await new Promise(r => setTimeout(r, 700))
    const account = MOCK_ACCOUNTS.find(
      a => a.email === email && a.password === password
    )
    if (account) return { data: account.user }
    // 실패 시 Axios 에러 형식으로 throw
    const err = new Error('인증 실패')
    err.response = { status: 401, data: { message: '이메일 또는 비밀번호가 올바르지 않습니다.' } }
    throw err
  }
  // ← 실제 API
  return api.post('/auth/login', { email, password })
}

// ✏️ @PostMapping("/api/auth/logout") 대응
export const logoutApi = async () => {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 200))
    return { data: { message: 'ok' } }
  }
  return api.post('/auth/logout')
}

// ✏️ 새로고침 시 세션 유효성 확인
// @GetMapping("/api/auth/me") 대응
export const getMeApi = async () => {
  if (USE_MOCK) {
    const saved = localStorage.getItem('bookstore_user')
    if (saved) return { data: JSON.parse(saved) }
    throw new Error('Not authenticated')
  }
  return api.get('/auth/me')
}
