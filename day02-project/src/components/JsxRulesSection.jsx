/**
 * JsxRulesSection.jsx
 * 주제: JSX 핵심 문법 규칙 7가지 (흔한 실수 포함)
 */

function JsxRulesSection() {
  return (
    <section style={styles.card}>
      <h2>📐 JSX 핵심 문법 규칙</h2>

      {rules.map((rule, index) => (
        <div key={index} style={styles.ruleBox}>
          <div style={styles.ruleHeader}>
            <span style={styles.ruleNumber}>{index + 1}</span>
            <strong>{rule.title}</strong>
          </div>
          <div style={styles.compareGrid}>
            <div style={styles.wrong}>
              <p style={styles.label}>❌ 잘못된 코드</p>
              <pre style={styles.code}>{rule.wrong}</pre>
            </div>
            <div style={styles.right}>
              <p style={styles.label}>✅ 올바른 코드</p>
              <pre style={styles.code}>{rule.correct}</pre>
            </div>
          </div>
          <p style={styles.explanation}>{rule.explanation}</p>
        </div>
      ))}
    </section>
  )
}

const rules = [
  {
    title: "하나의 루트 태그만 반환",
    wrong:  `return (\n  <h1>제목</h1>\n  <p>내용</p>\n)`,
    correct:`return (\n  <>\n    <h1>제목</h1>\n    <p>내용</p>\n  </>\n)`,
    explanation: "<> </> 는 Fragment. DOM에 실제 태그를 추가하지 않음. div로 감싸면 불필요한 태그가 생김.",
  },
  {
    title: "class → className, for → htmlFor",
    wrong:  `<div class="container">\n<label for="name">이름</label>`,
    correct:`<div className="container">\n<label htmlFor="name">이름</label>`,
    explanation: "class, for는 JS 예약어이므로 JSX에서는 className, htmlFor 사용.",
  },
  {
    title: "모든 태그는 닫아야 함 (self-closing)",
    wrong:  `<input type="text">\n<br>\n<img src="...">`,
    correct:`<input type="text" />\n<br />\n<img src="..." />`,
    explanation: "HTML5는 빈 태그를 안 닫아도 되지만 JSX는 반드시 / 로 닫아야 함.",
  },
  {
    title: "JS 표현식은 {} 안에",
    wrong:  `<p>안녕, name님</p>\n<p>합계: price * qty</p>`,
    correct:`<p>안녕, {name}님</p>\n<p>합계: {price * qty}원</p>`,
    explanation: "{} 안에는 JS 표현식(값으로 평가되는 코드)만 가능. if문, for문은 불가.",
  },
  {
    title: "인라인 스타일은 객체로",
    wrong:  `<p style="color: red; font-size: 16px">`,
    correct:`<p style={{ color: 'red', fontSize: '16px' }}>`,
    explanation: "style 속성에 문자열 대신 JS 객체를 사용. camelCase: font-size → fontSize.",
  },
  {
    title: "리스트에는 반드시 key 속성",
    wrong:  `{items.map(item => (\n  <li>{item.name}</li>\n))}`,
    correct:`{items.map(item => (\n  <li key={item.id}>{item.name}</li>\n))}`,
    explanation: "key는 React가 항목을 추적하는 식별자. DB의 PK처럼 유일해야 함. index 사용은 최후 수단.",
  },
  {
    title: "주석은 {/* */} 형식",
    wrong:  `<!-- HTML 주석은 JSX에서 오류 -->`,
    correct:`{/* JSX 주석은 이 형식 */}`,
    explanation: "JSX return() 블록 안에서는 {/* */} 형식 사용. // 주석은 JSX 밖에서만 사용 가능.",
  },
]

const styles = {
  card:        { background: 'white', border: '1px solid #e0e0e0', borderRadius: '10px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  ruleBox:     { background: '#f8f9fa', borderRadius: '8px', padding: '16px', marginTop: '16px', borderLeft: '4px solid #ff9800' },
  ruleHeader:  { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' },
  ruleNumber:  { background: '#ff9800', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem', flexShrink: 0 },
  compareGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '8px' },
  wrong:       { background: '#fff5f5', border: '1px solid #ffcdd2', borderRadius: '6px', padding: '10px' },
  right:       { background: '#f0fdf4', border: '1px solid #c8e6c9', borderRadius: '6px', padding: '10px' },
  label:       { margin: '0 0 6px', fontSize: '0.8rem', fontWeight: 'bold' },
  code:        { margin: 0, fontSize: '0.82rem', whiteSpace: 'pre-wrap', fontFamily: 'monospace' },
  explanation: { margin: 0, fontSize: '0.88rem', color: '#555', borderTop: '1px dashed #ddd', paddingTop: '8px' },
}

export default JsxRulesSection
