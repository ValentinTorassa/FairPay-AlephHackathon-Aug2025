import { Navigate } from 'react-router-dom'
import { useWeb3 } from '../context/Web3Context'
import type { ReactNode } from 'react'

interface DepositProtectedRouteProps {
  children: ReactNode
}

export function DepositProtectedRoute({ children }: DepositProtectedRouteProps) {
  const { isAuthed, hasDeposited } = useWeb3()

  // First check if user is authenticated
  if (!isAuthed) {
    return <Navigate to="/login" replace />
  }

  // Then check if user has made a deposit
  if (!hasDeposited) {
    return <Navigate to="/deposit" replace />
  }

  return <>{children}</>
}