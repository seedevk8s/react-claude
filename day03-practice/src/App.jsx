// App.jsx — 루트 컴포넌트
//
// Day 1~2: App.jsx 가 데이터, 화면, 스타일을 모두 담당했다
// Day 3   : 역할을 분리한다
//   - 화면 구조  → Layout.jsx
//   - 페이지 내용 → pages/Home.jsx
//   - 반복 UI   → components/BookCard.jsx
//
// App.jsx 는 이제 어떤 페이지를 보여줄지 결정하는 역할만 한다
// (Day 7 React Router 도입 시 이 부분이 라우팅으로 교체됨)

import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'

function App() {
  return (
    // ✏️ children props 활용
    //    <Layout> 태그 사이에 넣은 <Home /> 이
    //    Layout.jsx 의 {children} 자리에 출력된다
    //
    // [매핑] Thymeleaf layout:
    //   <html th:replace="~{layout/default :: layout(~{::main})}">
    //     <main><!-- 이 안이 content 슬롯 --></main>
    //   </html>
    <Layout>
      <Home />
    </Layout>
  )
}

export default App
