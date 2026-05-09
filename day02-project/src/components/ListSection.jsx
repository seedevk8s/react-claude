/**
 * ListSection.jsx
 * 주제: 리스트 렌더링 (th:each 대응)
 *
 * Thymeleaf                              React JSX
 * th:each="p : ${products}"             products.map(p => <JSX key={p.id}>)
 * th:text="${p.name}"                    {p.name}
 * th:if="${p.stock > 0}"                 {p.stock > 0 && ...}
 * th:class="${p.category == 'NEW'...}"   className 동적 바인딩
 */

// ✅ 실습 데이터 (나중에 Axios + Spring Boot API로 대체)
const products = [
  { id: 1, name: "스프링 부트 완전 정복",   category: "BOOK",     price: 32000, stock: 15, isNew: true  },
  { id: 2, name: "React 핵심 원리",         category: "BOOK",     price: 28000, stock: 0,  isNew: true  },
  { id: 3, name: "개발자 키보드",           category: "DEVICE",   price: 89000, stock: 7,  isNew: false },
  { id: 4, name: "코딩 스티커 팩",          category: "SUPPLIES", price: 5000,  stock: 30, isNew: false },
  { id: 5, name: "알고리즘 문제집",         category: "BOOK",     price: 25000, stock: 0,  isNew: false },
]

const members = [
  { id: 101, name: "김철수", role: "ADMIN",  active: true  },
  { id: 102, name: "이영희", role: "USER",   active: true  },
  { id: 103, name: "박민준", role: "USER",   active: false },
  { id: 104, name: "최지아", role: "USER",   active: true  },
]

function ListSection() {
  return (
    <section style={styles.card}>
      <h2>📋 리스트 렌더링 (List Rendering)</h2>

      {/* ──────────────────────────────────────────
          예제 1: 단순 리스트
          Thymeleaf: th:each="item : ${list}"
          React:     list.map((item, index) => ...)
      ────────────────────────────────────────── */}
      <div style={styles.example}>
        <h3>예제 1: 단순 배열 렌더링 (th:each 기본)</h3>
        <div style={styles.codeBlock}>
{`// ✅ Thymeleaf
<li th:each="p : \${products}" th:text="\${p.name}"></li>

// ✅ React
{products.map(p => (
  <li key={p.id}>{p.name}</li>
))}`}
        </div>
        <ul style={styles.simpleList}>
          {products.map(p => (
            <li key={p.id}>{p.name} — {p.price.toLocaleString()}원</li>
          ))}
        </ul>
      </div>

      {/* ──────────────────────────────────────────
          예제 2: 카드형 리스트 + 조건부 렌더링 결합
          Thymeleaf: th:each + th:if + th:class 조합
          React:     .map() + 삼항/&& 혼합
      ────────────────────────────────────────── */}
      <div style={styles.example}>
        <h3>예제 2: 카드 리스트 (th:each + th:if + th:class 조합)</h3>
        <div style={styles.productGrid}>
          {products.map(product => (
            <div key={product.id} style={{
              ...styles.productCard,
              opacity: product.stock === 0 ? 0.6 : 1,
            }}>
              {/* NEW 뱃지: th:if="${p.isNew}" */}
              {product.isNew && <span style={styles.newBadge}>NEW</span>}

              <h4 style={{ margin: '8px 0 4px' }}>{product.name}</h4>
              <p style={styles.category}>{product.category}</p>
              <p style={styles.price}>{product.price.toLocaleString()}원</p>

              {/* 재고 조건: th:if="${p.stock > 0}" */}
              {product.stock > 0
                ? <button style={styles.btnBuy}>
                    🛒 구매하기 ({product.stock}개 남음)
                  </button>
                : <button style={styles.btnSoldOut} disabled>
                    ❌ 품절
                  </button>
              }
            </div>
          ))}
        </div>
      </div>

      {/* ──────────────────────────────────────────
          예제 3: 테이블 렌더링
          Thymeleaf: <tr th:each="m : ${members}">
          React:     members.map(m => <tr key={m.id}>)
      ────────────────────────────────────────── */}
      <div style={styles.example}>
        <h3>예제 3: 테이블 렌더링 (th:each 테이블 버전)</h3>
        <div style={styles.codeBlock}>
{`// ✅ Thymeleaf
<tr th:each="m : \${members}">
  <td th:text="\${m.id}"></td>
  <td th:text="\${m.name}"></td>
</tr>

// ✅ React
{members.map(m => (
  <tr key={m.id}>
    <td>{m.id}</td>
    <td>{m.name}</td>
  </tr>
))}`}
        </div>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>이름</th>
              <th style={styles.th}>권한</th>
              <th style={styles.th}>상태</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m, index) => (
              <tr key={m.id} style={index % 2 === 0 ? styles.trEven : styles.trOdd}>
                <td style={styles.td}>{m.id}</td>
                <td style={styles.td}>{m.name}</td>
                <td style={styles.td}>
                  <span style={m.role === 'ADMIN' ? styles.roleAdmin : styles.roleUser}>
                    {m.role}
                  </span>
                </td>
                <td style={styles.td}>
                  {m.active
                    ? <span style={styles.statusOn}>● 활성</span>
                    : <span style={styles.statusOff}>● 비활성</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ──────────────────────────────────────────
          예제 4: 필터링 + 정렬 (filter + sort + map)
          Thymeleaf: Java에서 필터링 후 모델에 담아 전달
          React:     JS 배열 메서드로 바로 처리 가능
      ────────────────────────────────────────── */}
      <div style={styles.example}>
        <h3>예제 4: 필터 + 정렬 (filter → sort → map)</h3>
        <div style={styles.codeBlock}>
{`// ✅ React: 재고 있는 도서만, 가격 낮은 순 정렬
products
  .filter(p => p.category === 'BOOK' && p.stock > 0)
  .sort((a, b) => a.price - b.price)
  .map(p => <li key={p.id}>{p.name}</li>)`}
        </div>
        <p style={{ color: '#555', fontSize: '0.9rem' }}>📚 재고 있는 도서 (가격 낮은 순):</p>
        <ul style={styles.simpleList}>
          {products
            .filter(p => p.category === 'BOOK' && p.stock > 0)
            .sort((a, b) => a.price - b.price)
            .map(p => (
              <li key={p.id}>
                {p.name} — <strong>{p.price.toLocaleString()}원</strong>
                {p.isNew && <span style={styles.newBadge}>NEW</span>}
              </li>
            ))
          }
        </ul>
      </div>
    </section>
  )
}

const styles = {
  card:    { background: 'white', border: '1px solid #e0e0e0', borderRadius: '10px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  example: { background: '#f8f9fa', borderRadius: '8px', padding: '16px', marginTop: '16px', borderLeft: '4px solid #38ef7d' },
  codeBlock: { background: '#1e1e1e', color: '#d4d4d4', padding: '12px', borderRadius: '4px', fontSize: '0.82rem', whiteSpace: 'pre', overflowX: 'auto', marginBottom: '12px', lineHeight: 1.6 },
  simpleList: { lineHeight: 2, paddingLeft: '24px' },
  productGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', marginTop: '12px' },
  productCard: { background: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '14px', position: 'relative', transition: 'box-shadow .2s' },
  newBadge: { position: 'absolute', top: '8px', right: '8px', background: '#ff5722', color: 'white', fontSize: '0.7rem', padding: '2px 7px', borderRadius: '12px', fontWeight: 'bold' },
  category: { color: '#888', fontSize: '0.8rem', margin: '0 0 4px' },
  price:    { color: '#e53935', fontWeight: 'bold', margin: '0 0 10px' },
  btnBuy:     { width: '100%', padding: '7px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem' },
  btnSoldOut: { width: '100%', padding: '7px', background: '#bbb',    color: 'white', border: 'none', borderRadius: '6px', cursor: 'not-allowed', fontSize: '0.82rem' },
  table:     { width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' },
  thead:     { background: '#11998e', color: 'white' },
  th:        { padding: '10px 14px', textAlign: 'left' },
  td:        { padding: '10px 14px', borderBottom: '1px solid #eee' },
  trEven:    { background: '#f0fdf4' },
  trOdd:     { background: 'white' },
  roleAdmin: { background: '#9c27b0', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' },
  roleUser:  { background: '#2196f3', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' },
  statusOn:  { color: '#2e7d32', fontWeight: 'bold' },
  statusOff: { color: '#9e9e9e' },
}

export default ListSection
