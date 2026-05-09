// [실행 흐름 Step 2] main.jsx — 앱 시작점
//
// [매핑] Spring Boot: public static void main(String[] args)
//        React      : createRoot().render()
//
// SpringApplication.run(App.class, args)
//   → createRoot(document.getElementById('root')).render(<App />)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// document.getElementById('root') → index.html 의 <div id="root"> 를 잡아온다
// .render(<App />) → 그 안에 App 컴포넌트를 그린다
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/*
      StrictMode: 개발 환경에서 잠재적 문제를 경고해주는 래퍼
      빌드(npm run build) 시에는 자동으로 제거됨
    */}
    <App />
  </StrictMode>,
)
