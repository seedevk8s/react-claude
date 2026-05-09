// [실행 흐름 Step 3] App.jsx — 루트 컴포넌트
//
// [매핑] Thymeleaf: templates/index.html (첫 화면 템플릿)
//        React    : App.jsx (루트 컴포넌트)
//
// 컴포넌트 규칙:
//   1. 함수 이름은 반드시 대문자로 시작 (PascalCase)
//   2. 반드시 JSX(화면)를 return 해야 한다

// ─────────────────────────────────────────────
// 실습 데이터 (나중에 API 응답으로 대체될 값)
// ─────────────────────────────────────────────

// [매핑] Thymeleaf: model.addAttribute("studentName", "김철수")
//        React    : const studentName = "김철수"
const studentName = "김철수"
const courseName  = "Spring Boot → React 전환 과정"
const day         = 1

// [매핑] Thymeleaf: model.addAttribute("jsxRules", list)
//        React    : const jsxRules = [...]
const jsxRules = [
  { id: 1, title: "class → className",         code: '<div className="box">'                },
  { id: 2, title: "태그는 반드시 닫기",          code: '<input type="text" />  /  <br />'     },
  { id: 3, title: "최상위 태그는 하나 (Fragment)", code: '<>...</>'                             },
  { id: 4, title: "JS 표현식은 { } 안에",        code: '<p>{studentName}</p>'                 },
  { id: 5, title: "인라인 스타일은 객체로",       code: "style={{ color: 'red' }}"             },
  { id: 6, title: "주석은 {/* */} 형식",         code: '{/* JSX 주석 */}'                     },
]

const ssrVsCsr = [
  { 구분: "HTML 생성 위치",    thymeleaf: "서버",               react: "브라우저"           },
  { 구분: "페이지 이동",       thymeleaf: "전체 HTML 재전송",    react: "JS가 화면 교체"     },
  { 구분: "서버 응답 형식",    thymeleaf: "HTML",               react: "JSON"               },
  { 구분: "백엔드 어노테이션", thymeleaf: "@Controller",        react: "@RestController"    },
  { 구분: "템플릿 파일",       thymeleaf: ".html (Thymeleaf)",  react: ".jsx (React)"       },
  { 구분: "화면 깜빡임",       thymeleaf: "있음",               react: "없음"               },
]

// ─────────────────────────────────────────────
// App 컴포넌트
// ─────────────────────────────────────────────
function App() {

  // [JSX 규칙 ③] return 안에는 반드시 하나의 최상위 태그
  // → <div> 하나로 감싸거나 <> (Fragment) 사용
  return (
    <div className="page">

      {/* ── 헤더 ──────────────────────────────────────────────── */}
      <header className="header">
        {/*
          [JSX 규칙 ④] JS 변수는 { } 안에 넣어야 화면에 표시된다
          Thymeleaf: th:text="${courseName}"
          React    : {courseName}
        */}
        <h1>{courseName}</h1>
        <p>Day {day} &nbsp;|&nbsp; 수강생: {studentName}</p>
      </header>

      <main className="main">

        {/* ── 섹션 1: SSR vs CSR 비교표 ─────────────────────── */}
        <section className="card">
          <h2>1. SSR vs CSR 비교</h2>
          <p className="desc">
            Thymeleaf는 서버에서 HTML을 완성해서 보내고,<br />
            React는 JSON만 받아 브라우저가 직접 화면을 그린다.
          </p>

          <table className="table">
            <thead>
              <tr>
                <th>구분</th>
                <th>Thymeleaf (SSR)</th>
                <th>React (CSR)</th>
              </tr>
            </thead>
            <tbody>
              {/*
                [JSX 규칙 ④ + 리스트 렌더링]
                Thymeleaf: th:each="row : ${ssrVsCsr}"
                React    : ssrVsCsr.map(row => <tr key={...}>)

                key → React가 각 행을 구분하는 식별자 (DB의 PK 개념)
              */}
              {ssrVsCsr.map((row, index) => (
                <tr key={index}>
                  <td><strong>{row.구분}</strong></td>
                  <td>{row.thymeleaf}</td>
                  <td className="react-col">{row.react}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* ── 섹션 2: 실행 흐름 ────────────────────────────── */}
        <section className="card">
          <h2>2. 실행 흐름</h2>
          <p className="desc">브라우저가 React 앱을 실행하는 순서</p>

          <div className="flow">
            {[
              { file: "index.html", desc: "SPA 껍데기. <div id=\"root\"> 만 있음"  },
              { file: "main.jsx",   desc: "앱 시작점. root 안에 App 컴포넌트를 렌더링" },
              { file: "App.jsx",    desc: "루트 컴포넌트. 실제 화면을 구성"           },
            ].map((step, i) => (
              <div key={i} className="flow-step">
                {/* 화살표: 첫 번째 단계 앞에는 화살표 없음 */}
                {i > 0 && <span className="arrow">▶</span>}
                <div className="step-box">
                  <code>{step.file}</code>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 섹션 3: JSX 문법 규칙 ───────────────────────── */}
        <section className="card">
          <h2>3. JSX — HTML과 다른 점</h2>
          <p className="desc">아래 6가지 규칙을 반드시 지켜야 한다</p>

          <ul className="rule-list">
            {/*
              Thymeleaf: th:each="rule : ${jsxRules}"
              React    : jsxRules.map(rule => <li key={rule.id}>)
            */}
            {jsxRules.map(rule => (
              <li key={rule.id} className="rule-item">
                <span className="rule-num">{rule.id}</span>
                <div>
                  <strong>{rule.title}</strong>
                  {/*
                    [JSX 규칙 ⑤] 인라인 스타일은 객체로
                    Thymeleaf: style="font-family: monospace"
                    React    : style={{ fontFamily: 'monospace' }}
                              └ camelCase 주의: font-family → fontFamily
                  */}
                  <code style={{ display: 'block', marginTop: '4px', color: '#0ea5e9' }}>
                    {rule.code}
                  </code>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* ── 섹션 4: 오늘의 핵심 정리 ──────────────────────── */}
        <section className="card summary">
          <h2>✅ 오늘의 핵심 정리</h2>
          <ul>
            <li>Thymeleaf = SSR, React = CSR — <strong>HTML 생성 위치가 다르다</strong></li>
            <li>앞으로 백엔드는 <code>@RestController</code> + JSON 응답으로 바뀐다</li>
            <li>Vite 실행 순서: <code>index.html → main.jsx → App.jsx</code></li>
            <li>JSX ≠ HTML: <code>className</code>, 자동닫힘, <code>{'{}'}</code> 표현식, 최상위 태그 1개</li>
            <li><code>package.json</code> = pom.xml &nbsp;/&nbsp; <code>vite.config.js</code> = application.yml</li>
          </ul>
        </section>

      </main>

      <footer className="footer">
        <p>React 전환 교육 — Day {day} / 12</p>
      </footer>

    </div>
  )
}

export default App
