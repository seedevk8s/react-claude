import { useState } from 'react'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'

function App() {
  const [cartCount, setCartCount] = useState(0)
  return (
    <Layout cartCount={cartCount}>
      <Home onCartChange={setCartCount} />
    </Layout>
  )
}
export default App
