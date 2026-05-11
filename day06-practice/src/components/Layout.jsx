import Header from './Header.jsx'
import Footer from './Footer.jsx'

function Layout({ children, cartCount }) {
  return (
    <div className="wrapper">
      <Header cartCount={cartCount} />
      <main className="container">{children}</main>
      <Footer />
    </div>
  )
}
export default Layout
