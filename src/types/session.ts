export interface SessionStatus {
  consumedUnits: number
  unitPrice: string // ETH as string to avoid precision issues
  deposit: string // ETH as string
  spend: string // ETH as string (calculated)
  refund: string // ETH as string (calculated)
  isActive: boolean
  sessionId?: string
}

export interface SessionMode {
  type: 'single' | 'direct'
  sessionId?: string // Required for single mode
}