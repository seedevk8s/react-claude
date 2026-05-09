/**
 * ConditionalSection.jsx
 * 주제: 조건부 렌더링 3가지 패턴
 *
 * Thymeleaf                        React JSX
 * th:if="${isLoggedIn}"            {isLoggedIn && <컴포넌트/>}
 * th:unless="${isLoggedIn}"        {!isLoggedIn && <컴포넌트/>}
 * (if/else 분기)                   {isLoggedIn ? <A/> : <B/>}
 */

// ✅ 실습 데이터: 나중에 API 응답으로 대체될 값
const isLoggedIn = true        // 로그인 상태
const userRole   = "ADMIN"     // 권한: "ADMIN" | "USER" | "GUEST"
const stock      = 0           // 재고 수량
const score      = 85          // 점수

function ConditionalSection() {
  return (
    <section style={styles.card}>
      <h2>🔀 조건부 렌더링 (Conditional Rendering)</h2>

      {/* ──────────────────────────────────────────
          패턴 1: && 연산자 (th:if 와 동일)
          Thymeleaf: <p th:if="${isLoggedIn}">환영합니다!</p>
          React:     {isLoggedIn && <p>환영합니다!</p>}
      ────────────────────────────────────────── */}
      <div style={styles.example}>
        <h3>패턴 1: <code>&amp;&amp;</code> 연산자 (th:if 대응)</h3>
        <div style={styles.code}>
          <code>{`{isLoggedIn && <p>환영합니다!</p>}`}</code>
        </div>
        <div style={styles.result}>
          {isLoggedIn && <p style={styles.success}>✅ 로그인 상태입니다. 환영합니다!</p>}
          {!isLoggedIn && <p style={styles.warning}>⚠️ 로그인이 필요합니다.</p>}
        </div>
      </div>

      {/* ──────────────────────────────────────────
          패턴 2: 삼항 연산자 (if/else 분기)
          Thymeleaf: th:if + th:unless 조합
          React:     {condition ? <A/> : <B/>}
      ────────────────────────────────────────── */}
      <div style={styles.example}>
        <h3>패턴 2: 삼항 연산자 (if-else 대응)</h3>
        <div style={styles.code}>
          <code>{`{stock > 0 ? <span>재고 있음</span> : <span>품절</span>}`}</code>
        </div>
        <div style={styles.result}>
          <strong>재고 상태: </strong>
          {stock > 0
            ? <span style={styles.badge('#4caf50')}>✅ 재고 있음 ({stock}개)</span>
            : <span style={styles.badge('#f44336')}>❌ 품절</span>
          }
        </div>
      </div>

      {/* ──────────────────────────────────────────
          패턴 3: 다중 분기 (if / else-if / else)
          Thymeleaf: th:switch / th:case
          React:     함수로 분리하거나 중첩 삼항 (함수 권장)
      ────────────────────────────────────────── */}
      <div style={styles.example}>
        <h3>패턴 3: 다중 분기 함수 (th:switch 대응)</h3>
        <div style={styles.code}>
          <code>{`function getRoleBadge(role) { ... }  →  {getRoleBadge(userRole)}`}</code>
        </div>
        <div style={styles.result}>
          <strong>권한: </strong> {getRoleBadge(userRole)}
        </div>
        <div style={styles.result}>
          <strong>점수({score}점): </strong> {getGrade(score)}
        </div>
      </div>

      {/* ──────────────────────────────────────────
          패턴 4: 동적 className (th:class 대응)
          Thymeleaf: th:class="${score >= 60 ? 'pass' : 'fail'}"
          React:     className={score >= 60 ? 'pass' : 'fail'}
      ────────────────────────────────────────── */}
      <div style={styles.example}>
        <h3>패턴 4: 동적 style / className (th:class 대응)</h3>
        <div style={styles.code}>
          <code>{`style={{ color: score >= 60 ? 'green' : 'red' }}`}</code>
        </div>
        <div style={styles.result}>
          <p style={{ 
            color: score >= 60 ? '#2e7d32' : '#c62828',
            fontWeight: 'bold',
            fontSize: '1.1rem'
          }}>
            {score}점 → {score >= 60 ? '✅ 합격' : '❌ 불합격'}
          </p>
        </div>
      </div>
    </section>
  )
}

// ────────────────────────────────────────────
// 헬퍼 함수: 다중 분기를 깔끔하게 처리
// ────────────────────────────────────────────
function getRoleBadge(role) {
  if (role === 'ADMIN') return <span style={styles.badge('#9c27b0')}>👑 관리자</span>
  if (role === 'USER')  return <span style={styles.badge('#2196f3')}>👤 일반 사용자</span>
  return                        <span style={styles.badge('#9e9e9e')}>👻 게스트</span>
}

function getGrade(score) {
  if (score >= 90) return <span style={styles.badge('#f44336')}>🏅 A등급</span>
  if (score >= 80) return <span style={styles.badge('#ff9800')}>📗 B등급</span>
  if (score >= 70) return <span style={styles.badge('#2196f3')}>📘 C등급</span>
  if (score >= 60) return <span style={styles.badge('#4caf50')}>📙 D등급</span>
  return                   <span style={styles.badge('#9e9e9e')}>❌ F등급</span>
}

// ────────────────────────────────────────────
// 스타일
// ────────────────────────────────────────────
const styles = {
  card: {
    background: 'white', border: '1px solid #e0e0e0',
    borderRadius: '10px', padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  example: {
    background: '#f8f9fa', borderRadius: '8px',
    padding: '16px', marginTop: '16px',
    borderLeft: '4px solid #11998e',
  },
  code: {
    background: '#1e1e1e', color: '#d4d4d4',
    padding: '8px 12px', borderRadius: '4px',
    fontSize: '0.85rem', marginBottom: '10px',
  },
  result: {
    padding: '8px 0',
  },
  success: { color: '#2e7d32', margin: 0 },
  warning: { color: '#e65100', margin: 0 },
  // badge는 함수로 동적 생성
  badge: (bg) => ({
    display: 'inline-block',
    background: bg, color: 'white',
    padding: '3px 10px', borderRadius: '20px',
    fontSize: '0.85rem', fontWeight: 'bold',
    marginLeft: '6px',
  }),
}

export default ConditionalSection
