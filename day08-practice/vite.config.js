import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✏️ Day 8 변경: CORS 해결을 위한 프록시 설정 추가
//    /api/* 요청을 Spring Boot(8080)로 포워딩
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})
