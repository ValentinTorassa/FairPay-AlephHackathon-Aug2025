import { useState, useEffect } from 'react'

export interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info'
  duration?: number
  onClose?: () => void
}

export function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => {
        onClose?.()
      }, 300) // Allow fade out animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const typeStyles = {
    success: 'bg-green-900/90 border-green-700 text-green-100',
    error: 'bg-red-900/90 border-red-700 text-red-100',
    info: 'bg-blue-900/90 border-blue-700 text-blue-100'
  }

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️'
  }

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 
        max-w-sm p-4 rounded-lg border backdrop-blur-sm
        transition-all duration-300 ease-in-out
        ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}
        ${typeStyles[type]}
      `}
    >
      <div className="flex items-center space-x-3">
        <span className="text-lg">{icons[type]}</span>
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false)
            if (onClose) {
              setTimeout(onClose, 300)
            }
          }}
          className="text-lg hover:opacity-75 transition-opacity"
        >
          ×
        </button>
      </div>
    </div>
  )
}