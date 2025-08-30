import { Navigate } from 'react-router-dom'
import { useWeb3 } from '../context/Web3Context'
import type { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthed } = useWeb3()

  if (!isAuthed) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}