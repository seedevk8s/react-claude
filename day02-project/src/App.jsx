/**
 * Day 02 - JSX 실습
 * 주제: 조건부 렌더링 + 리스트 렌더링
 *
 * ✅ Thymeleaf ↔ React 매핑
 * ┌────────────────────────────────────────────────────────────────┐
 * │  Thymeleaf                      React (JSX)                    │
 * │  th:if="${condition}"            {condition && <JSX>}           │
 * │  th:unless="${condition}"        {!condition && <JSX>}          │
 * │  th:if / th:else (없음→삼항)     {a ? <A/> : <B/>}             │
 * │  th:each="item : ${list}"        {list.map(item => <JSX>)}      │
 * │  th:class="${...}"               className={...}                │
 * │  th:style="${...}"               style={{ key: value }}          │
 * └────────────────────────────────────────────────────────────────┘
 */

import ConditionalSection from './components/ConditionalSection.jsx'
import ListSection from './components/ListSection.jsx'
import JsxRulesSection from './components/JsxRulesSection.jsx'

function App() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Day 02 — JSX 심화 실습</h1>
        <p>조건부 렌더링 · 리스트 렌더링 · JSX 문법 규칙</p>
      </header>

      <main style={styles.main}>
        <ConditionalSection />
        <ListSection />
        <JsxRulesSection />
      </main>

      <footer style={styles.footer}>
        <p>React 전환 교육 Day 02</p>
      </footer>
    </div>
  )
}

const styles = {
  container: { fontFamily: "'Segoe UI', sans-serif", maxWidth: '960px', margin: '0 auto', padding: '20px', color: '#333' },
  header:    { background: 'linear-gradient(135deg, #11998e, #38ef7d)', color: 'white', padding: '30px', borderRadius: '12px', marginBottom: '24px' },
  main:      { display: 'flex', flexDirection: 'column', gap: '20px' },
  footer:    { textAlign: 'center', marginTop: '32px', color: '#999', fontSize: '0.85rem' },
}

export default App
