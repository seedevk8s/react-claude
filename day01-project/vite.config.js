import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ Thymeleaf의 application.properties → Vite는 vite.config.js로 설정
// ✅ server.port=8080 → server: { port: 3000 }
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true   // 브라우저 자동 실행 (Spring Boot DevTools 자동 새로고침과 유사)
  }
})
