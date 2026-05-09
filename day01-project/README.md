# Day 01 — React 시작하기

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:3000 접속

## 학습 포인트

| 개념 | Thymeleaf | React |
|------|-----------|-------|
| 진입점 | `main()` + `templates/` | `main.jsx` |
| 설정 파일 | `application.properties` | `vite.config.js` |
| 의존성 관리 | `pom.xml` | `package.json` |
| 화면 구성 | `.html` 파일 | `.jsx` 컴포넌트 |
| 데이터 삽입 | `th:text="${data}"` | `{data}` |
| 반복 렌더링 | `th:each` | `.map()` |

## 폴더 구조

```
day01-project/
├── index.html          ← SPA 진입점
├── package.json        ← 의존성 (pom.xml)
├── vite.config.js      ← 설정 (application.properties)
└── src/
    ├── main.jsx        ← 앱 시작점 (main 메서드)
    ├── App.jsx         ← 루트 컴포넌트
    ├── index.css       ← 전역 스타일
    └── assets/
```

## 핵심 문법 요약

```jsx
// 1. 컴포넌트 = HTML을 반환하는 함수
function MyComponent() {
  const name = "홍길동"
  return <h1>안녕, {name}!</h1>  // {} 안에 JS 표현식
}

// 2. 배열 렌더링
const items = ["사과", "바나나", "오렌지"]
return (
  <ul>
    {items.map((item, index) => (
      <li key={index}>{item}</li>   // key 필수!
    ))}
  </ul>
)

// 3. export → 다른 파일에서 import 가능
export default MyComponent
```
