// Layout.jsx
//
// ✏️ Day 7 변경: {children} props → <Outlet /> 으로 교체
//
// [매핑]
//   Thymeleaf: layout:fragment="content" 슬롯
//   Day 3~6 : {children} props
//   Day 7~  : <Outlet />  ← React Router 방식
//
// Outlet: 부모 Route(<Route element={<Layout />}>)의
//         자식 Route 컴포넌트가 렌더링되는 위치

import { Outlet } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'

// ✏️ cartCount를 Context 없이 전달하는 방법이 없으므로
//    Day 10(Context API) 전까지는 App에서 직접 관리
function Layout({ cartCount }) {
  return (
    <div className="wrapper">
      <Header cartCount={cartCount} />

      <main className="container">
        {/*
          ✏️ <Outlet />: 자식 Route의 컴포넌트가 여기에 렌더링
             /         → <Home />
             /books/1  → <BookDetail />
             /cart     → <CartPage />
        */}
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default Layout
