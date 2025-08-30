import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { ProtectedRoute } from './components/ProtectedRoute'
import { DepositProtectedRoute } from './components/DepositProtectedRoute'
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { Deposit } from './pages/Deposit'
import { Dashboard } from './pages/Dashboard'
import { Session } from './pages/Session'

function AppContent() {
  const location = useLocation()
  const showNavbar = location.pathname !== '/login'

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/deposit" 
          element={
            <ProtectedRoute>
              <Deposit />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <DepositProtectedRoute>
              <Dashboard />
            </DepositProtectedRoute>
          } 
        />
        <Route 
          path="/session" 
          element={
            <DepositProtectedRoute>
              <Session />
            </DepositProtectedRoute>
          } 
        />
      </Routes>
    </>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
