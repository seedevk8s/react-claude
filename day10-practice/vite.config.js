import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✏️ Thymeleaf에서 Spring Boot가 @RestController로 JSON 응답하는 것과 동일
// Vite에서 /api 요청을 Spring Boot 백엔드(8080)로 프록시
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})
