/**
 * Day 03 - App.jsx
 * 주제: 컴포넌트 분리 설계 (Header / Footer / Layout / ProductCard)
 *
 * ✅ Thymeleaf 대응 개념
 * ┌─────────────────────────────────────────────────────────────────┐
 * │  Thymeleaf                       React                          │
 * │  fragments/header.html           components/Header.jsx          │
 * │  fragments/footer.html           components/Footer.jsx          │
 * │  layout/default.html             components/Layout.jsx          │
 * │  th:replace="~{fragments/...}"   <Header /> <Footer />          │
 * │  th:fragment="content"           {children} props               │
 * │  <div th:text="${p.name}">       <ProductCard product={p} />    │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * 컴포넌트 트리:
 *   App
 *   └── Layout
 *       ├── Header        (공통 헤더)
 *       ├── main (children)
 *       │   └── ProductCard × N
 *       └── Footer        (공통 푸터)
 */

import Layout from './components/Layout.jsx'
import ProductCard from './components/ProductCard.jsx'

// ✅ 실습 데이터 (Day 8에서 Axios + Spring Boot API로 교체)
const products = [
  {
    id: 1,
    name: "스프링 부트 완전 정복",
    description: "Spring Boot 3.x 기반의 백엔드 개발 실무 완성서. REST API, JPA, 보안까지.",
    price: 32000,
    originalPrice: 38000,
    category: "BOOK",
    imageEmoji: "📗",
    stock: 15,
    rating: 4.8,
    reviewCount: 234,
    isNew: true,
    isBestseller: true,
  },
  {
    id: 2,
    name: "React 핵심 원리",
    description: "함수형 컴포넌트와 Hooks를 중심으로 React를 처음부터 실무까지 학습합니다.",
    price: 28000,
    originalPrice: 28000,
    category: "BOOK",
    imageEmoji: "📘",
    stock: 0,
    rating: 4.6,
    reviewCount: 189,
    isNew: true,
    isBestseller: false,
  },
  {
    id: 3,
    name: "개발자 무선 키보드",
    description: "적축 기계식. 87키 텐키리스. 오래 써도 손목이 편안한 개발자를 위한 키보드.",
    price: 89000,
    originalPrice: 110000,
    category: "DEVICE",
    imageEmoji: "⌨️",
    stock: 7,
    rating: 4.9,
    reviewCount: 512,
    isNew: false,
    isBestseller: true,
  },
  {
    id: 4,
    name: "코딩 스티커 팩",
    description: "노트북을 꾸밀 수 있는 개발 관련 스티커 50종 세트. 방수 소재.",
    price: 5000,
    originalPrice: 5000,
    category: "SUPPLIES",
    imageEmoji: "🏷️",
    stock: 30,
    rating: 4.3,
    reviewCount: 88,
    isNew: false,
    isBestseller: false,
  },
  {
    id: 5,
    name: "알고리즘 인터뷰",
    description: "코딩 테스트 완벽 대비. 유형별 핵심 문제 100선과 풀이 전략.",
    price: 25000,
    originalPrice: 30000,
    category: "BOOK",
    imageEmoji: "📙",
    stock: 3,
    rating: 4.7,
    reviewCount: 305,
    isNew: false,
    isBestseller: true,
  },
  {
    id: 6,
    name: "USB-C 허브 7포트",
    description: "HDMI, USB 3.0 × 3, SD카드, 충전 지원. MacBook / Windows 호환.",
    price: 45000,
    originalPrice: 55000,
    category: "DEVICE",
    imageEmoji: "🔌",
    stock: 0,
    rating: 4.4,
    reviewCount: 167,
    isNew: false,
    isBestseller: false,
  },
]

function App() {
  return (
    // ✅ Thymeleaf: layout/default.html 에 해당하는 Layout 컴포넌트
    // ✅ children prop: th:fragment="content" 와 동일한 슬롯 개념
    <Layout>
      <section style={styles.productSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>📦 상품 목록</h2>
          <span style={styles.count}>{products.length}개 상품</span>
        </div>

        {/* ✅ Thymeleaf: th:each="p : ${products}"
            ✅ React:     products.map(p => <ProductCard product={p} />) */}
        <div style={styles.grid}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </Layout>
  )
}

const styles = {
  productSection: { padding: '0' },
  sectionHeader:  { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  sectionTitle:   { margin: 0, fontSize: '1.4rem' },
  count:          { color: '#888', fontSize: '0.9rem' },
  grid:           { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
}

export default App
