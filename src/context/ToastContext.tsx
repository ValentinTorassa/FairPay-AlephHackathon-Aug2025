import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import { Toast, type ToastProps } from '../components/Toast'

interface ToastContextType {
  showToast: (message: string, type: 'success' | 'error' | 'info', duration?: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

interface ToastProviderProps {
  children: ReactNode
}

interface ToastInstance extends Omit<ToastProps, 'onClose'> {
  id: string
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastInstance[]>([])

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info', duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9)
    const toast: ToastInstance = { id, message, type, duration }
    
    setToasts(prev => [...prev, toast])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const value = {
    showToast
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      
      {/* Render Toasts */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast, index) => (
          <div 
            key={toast.id}
            style={{ 
              transform: `translateY(${index * 70}px)` 
            }}
          >
            <Toast
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}