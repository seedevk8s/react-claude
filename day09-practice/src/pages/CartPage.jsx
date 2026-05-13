import { Link } from 'react-router-dom'

// ✏️ Thymeleaf: @GetMapping("/cart") → model.addAttribute("cart", cart)
export default function CartPage({ cart, onRemove }) {
  const total = cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0)

  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <h1 className="page-title">🛒 장바구니</h1>
        <div className="empty-box">
          <p className="text-4xl mb-3">🛒</p>
          <p>장바구니가 비어 있습니다.</p>
          <Link to="/" className="btn-primary inline-block mt-4">도서 목록 보기</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-container">
      <h1 className="page-title">🛒 장바구니</h1>

      {cart.map(item => (
        <div key={item.id} className="cart-item">
          <img
            src={item.coverImage || `https://via.placeholder.com/60x80/4338CA/FFFFFF?text=${encodeURIComponent(item.title)}`}
            alt={item.title}
            className="w-16 h-20 object-cover rounded-lg flex-shrink-0"
          />
          <div className="flex-1">
            <p className="font-semibold text-gray-800">{item.title}</p>
            <p className="text-sm text-gray-500">{item.author}</p>
            <p className="text-indigo-700 font-bold mt-1">{item.price?.toLocaleString()}원</p>
          </div>
          <button
            className="btn-secondary btn-sm"
            onClick={() => onRemove?.(item.id)}
          >
            제거
          </button>
        </div>
      ))}

      <div className="mt-6 bg-white rounded-xl p-5 shadow-sm">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-700">합계</span>
          <span className="text-2xl font-bold text-indigo-700">{total.toLocaleString()}원</span>
        </div>
        <button className="btn-primary w-full mt-4">결제하기</button>
      </div>
    </div>
  )
}
