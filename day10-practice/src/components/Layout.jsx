import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

// ✏️ Day 10: cartCount props 제거 — Header가 useCart()로 직접 접근
export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1"><Outlet /></main>
      <Footer />
    </div>
  )
}
