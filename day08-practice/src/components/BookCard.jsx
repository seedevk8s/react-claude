function BookCard({ id, title, author, price, category, inStock,
                    isNew = false, isSale = false, isInCart = false,
                    onAddToCart }) {
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
        <p className="book-category">{category}</p>
        <p className="book-price">{price.toLocaleString()}원</p>
      </div>
      {inStock ? (
        isInCart ? (
          <button className="btn-added" onClick={() => onAddToCart(id)}>✅ 담김</button>
        ) : (
          <button className="btn-buy" onClick={() => onAddToCart(id)}>🛒 장바구니</button>
        )
      ) : (
        <button className="btn-soldout" disabled>품절</button>
      )}
    </div>
  )
}
export default BookCard
