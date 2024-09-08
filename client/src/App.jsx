
import { Outlet } from 'react-router-dom'
import { AuthProvider } from './auth/useAuth'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import './App.css'

function App() {


  return (
    <>
    <AuthProvider>
      <Header />
      <Outlet />
      <Footer />
    </AuthProvider>
    </>
  )
}

export default App
