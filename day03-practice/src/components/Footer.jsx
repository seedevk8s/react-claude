// [매핑] Thymeleaf: templates/fragments/footer.html
//        React    : src/components/Footer.jsx

function Footer() {
  // ✏️ { } 표현식: 연도를 하드코딩하지 않고 JS로 자동 계산
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <p>© {year} BookStore. All rights reserved.</p>
    </footer>
  )
}

export default Footer
