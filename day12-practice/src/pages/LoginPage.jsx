// src/pages/LoginPage.jsx
// ✏️ Thymeleaf: @GetMapping("/login") + security/login.html

import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login, isLoggedIn } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // ✏️ 이미 로그인된 상태면 홈으로 리다이렉트
  // Spring Security: 인증된 사용자가 /login 접근 시 defaultSuccessUrl로 이동
  if (isLoggedIn) return <Navigate to="/" replace />

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('이메일과 비밀번호를 모두 입력하세요.')
      return
    }

    setLoading(true)
    try {
      // ✏️ AuthContext의 login() 호출
      //    → loginApi() 실행 → user state + localStorage 저장
      await login(form.email, form.password)
      navigate('/')  // 로그인 성공 → 홈으로
    } catch (err) {
      const msg = err?.response?.data?.message || '이메일 또는 비밀번호가 올바르지 않습니다.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        {/* 로고 */}
        <div className="login-logo">📚</div>
        <h1 className="login-title">BookStore 관리자</h1>
        <p className="login-subtitle">로그인하여 도서를 관리하세요</p>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {/* 이메일 */}
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@bookstore.com"
              autoComplete="email"
            />
          </div>

          {/* 비밀번호 */}
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="login-error">{error}</div>
          )}

          <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        {/* 테스트 계정 힌트 */}
        <div className="login-hint">
          <p className="text-xs text-gray-400 mb-1">테스트 계정</p>
          <p className="text-xs text-gray-500">관리자: admin@bookstore.com / admin123</p>
          <p className="text-xs text-gray-500">일반: user@bookstore.com / user123</p>
        </div>
      </div>
    </div>
  )
}
