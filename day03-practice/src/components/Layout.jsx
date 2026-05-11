// [매핑] Thymeleaf: templates/layout/default.html (layout:fragment="content" 슬롯)
//        React    : src/components/Layout.jsx (children props 슬롯)
//
// Thymeleaf layout:
//   <html xmlns:th="..." th:replace="~{layout/default :: layout(~{::main})}">
//   <main>여기가 content 슬롯</main>
//
// React:
//   <Layout>여기가 children 슬롯</Layout>

import Header from './Header.jsx'
import Footer from './Footer.jsx'

// ✏️ children: <Layout> 태그 사이에 넣은 JSX가 자동으로 들어오는 특별한 prop
//    Thymeleaf의 layout:fragment="content" 와 동일한 개념
function Layout({ children }) {
  return (
    <div className="wrapper">

      {/*
        ✏️ 컴포넌트 사용법: <컴포넌트명 />
           Thymeleaf: th:replace="~{fragments/header :: header}"
           React    : <Header />
      */}
      <Header />

      <main className="container">
        {/* ✏️ {children}: 부모가 <Layout>...</Layout> 사이에 넣은 내용이 여기에 출력 */}
        {children}
      </main>

      <Footer />

    </div>
  )
}

export default Layout
