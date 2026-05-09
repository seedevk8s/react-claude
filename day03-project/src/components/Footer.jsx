/**
 * Footer.jsx — 공통 푸터 컴포넌트
 *
 * ✅ Thymeleaf 대응:
 *   templates/fragments/footer.html
 *   <th:block th:replace="~{fragments/footer :: footer}">
 */

function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    "회사 정보": ["회사 소개", "채용 안내", "투자 정보", "ESG 경영"],
    "고객 지원": ["공지사항", "자주 묻는 질문", "1:1 문의", "환불 정책"],
    "개발자": ["API 문서", "GitHub", "기술 블로그", "오픈소스"],
  }

  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>
        {/* 링크 그룹 */}
        <div style={styles.linkGroups}>
          {/* ✅ Object.entries: key-value 쌍을 배열로 변환 후 map */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group} style={styles.linkGroup}>
              <h4 style={styles.groupTitle}>{group}</h4>
              <ul style={styles.linkList}>
                {links.map((link, i) => (
                  <li key={i}>
                    <a href="#" style={styles.link}>{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 하단 저작권 */}
        <div style={styles.bottom}>
          <p style={styles.copyright}>
            © {currentYear} React 전환 교육 프로젝트. All rights reserved.
          </p>
          <p style={styles.tech}>
            Built with <span style={styles.highlight}>React 18</span> + <span style={styles.highlight}>Vite 5</span> + <span style={styles.highlight}>Spring Boot 3</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

const styles = {
  footer:      { background: '#1a1a2e', color: '#ccc', marginTop: '40px' },
  inner:       { maxWidth: '1100px', margin: '0 auto', padding: '40px 20px 20px' },
  linkGroups:  { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '32px', marginBottom: '32px' },
  linkGroup:   {},
  groupTitle:  { color: 'white', marginTop: 0, marginBottom: '12px', fontSize: '0.95rem' },
  linkList:    { listStyle: 'none', padding: 0, margin: 0 },
  link:        { color: '#aaa', textDecoration: 'none', fontSize: '0.85rem', lineHeight: 2.2 },
  bottom:      { borderTop: '1px solid #333', paddingTop: '20px', textAlign: 'center' },
  copyright:   { margin: '0 0 6px', fontSize: '0.85rem' },
  tech:        { margin: 0, fontSize: '0.8rem', color: '#777' },
  highlight:   { color: '#667eea', fontWeight: 'bold' },
}

export default Footer
