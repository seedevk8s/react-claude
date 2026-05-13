import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <p className="text-8xl mb-4">📭</p>
      <h1 className="text-4xl font-bold text-gray-700 mb-2">404</h1>
      <p className="text-gray-500 mb-6">요청하신 페이지를 찾을 수 없습니다.</p>
      <Link to="/" className="btn-primary">홈으로 돌아가기</Link>
    </div>
  )
}
