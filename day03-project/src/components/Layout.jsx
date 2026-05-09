/**
 * Layout.jsx — 공통 레이아웃 컴포넌트
 *
 * ✅ Thymeleaf 대응:
 *   templates/layout/default.html
 *   <html xmlns:th="..." th:fragment="layout(content)">
 *     <body>
 *       <th:block th:replace="~{fragments/header}"/>
 *       <main>
 *         <th:block th:replace="${content}"/>   ← 여기가 children
 *       </main>
 *       <th:block th:replace="~{fragments/footer}"/>
 *     </body>
 *   </html>
 *
 * ✅ children props:
 *   Thymeleaf의 th:fragment 슬롯 = React의 children prop
 *   <Layout> 태그 사이의 JSX가 자동으로 children에 들어감
 */

import Header from './Header.jsx'
import Footer from './Footer.jsx'

function Layout({ children, cartCount = 3 }) {
  //           ↑ children: <Layout> 태그 사이의 모든 JSX를 자동으로 받음

  return (
    <div style={styles.wrapper}>
      {/* ✅ th:replace="~{fragments/header}" 대응 */}
      <Header siteName="React 쇼핑몰" cartCount={cartCount} />

      {/* ✅ ${content} 슬롯 대응 */}
      <main style={styles.main}>
        <div style={styles.inner}>
          {children}
        </div>
      </main>

      {/* ✅ th:replace="~{fragments/footer}" 대응 */}
      <Footer />
    </div>
  )
}

const styles = {
  wrapper: { minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f5f7fa' },
  main:    { flex: 1, padding: '32px 20px' },
  inner:   { maxWidth: '1100px', margin: '0 auto' },
}

export default Layout
