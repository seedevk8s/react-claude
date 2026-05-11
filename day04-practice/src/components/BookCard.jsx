// BookCard.jsx — 도서 카드 컴포넌트
//
// ✏️ Day 4 변경: onAddToCart 이벤트 핸들러 prop 추가
//    버튼 클릭 → 부모(Home)가 전달한 함수 실행 → 장바구니 state 업데이트
//
// [매핑] Thymeleaf: th:action 으로 폼 submit → 서버로 요청
//        React    : onClick → 부모 함수 호출 → state 변경 → 화면 자동 갱신

function BookCard({ id, title, author, price, inStock, isNew = false, isSale = false, isInCart = false, onAddToCart }) {
  return (
    <div className="book-card">

      <div className="book-badges">
        {isNew    && <span className="badge-new">NEW</span>}
        {isSale   && <span className="badge-sale">SALE</span>}
        {isInCart && <span className="badge-in-cart">담김</span>}
      </div>

      <div>
        <h3 className="book-title">{title}</h3>
        <p className="book-author">{author}</p>
        <p className="book-price">{price.toLocaleString()}원</p>
      </div>

      {/*
        ✏️ 이벤트 핸들러: onClick
           Thymeleaf: <form th:action="@{/cart/add}" method="post">
           React    : onClick={함수}  — 페이지 이동 없이 JS 함수 실행

           ✏️ onClick 에 함수를 직접 실행하면 안 된다 (흔한 실수!)
              ❌ onClick={onAddToCart(id)}   → 렌더링 즉시 실행됨
              ✅ onClick={() => onAddToCart(id)} → 클릭할 때만 실행됨
      */}
      {inStock ? (
        isInCart ? (
          <button className="btn-added" onClick={() => onAddToCart(id)}>
            ✅ 담김 (다시 담기)
          </button>
        ) : (
          <button className="btn-buy" onClick={() => onAddToCart(id)}>
            🛒 장바구니 담기
          </button>
        )
      ) : (
        <button className="btn-soldout" disabled>품절</button>
      )}

    </div>
  )
}

export default BookCard
