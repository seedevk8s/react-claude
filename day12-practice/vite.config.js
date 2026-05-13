import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// ✏️ Thymeleaf: application.properties 환경별 설정과 동일
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        // ✏️ 개발: Vite → Spring Boot 프록시 / 운영: Nginx가 담당
        '/api': {
          target: env.VITE_API_BASE_URL?.replace('/api','') || 'http://localhost:8080',
          changeOrigin: true,
        }
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: false,  // 운영 소스맵 비활성 (보안)
    },
  }
})
