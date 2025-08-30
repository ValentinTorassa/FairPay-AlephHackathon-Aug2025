import type { Transaction, TransactionStatus } from '../types/transaction'

const STORAGE_KEY = 'fairpay-tx-history'
const MAX_HISTORY_SIZE = 50

export class TransactionHistoryService {
  private static instance: TransactionHistoryService

  static getInstance(): TransactionHistoryService {
    if (!TransactionHistoryService.instance) {
      TransactionHistoryService.instance = new TransactionHistoryService()
    }
    return TransactionHistoryService.instance
  }

  private loadHistory(): Transaction[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Failed to load transaction history:', error)
      return []
    }
  }

  private saveHistory(transactions: Transaction[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
    } catch (error) {
      console.error('Failed to save transaction history:', error)
    }
  }

  addTransaction(hash: string, action: string, status: TransactionStatus = 'pending'): void {
    const transactions = this.loadHistory()
    
    // Check if transaction already exists
    const existingIndex = transactions.findIndex(tx => tx.hash === hash)
    
    if (existingIndex >= 0) {
      // Update existing transaction
      transactions[existingIndex] = {
        ...transactions[existingIndex],
        status,
        timestamp: Date.now()
      }
    } else {
      // Add new transaction
      const newTx: Transaction = {
        hash,
        action,
        timestamp: Date.now(),
        status
      }
      
      transactions.unshift(newTx) // Add to beginning
      
      // Keep only the most recent transactions
      if (transactions.length > MAX_HISTORY_SIZE) {
        transactions.splice(MAX_HISTORY_SIZE)
      }
    }
    
    this.saveHistory(transactions)
  }

  updateTransactionStatus(
    hash: string, 
    status: TransactionStatus, 
    confirmations?: number, 
    blockNumber?: number
  ): void {
    const transactions = this.loadHistory()
    const txIndex = transactions.findIndex(tx => tx.hash === hash)
    
    if (txIndex >= 0) {
      transactions[txIndex] = {
        ...transactions[txIndex],
        status,
        confirmations,
        blockNumber,
        timestamp: Date.now()
      }
      this.saveHistory(transactions)
    }
  }

  getRecentTransactions(limit: number = 3): Transaction[] {
    return this.loadHistory().slice(0, limit)
  }

  getAllTransactions(): Transaction[] {
    return this.loadHistory()
  }

  clearHistory(): void {
    localStorage.removeItem(STORAGE_KEY)
  }

  getEtherscanUrl(hash: string): string {
    // Sepolia testnet Etherscan
    return `https://sepolia.etherscan.io/tx/${hash}`
  }

  formatHash(hash: string): string {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`
  }

  generateMockTxHash(): string {
    // Generate a mock transaction hash for demo purposes
    return '0x' + Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('')
  }
}