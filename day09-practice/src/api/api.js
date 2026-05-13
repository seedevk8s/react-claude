import axios from 'axios'

// ✏️ Thymeleaf: Spring Boot 내부에서 직접 호출 (fetch 필요 없음)
// React: Axios로 Spring Boot REST API 호출
// vite.config.js의 proxy 설정으로 /api → http://localhost:8080/api

const api = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ✏️ 요청 인터셉터 — 모든 요청 전 실행 (로그, 토큰 추가 등)
api.interceptors.request.use(
  (config) => {
    console.log(`[API 요청] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`)
    return config
  },
  (error) => Promise.reject(error)
)

// ✏️ 응답 인터셉터 — 모든 응답 후 실행 (에러 공통 처리 등)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API 오류]', error.response?.status, error.message)
    return Promise.reject(error)
  }
)

export default api
