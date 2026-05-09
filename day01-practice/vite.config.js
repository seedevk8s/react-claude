import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// [매핑] Spring Boot: application.yml → Vite: vite.config.js
// server.port: 8080          → server: { port: 5173 }  (Vite 기본값)
// spring.application.name   → name 필드 (package.json)
export default defineConfig({
  plugins: [react()],
})
