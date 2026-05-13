// src/api/api.js — Day 12: 환경변수 적용
// ✏️ Thymeleaf: application.properties의 server.port, datasource.url 와 동일
import axios from 'axios'

const api = axios.create({
  // ✏️ VITE_ 접두사 변수만 클라이언트 번들에 포함됨 (보안)
  // 개발: .env.development → http://localhost:8080/api
  // 운영: .env.production  → /api (Nginx가 :8080으로 프록시)
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API 오류]', error.response?.status, error.message)
    return Promise.reject(error)
  }
)

export default api
