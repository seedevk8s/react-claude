// [매핑] Thymeleaf: templates/fragments/footer.html
//        React    : src/components/Footer.jsx

function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <p>© {year} BookStore. All rights reserved.</p>
    </footer>
  )
}

export default Footer
