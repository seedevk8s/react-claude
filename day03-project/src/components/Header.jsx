/**
 * Header.jsx — 공통 헤더 컴포넌트
 *
 * ✅ Thymeleaf 대응:
 *   templates/fragments/header.html
 *   <th:block th:replace="~{fragments/header :: header}">
 *
 * ✅ props: 외부에서 주입받는 데이터
 *   Thymeleaf model.addAttribute("siteName", "..") → <Header siteName=".."/>
 */

// ✅ props 구조분해: 자주 쓰이는 패턴
function Header({ siteName = "React 쇼핑몰", cartCount = 0 }) {
  const navItems = ["홈", "상품", "카테고리", "이벤트", "고객센터"]

  return (
    <header style={styles.header}>
      {/* 상단 바 */}
      <div style={styles.topBar}>
        <div style={styles.inner}>
          <span style={styles.siteName}>🛒 {siteName}</span>
          <nav style={styles.nav}>
            {navItems.map((item, i) => (
              <a key={i} href="#" style={styles.navLink}>{item}</a>
            ))}
          </nav>
          <div style={styles.actions}>
            {/* ✅ 조건부 렌더링: 장바구니 뱃지 */}
            <button style={styles.cartBtn}>
              🛒 장바구니
              {cartCount > 0 && (
                <span style={styles.cartBadge}>{cartCount}</span>
              )}
            </button>
            <button style={styles.loginBtn}>로그인</button>
          </div>
        </div>
      </div>

      {/* 히어로 배너 */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Spring Boot 개발자를 위한 React 전환 가이드</h1>
        <p style={styles.heroSub}>Day 03 — 컴포넌트 분리 설계 실습</p>
      </div>
    </header>
  )
}

const styles = {
  header:   { width: '100%' },
  topBar:   { background: '#1a1a2e', padding: '0 20px' },
  inner:    { maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' },
  siteName: { color: 'white', fontWeight: 'bold', fontSize: '1.1rem' },
  nav:      { display: 'flex', gap: '24px' },
  navLink:  { color: '#ccc', textDecoration: 'none', fontSize: '0.9rem', transition: 'color .2s' },
  actions:  { display: 'flex', gap: '10px', alignItems: 'center' },
  cartBtn:  { position: 'relative', background: '#667eea', color: 'white', border: 'none', padding: '7px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' },
  cartBadge:{ position: 'absolute', top: '-6px', right: '-6px', background: '#ef5350', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  loginBtn: { background: 'transparent', color: '#ccc', border: '1px solid #555', padding: '7px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' },
  hero:     { background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', padding: '40px 20px', textAlign: 'center' },
  heroTitle:{ margin: '0 0 8px', fontSize: '1.6rem' },
  heroSub:  { margin: 0, opacity: 0.85, fontSize: '1rem' },
}

export default Header
