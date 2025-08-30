import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'elevated' | 'outline'
}

export function Card({ children, className = '', variant = 'default' }: CardProps) {
  const baseClasses = 'bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl'
  
  const variantClasses = {
    default: 'shadow-soft-dark',
    elevated: 'shadow-soft-dark shadow-2xl',
    outline: 'border-gray-600/80 shadow-none'
  }

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  )
}

interface CardHeaderProps {
  children: ReactNode
  className?: string
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`px-6 py-4 border-b border-gray-700/50 ${className}`}>
      {children}
    </div>
  )
}

interface CardContentProps {
  children: ReactNode
  className?: string
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <div className={`px-6 py-6 ${className}`}>
      {children}
    </div>
  )
}

interface CardFooterProps {
  children: ReactNode
  className?: string
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`px-6 py-4 border-t border-gray-700/50 bg-gray-800/30 rounded-b-xl ${className}`}>
      {children}
    </div>
  )
}