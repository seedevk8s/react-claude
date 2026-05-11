// ✏️ 컴포넌트 규칙 ①: 파일명 = 컴포넌트명 (Header.jsx → function Header)
// ✏️ 컴포넌트 규칙 ②: 이름은 반드시 대문자로 시작
//
// [매핑] Thymeleaf: templates/fragments/header.html
//        React    : src/components/Header.jsx
//
// [매핑] th:replace="~{fragments/header :: header}"
//        → <Header /> (사용하는 곳에서 태그 한 줄로 삽입)

function Header() {
  return (
    <header className="header">
      <div className="header-logo">
        📚 BookStore
      </div>
      <nav className="header-nav">
        <a href="/">홈</a>
        <a href="/books">도서 목록</a>
        <a href="/login">로그인</a>
      </nav>
    </header>
  )
}

// ✏️ 컴포넌트 규칙 ③: export default 가 있어야 다른 파일에서 import 가능
export default Header
