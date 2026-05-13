import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

// ✏️ Thymeleaf: layout:decorate="~{layout/default}" 와 동일 역할
// Outlet: 자식 라우트의 컴포넌트가 렌더링되는 위치

export default function Layout({ cartCount }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header cartCount={cartCount} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
