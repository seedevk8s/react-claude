// App.jsx — 루트 컴포넌트
//
// ✏️ Day 4 변경: cartCount state 추가
//    헤더의 장바구니 뱃지 숫자를 관리한다
//
// ✏️ 왜 App 에서 cartCount 를 관리하는가?
//    Header(헤더 뱃지)와 Home(장바구니 담기) 두 컴포넌트가
//    같은 데이터를 공유해야 하므로, 공통 부모인 App 이 state 를 가진다
//    → 이것이 "상태 끌어올리기(Lifting State Up)" 패턴 (Day 5에서 심화)

import { useState } from 'react'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'

function App() {

  // ✏️ 장바구니 종류 수 — Header 뱃지에 표시
  const [cartCount, setCartCount] = useState(0)

  return (
    // ✏️ cartCount 를 Layout → Header 로 전달
    // ✏️ setCartCount 를 Home 에 전달 → 담기 버튼 클릭 시 호출
    <Layout cartCount={cartCount}>
      <Home onCartChange={setCartCount} />
    </Layout>
  )
}

export default App
