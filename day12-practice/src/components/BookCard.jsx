// src/components/BookCard.jsx — Day 11 리팩토링: React.memo 적용
import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

// ✅ React.memo: props가 바뀌지 않으면 리렌더링 건너뜀
// CartContext의 addToCart를 useCallback으로 안정화했으므로 효과적
const BookCard = React.memo(function BookCard({ book }) {
  const { addToCart } = useCart()
  return (
    <div className="book-card">
      <Link to={`/books/${book.id}`}>
        <img src={book.coverImage || `https://via.placeholder.com/200x280/4338CA/FFFFFF?text=${encodeURIComponent(book.title)}`}
          alt={book.title} className="book-card-img" />
      </Link>
      <div className="book-card-body">
        <Link to={`/books/${book.id}`}><h3 className="book-card-title">{book.title}</h3></Link>
        <p className="book-card-author">{book.author}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="book-card-price">{book.price?.toLocaleString()}원</span>
          <button className="btn-primary btn-sm" onClick={() => addToCart(book)}>담기</button>
        </div>
      </div>
    </div>
  )
})
export default BookCard
