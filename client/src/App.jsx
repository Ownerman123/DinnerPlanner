
import { Outlet } from 'react-router-dom'
import { AuthProvider } from './auth/useAuth'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import { Box } from "@chakra-ui/react";
import './App.css'

function App() {


  return (
    <>
    <AuthProvider>
      <Header />
      <Outlet />
      <Box id="filler" bg='#9fc0d1'></Box>
      <Footer />
    </AuthProvider>
    </>
  )
}

export default App
