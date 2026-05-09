# Day 1 — React는 왜 등장했는가? + 환경 설정

## 학습 목표
- SSR(Thymeleaf)과 CSR(React)의 차이를 설명할 수 있다
- Vite + React 프로젝트를 생성하고 폴더 구조를 이해한다
- `index.html` → `main.jsx` → `App.jsx` 실행 흐름을 추적할 수 있다
- JSX가 HTML과 다른 점을 5가지 이상 말할 수 있다

---

## 1. SSR vs CSR — Thymeleaf와 React의 근본적 차이

### 1-1. Thymeleaf 방식 (SSR)
브라우저가 요청하면 서버(Spring Boot)가 DB를 조회하고,
Thymeleaf 엔진이 HTML을 완성해서 브라우저에 전달한다.

- 페이지 이동마다 전체 HTML 재전송 → 화면 깜빡임 발생
- 서버에 부하 집중

### 1-2. React 방식 (CSR)
브라우저가 최초 1회 JS 번들을 받아온 후,
이후 데이터가 필요할 때는 REST API로 JSON만 요청한다.
React가 받은 JSON으로 브라우저에서 직접 HTML을 그린다.

- 이후 화면 전환은 JS가 처리 → 깜빡임 없음 (SPA)
- 서버는 JSON만 응답하면 됨

### 1-3. 비교 정리표

| 구분 | Thymeleaf (SSR) | React (CSR) |
|------|----------------|-------------|
| HTML 생성 위치 | 서버 | 브라우저 |
| 페이지 이동 | 전체 HTML 재전송 | JS가 화면 교체 |
| 서버 응답 형식 | HTML | JSON |
| 백엔드 어노테이션 | `@Controller` | `@RestController` |
| 템플릿 파일 | `.html` (Thymeleaf) | `.jsx` (React) |
| 화면 깜빡임 | 있음 | 없음 |

> 💡 **한 줄 비유**
> - Thymeleaf: 주방(서버)에서 요리를 완성해서 서빙
> - React: 재료(JSON)만 받아서 손님(브라우저)이 직접 조리

---

## 2. Vite + React 프로젝트 생성

### 2-1. 생성 명령어

```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
```

| 명령어 | 설명 |
|--------|------|
| `npm create vite@latest` | Vite 프로젝트 생성기 실행 |
| `-- --template react` | React 템플릿 선택 |
| `npm install` | 의존성 설치 (mvn install과 동일) |
| `npm run dev` | 개발 서버 시작 (기본 포트: 5173) |

### 2-2. 폴더 구조 해부

```
my-app/
├── public/             ← 정적 파일 (이미지, favicon)
├── src/                ← 실제 개발 영역
│   ├── assets/         ← import용 이미지/아이콘
│   ├── App.jsx         ← 루트 컴포넌트
│   ├── App.css         ← App 전용 스타일
│   ├── main.jsx        ← 진입점 (React 앱 시작)
│   └── index.css       ← 전역 스타일
├── index.html          ← 유일한 HTML (SPA 껍데기)
├── package.json        ← 의존성 관리
└── vite.config.js      ← Vite 설정
```

### 2-3. Spring Boot ↔ Vite 구조 매핑

| Vite + React | Spring Boot | 역할 |
|---|---|---|
| `package.json` | `pom.xml` | 의존성 관리 |
| `vite.config.js` | `application.yml` | 프로젝트 설정 |
| `src/main.jsx` | `main()` 메서드 | 앱 시작점 |
| `src/App.jsx` | 루트 Controller | 최상위 진입 |
| `src/components/` | service / component | 기능 단위 모듈 |
| `public/` | `resources/static/` | 정적 파일 |

---

## 3. 실행 흐름 — index.html → main.jsx → App.jsx

### Step 1. `index.html` — SPA의 껍데기

```html
<!doctype html>
<html lang="ko">
  <head><meta charset="UTF-8" /><title>My App</title></head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- `<div id="root">` : 비어있는 그릇 — React가 여기에 HTML을 채운다
- `<script>` : main.jsx를 불러와 React 앱 실행

### Step 2. `main.jsx` — 앱 시작점

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

### Step 3. `App.jsx` — 루트 컴포넌트

```jsx
function App() {
  return (
    <div>
      <h1>Hello React!</h1>
    </div>
  )
}
export default App
```

---

## 4. JSX — HTML과 다른 점 완전 정리

### ① class → className
```jsx
<div className="container">   {/* ✅ */}
<div class="container">       {/* ❌ */}
```

### ② 태그는 반드시 닫아야 한다
```jsx
<input type="text" />   {/* ✅ */}
<br />                  {/* ✅ */}
```

### ③ 최상위 태그는 하나만 (Fragment 사용)
```jsx
return (
  <>
    <h1>제목</h1>
    <p>내용</p>
  </>
)
```

### ④ JavaScript 표현식은 { } 안에
```jsx
const name = "수강생"
return <p>이름: {name}</p>
// Thymeleaf: th:text="${name}" → React: {name}
```

### ⑤ 인라인 스타일은 객체로
```jsx
<p style={{ color: 'red', fontSize: '16px' }}>  {/* ✅ */}
<p style="color:red">                            {/* ❌ */}
```

### ⑥ 주석 방식
```jsx
{/* 이것이 JSX 주석입니다 */}
```

### Thymeleaf → JSX 핵심 매핑표

| Thymeleaf | JSX |
|-----------|-----|
| `th:text="${data}"` | `{data}` |
| `th:if="${show}"` | `{show && <div>...</div>}` |
| `th:if / th:unless` | `{cond ? <A /> : <B />}` |
| `th:each="item : ${list}"` | `{list.map(item => <div key={item.id}>)}` |
| `class="..."` | `className="..."` |
| `style="color:red"` | `style={{ color: 'red' }}` |

---

## 5. 오후 프로젝트 실습 가이드

### Step 1. 팀프로젝트 분석 (30분)
- `src/main/resources/templates/` 폴더 열기
- 페이지 목록 작성 (목록, 상세, 등록, 수정, 로그인 등)

### Step 2. React 프로젝트 생성 (30분)
```bash
npm create vite@latest {팀프로젝트명}-react -- --template react
cd {팀프로젝트명}-react
npm install
npm run dev
```

### Step 3. 초기 파일 정리 (30분)
```jsx
// src/App.jsx 교체
function App() {
  return <h1>팀프로젝트 React 전환 시작!</h1>
}
export default App
```

### Step 4. GitHub 연동 (30분)
```bash
git init
git add .
git commit -m "init: Vite React 프로젝트 초기 설정"
git remote add origin {GitHub 저장소 URL}
git push -u origin main
```

---

## 오늘의 핵심 정리

| # | 핵심 내용 |
|---|-----------|
| ✅ 1 | Thymeleaf = SSR, React = CSR — HTML 생성 위치가 다르다 |
| ✅ 2 | 앞으로 백엔드는 `@RestController` + JSON 응답으로 바뀐다 |
| ✅ 3 | Vite 실행 순서: `index.html → main.jsx → App.jsx` |
| ✅ 4 | JSX ≠ HTML: `className`, 자동닫힘, `{ }` 표현식, 최상위 태그 1개 |
| ✅ 5 | `package.json` = `pom.xml`, `vite.config.js` = `application.yml` |

---

## 참고 자료
- [React 공식 문서](https://react.dev)
- [Vite 공식 문서](https://vitejs.dev)
- [JSX 심화](https://react.dev/learn/writing-markup-with-jsx)
