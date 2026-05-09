# Day 01 실습 프로젝트 — React는 왜 등장했는가? + 환경 설정

## 실행 방법

```bash
npm install
npm run dev
```

→ 브라우저에서 http://localhost:5173 자동 접속

---

## 이 프로젝트에서 확인할 것

| # | 파일 | 확인 포인트 |
|---|------|------------|
| 1 | `index.html` | `<div id="root">` — 비어있는 그릇 |
| 2 | `src/main.jsx` | `createRoot().render()` — 앱 시작점 |
| 3 | `src/App.jsx` | 컴포넌트 함수, JSX 문법 6가지 규칙 |
| 4 | `src/index.css` | className 으로 연결되는 전역 스타일 |

---

## 실행 흐름

```
브라우저 요청
    ↓
index.html   → <div id="root"> (빈 그릇)
    ↓
main.jsx     → createRoot('#root').render(<App />)
    ↓
App.jsx      → 화면 구성 JSX 반환
    ↓
브라우저 화면 완성
```

---

## JSX 핵심 규칙 6가지 (App.jsx 주석 참고)

| 규칙 | 틀린 코드 | 올바른 코드 |
|------|-----------|-------------|
| CSS 클래스 | `class="box"` | `className="box"` |
| 빈 태그 닫기 | `<input>` | `<input />` |
| 최상위 태그 | 태그 2개 나란히 | `<>...</>` Fragment |
| JS 표현식 | 변수명 그대로 | `{변수명}` |
| 인라인 스타일 | `style="color:red"` | `style={{ color: 'red' }}` |
| 주석 | `<!-- -->` | `{/* */}` |

---

## Spring Boot ↔ Vite 매핑

| Vite + React | Spring Boot |
|---|---|
| `package.json` | `pom.xml` |
| `vite.config.js` | `application.yml` |
| `src/main.jsx` | `main()` 메서드 |
| `src/App.jsx` | 루트 Controller |
| `public/` | `resources/static/` |
