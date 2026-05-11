// pages/NotFound.jsx — 404 페이지
//
// ✏️ <Route path="*"> — 위 Route 중 아무것도 매칭 안 될 때 렌더링
//    [매핑] @GetMapping → 없는 경우 → 404 에러 페이지

import { Link, useNavigate } from 'react-router-dom'

function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="not-found">
      <p className="text-8xl">404</p>
      <h1 className="text-2xl font-bold text-gray-700">페이지를 찾을 수 없습니다</h1>
      <p className="text-gray-500">요청하신 URL이 존재하지 않습니다.</p>
      <div className="flex gap-3 mt-4">
        <button className="btn-secondary" onClick={() => navigate(-1)}>← 뒤로가기</button>
        <Link to="/" className="btn-primary px-6 py-2">🏠 홈으로</Link>
      </div>
    </div>
  )
}

export default NotFound
