// BookCard.jsx — 도서 카드 컴포넌트
//
// [매핑] Thymeleaf: templates/fragments/bookCard.html
//        React    : src/components/BookCard.jsx
//
// ✏️ Props: 부모 컴포넌트가 전달하는 데이터
//    Thymeleaf: th:text="${book.title}" — 모델에서 직접 참조
//    React    : 부모가 prop으로 넘겨주고, 자식은 받아서 출력

// ✏️ 구조분해 할당 — 실무 표준
//    아래 두 가지는 동일하게 동작한다
//
//    방식 1 (비추천): function BookCard(props) { return <h3>{props.title}</h3> }
//    방식 2 (추천):   function BookCard({ title, author, ... }) { return <h3>{title}</h3> }

// ✏️ Props 기본값: color = "blue" 처럼 = 으로 기본값 설정 가능
//    전달받지 못한 경우 기본값이 사용된다
function BookCard({ title, author, price, inStock, isNew = false, isSale = false }) {
  return (
    <div className="book-card">

      {/* 뱃지 영역: isNew / isSale 이 true 일 때만 출력 */}
      <div className="book-badges">
        {/* ✏️ && 조건부 렌더링: prop 값에 따라 뱃지 표시 여부 결정 */}
        {isNew  && <span className="badge-new">NEW</span>}
        {isSale && <span className="badge-sale">SALE</span>}
      </div>

      <div>
        {/* ✏️ prop 으로 받은 값을 { } 로 출력 */}
        <h3 className="book-title">{title}</h3>
        <p className="book-author">{author}</p>
        <p className="book-price">{price.toLocaleString()}원</p>
      </div>

      {/* ✏️ 삼항연산자: inStock prop 값에 따라 버튼을 다르게 렌더링 */}
      {inStock
        ? <button className="btn-buy">구매하기</button>
        : <button className="btn-soldout" disabled>품절</button>
      }

    </div>
  )
}

export default BookCard
