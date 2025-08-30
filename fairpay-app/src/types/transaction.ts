export type TransactionStatus = 'pending' | 'mined' | 'failed'

export interface Transaction {
  hash: string
  action: string
  timestamp: number
  status: TransactionStatus
  confirmations?: number
  blockNumber?: number
}

export interface TransactionResult {
  success: boolean
  txHash?: string
  error?: string
}