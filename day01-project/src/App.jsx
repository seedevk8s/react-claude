/**
 * Day 01 - App.jsx
 * 주제: React 첫 번째 컴포넌트 이해하기
 *
 * ✅ Thymeleaf 대응 개념
 * ┌─────────────────────────────────────────────────────────┐
 * │  Thymeleaf                   React                      │
 * │  @Controller 메서드          함수형 컴포넌트              │
 * │  return "home"               return <JSX>               │
 * │  model.addAttribute(...)     props / state              │
 * │  templates/home.html         App.jsx                    │
 * └─────────────────────────────────────────────────────────┘
 */

// ✅ 컴포넌트: HTML을 반환하는 JavaScript 함수
// ✅ 규칙: 함수명은 반드시 대문자로 시작 (PascalCase)
function App() {

  // ✅ Thymeleaf: model.addAttribute("title", "React 입문")
  // ✅ React:     변수를 JSX 안에서 {} 로 바로 사용
  const title = "React 입문 — Spring Boot 개발자를 위한 전환 가이드"
  const author = "호진 강사"
  const version = "Day 01"

  // ✅ 배열 데이터 (나중에 API에서 받아올 형태와 동일)
  const topics = [
    "Vite + React 프로젝트 구조 이해",
    "컴포넌트 개념 (Thymeleaf 템플릿 vs React 컴포넌트)",
    "JSX 기본 문법",
    "함수형 컴포넌트 작성법",
    "npm run dev 로 개발 서버 실행",
  ]

  // ✅ Thymeleaf: <html xmlns:th="..."> ... </html>
  // ✅ React:     return ( <JSX> ) — 반드시 하나의 루트 태그
  return (
    <div style={styles.container}>

      {/* ✅ Thymeleaf: th:text="${title}" */}
      {/* ✅ React:     {title} — 중괄호로 JS 표현식 삽입 */}
      <header style={styles.header}>
        <h1 style={styles.title}>{title}</h1>
        <p style={styles.meta}>
          작성자: {author} &nbsp;|&nbsp; 버전: {version}
        </p>
      </header>

      <main style={styles.main}>
        <section style={styles.card}>
          <h2>📌 오늘의 학습 주제</h2>
          {/* ✅ Thymeleaf: th:each="topic : ${topics}"  */}
          {/* ✅ React:     .map() 으로 배열을 JSX 리스트로 변환 */}
          <ul style={styles.list}>
            {topics.map((topic, index) => (
              // key: React가 리스트 항목을 추적하는 식별자 (DB의 PK 개념)
              <li key={index} style={styles.listItem}>
                ✅ {topic}
              </li>
            ))}
          </ul>
        </section>

        <section style={styles.card}>
          <h2>🗂️ 프로젝트 폴더 구조</h2>
          <pre style={styles.code}>{`
day01-project/
├── index.html          ← SPA 진입점 (HTML 뼈대)
├── package.json        ← 의존성 관리 (pom.xml 역할)
├── vite.config.js      ← 빌드 설정 (application.properties 역할)
└── src/
    ├── main.jsx        ← 앱 진입점 (main() 메서드 역할)
    ├── App.jsx         ← 루트 컴포넌트
    ├── index.css       ← 전역 스타일
    └── assets/         ← 정적 파일 (이미지, 아이콘 등)
          `}</pre>
        </section>

        <section style={styles.card}>
          <h2>⚡ Thymeleaf vs React 핵심 차이</h2>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>구분</th>
                <th style={styles.th}>Thymeleaf (SSR)</th>
                <th style={styles.th}>React (CSR)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["렌더링 위치", "서버 (Spring Boot)", "브라우저 (JavaScript)"],
                ["HTML 생성", "서버가 완성해서 전송", "JS가 브라우저에서 생성"],
                ["데이터 삽입", "th:text=\"${data}\"", "{data}"],
                ["반복 렌더링", "th:each", ".map()"],
                ["진입 파일", "templates/*.html", "src/App.jsx"],
              ].map(([구분, th, react], i) => (
                <tr key={i} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                  <td style={styles.td}><strong>{구분}</strong></td>
                  <td style={styles.td}>{th}</td>
                  <td style={styles.td}>{react}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      <footer style={styles.footer}>
        <p>React 전환 교육 Day 01 — {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

// ✅ CSS-in-JS 방식 (별도 CSS 파일 없이 컴포넌트에 스타일 정의)
// 나중에 CSS 파일 또는 Tailwind CSS로 분리 예정
const styles = {
  container: {
    fontFamily: "'Segoe UI', sans-serif",
    maxWidth: '900px',
    margin: '0 auto',
    padding: '20px',
    color: '#333',
  },
  header: {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    padding: '30px',
    borderRadius: '12px',
    marginBottom: '24px',
  },
  title: {
    margin: 0,
    fontSize: '1.8rem',
  },
  meta: {
    margin: '8px 0 0',
    opacity: 0.85,
    fontSize: '0.9rem',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  card: {
    background: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  list: {
    lineHeight: 2,
    paddingLeft: '20px',
  },
  listItem: {
    marginBottom: '6px',
  },
  code: {
    background: '#1e1e1e',
    color: '#d4d4d4',
    padding: '16px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    overflowX: 'auto',
    lineHeight: 1.6,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.9rem',
  },
  tableHeader: {
    background: '#667eea',
    color: 'white',
  },
  th: {
    padding: '10px 14px',
    textAlign: 'left',
  },
  td: {
    padding: '10px 14px',
    borderBottom: '1px solid #eee',
  },
  trEven: { background: '#f9f9ff' },
  trOdd:  { background: 'white' },
  footer: {
    textAlign: 'center',
    marginTop: '32px',
    color: '#999',
    fontSize: '0.85rem',
  },
}

export default App
