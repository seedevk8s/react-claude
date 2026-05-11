// src/api/api.js — axios 공통 인스턴스
//
// ✏️ Day 8 핵심: axios.create()로 공통 설정을 한 곳에서 관리
//
// [매핑] Spring Boot: application.yml
//   server.port=8080
//   spring.mvc.view.prefix=/api
//
// Vite 프록시 설정 덕분에 baseURL을 '/api'로만 작성해도 됨
//   → 브라우저: /api/books → Vite 프록시 → localhost:8080/api/books

import axios from 'axios'

const api = axios.create({
  // ✏️ Vite 프록시 사용 시: '/api' 만으로도 충분
  //    Spring Boot 직접 연결 시: 'http://localhost:8080/api'
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// ────────────────────────────────────────────────────────────
// 요청 인터셉터: 모든 요청 전에 실행
// ✏️ JWT 토큰 자동 첨부 (Day 10 로그인 구현 후 활성화)
// ────────────────────────────────────────────────────────────
api.interceptors.request.use(
  config => {
    // const token = localStorage.getItem('token')
    // if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  error => Promise.reject(error)
)

// ────────────────────────────────────────────────────────────
// 응답 인터셉터: 모든 응답 후에 실행
// ✏️ 401 Unauthorized → 로그인 페이지 이동 (Day 10 활성화)
// ────────────────────────────────────────────────────────────
api.interceptors.response.use(
  response => response,
  error => {
    // if (error.response?.status === 401) {
    //   window.location.href = '/login'
    // }
    return Promise.reject(error)
  }
)

export default api
