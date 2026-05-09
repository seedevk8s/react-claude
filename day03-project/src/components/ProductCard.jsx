/**
 * ProductCard.jsx — 상품 카드 컴포넌트
 *
 * ✅ Thymeleaf 대응:
 *   templates/fragments/productCard.html
 *   <div th:fragment="productCard(product)">
 *     <h3 th:text="${product.name}"></h3>
 *     <span th:text="${product.price}"></span>
 *     ...
 *   </div>
 *
 * ✅ props 설계 원칙:
 *   - 컴포넌트는 props를 읽기만 함 (수정 금지 = 불변성)
 *   - Thymeleaf model의 데이터를 읽기만 하는 것과 동일
 *
 * 사용법:
 *   <ProductCard product={productObject} onAddToCart={함수} />
 */

// ✅ Props 구조분해: product 객체와 콜백 함수를 받음
function ProductCard({ product, onAddToCart }) {

  // 할인율 계산 (헬퍼 로직)
  const discountRate = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0

  // 별점 렌더링 헬퍼
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < Math.round(rating) ? '#ffc107' : '#ddd' }}>★</span>
    ))
  }

  return (
    <article style={{
      ...styles.card,
      // ✅ 품절 시 흐리게 처리 (th:class 동적 클래스 대응)
      opacity: product.stock === 0 ? 0.65 : 1,
    }}>
      {/* ── 뱃지 영역 ─────────────────────────── */}
      <div style={styles.badgeArea}>
        {product.isNew && (
          <span style={styles.badge('#ef5350')}>NEW</span>
        )}
        {product.isBestseller && (
          <span style={styles.badge('#ff9800')}>BEST</span>
        )}
        {discountRate > 0 && (
          <span style={styles.badge('#4caf50')}>{discountRate}% OFF</span>
        )}
      </div>

      {/* ── 이미지 영역 (emoji로 대체) ─────────── */}
      <div style={styles.imageArea}>
        <span style={styles.imageEmoji}>{product.imageEmoji}</span>
        <span style={styles.categoryTag}>{product.category}</span>
      </div>

      {/* ── 상품 정보 ──────────────────────────── */}
      <div style={styles.info}>
        {/* ✅ Thymeleaf: th:text="${product.name}" */}
        <h3 style={styles.name}>{product.name}</h3>

        {/* ✅ Thymeleaf: th:text="${product.description}" */}
        <p style={styles.description}>{product.description}</p>

        {/* 별점 */}
        <div style={styles.ratingRow}>
          <span>{renderStars(product.rating)}</span>
          <span style={styles.ratingText}>
            {product.rating} ({product.reviewCount}개 리뷰)
          </span>
        </div>

        {/* 가격 */}
        <div style={styles.priceArea}>
          {discountRate > 0 && (
            <span style={styles.originalPrice}>
              {product.originalPrice.toLocaleString()}원
            </span>
          )}
          {/* ✅ Thymeleaf: th:text="${#numbers.formatInteger(product.price, 3, 'COMMA')}" */}
          <span style={styles.price}>{product.price.toLocaleString()}원</span>
        </div>

        {/* 재고 표시 */}
        {product.stock > 0 && product.stock <= 5 && (
          <p style={styles.lowStock}>⚠️ 재고 {product.stock}개 남음</p>
        )}
      </div>

      {/* ── 버튼 영역 ──────────────────────────── */}
      <div style={styles.buttonArea}>
        {product.stock > 0 ? (
          <>
            <button
              style={styles.btnCart}
              onClick={() => onAddToCart && onAddToCart(product)}
            >
              🛒 장바구니
            </button>
            <button style={styles.btnBuy}>바로 구매</button>
          </>
        ) : (
          <button style={styles.btnSoldOut} disabled>
            ❌ 품절 — 재입고 알림
          </button>
        )}
      </div>
    </article>
  )
}

// ────────────────────────────────────────────
// 스타일 정의
// ────────────────────────────────────────────
const styles = {
  card: {
    background: 'white',
    border: '1px solid #e8e8e8',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'box-shadow .2s',
  },
  badgeArea: {
    display: 'flex', gap: '6px',
    padding: '10px 12px 0',
    minHeight: '28px',
  },
  badge: (bg) => ({
    background: bg, color: 'white',
    fontSize: '0.7rem', fontWeight: 'bold',
    padding: '2px 8px', borderRadius: '12px',
  }),
  imageArea: {
    background: 'linear-gradient(135deg, #f0f2ff, #e8f4f8)',
    height: '140px',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    gap: '8px',
    margin: '8px 12px',
    borderRadius: '8px',
  },
  imageEmoji:  { fontSize: '3.5rem' },
  categoryTag: { background: 'rgba(0,0,0,0.08)', fontSize: '0.75rem', padding: '2px 10px', borderRadius: '12px', color: '#555' },
  info:        { padding: '12px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' },
  name:        { margin: 0, fontSize: '1rem', fontWeight: '700', color: '#1a1a2e', lineHeight: 1.3 },
  description: { margin: 0, fontSize: '0.82rem', color: '#666', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  ratingRow:   { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' },
  ratingText:  { color: '#888' },
  priceArea:   { display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' },
  originalPrice: { fontSize: '0.82rem', color: '#bbb', textDecoration: 'line-through' },
  price:         { fontSize: '1.15rem', fontWeight: '800', color: '#e53935' },
  lowStock:      { margin: 0, fontSize: '0.8rem', color: '#f57c00', fontWeight: '600' },
  buttonArea:  { padding: '12px 16px', display: 'flex', gap: '8px', borderTop: '1px solid #f0f0f0', marginTop: 'auto' },
  btnCart:     { flex: 1, padding: '9px', background: 'white', color: '#667eea', border: '2px solid #667eea', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.88rem' },
  btnBuy:      { flex: 1, padding: '9px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.88rem' },
  btnSoldOut:  { flex: 1, padding: '9px', background: '#f5f5f5', color: '#999', border: '1px solid #ddd', borderRadius: '8px', cursor: 'not-allowed', fontSize: '0.88rem' },
}

export default ProductCard
