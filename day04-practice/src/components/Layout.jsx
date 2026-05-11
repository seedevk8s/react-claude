// [매핑] Thymeleaf: templates/layout/default.html
//        React    : src/components/Layout.jsx
//
// ✏️ Day 4 변경: cartCount prop 을 받아서 Header 로 전달
//    App → Layout → Header 순서로 props 가 흘러 내려간다 (단방향 데이터 흐름)

import Header from './Header.jsx'
import Footer from './Footer.jsx'

function Layout({ children, cartCount }) {
  return (
    <div className="wrapper">
      {/* ✏️ cartCount 를 Header 에 그대로 내려준다 (props 전달 체인) */}
      <Header cartCount={cartCount} />
      <main className="container">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout
