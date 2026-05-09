import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

/**
 * ✅ Thymeleaf 대응 개념
 * - Spring Boot main() → React main.jsx
 * - SpringApplication.run() → createRoot().render()
 * - 서버가 HTML 조립 → 브라우저가 JS로 DOM 조립
 *
 * StrictMode: 개발 중 잠재적 문제를 경고해주는 래퍼 (빌드 시 제거됨)
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
