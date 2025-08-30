import { BrowserProvider } from 'ethers'
import { TransactionHistoryService } from './transactionHistory'
import type { TransactionResult } from '../types/transaction'

export class TransactionMonitorService {
  private static instance: TransactionMonitorService
  private txHistoryService: TransactionHistoryService

  static getInstance(): TransactionMonitorService {
    if (!TransactionMonitorService.instance) {
      TransactionMonitorService.instance = new TransactionMonitorService()
    }
    return TransactionMonitorService.instance
  }

  constructor() {
    this.txHistoryService = TransactionHistoryService.getInstance()
  }

  async submitAndMonitorTransaction(
    action: string,
    transactionPromise: Promise<any>
  ): Promise<TransactionResult> {
    try {
      // Execute the transaction
      const tx = await transactionPromise
      const txHash = tx.hash

      // Add to transaction history as pending
      this.txHistoryService.addTransaction(txHash, action, 'pending')

      // Start monitoring the transaction
      this.monitorTransaction(txHash)

      return { success: true, txHash }
    } catch (error: any) {
      console.error('Transaction failed:', error)
      return { 
        success: false, 
        error: error.message || 'Transaction failed' 
      }
    }
  }

  private async monitorTransaction(txHash: string) {
    try {
      if (typeof window.ethereum === 'undefined') {
        console.error('MetaMask not available for transaction monitoring')
        return
      }

      const provider = new BrowserProvider(window.ethereum)
      
      // Wait for transaction to be mined
      const receipt = await provider.waitForTransaction(txHash)
      
      if (receipt) {
        if (receipt.status === 1) {
          // Transaction succeeded
          this.txHistoryService.updateTransactionStatus(
            txHash, 
            'mined',
            1, // confirmations
            receipt.blockNumber
          )
        } else {
          // Transaction failed
          this.txHistoryService.updateTransactionStatus(txHash, 'failed')
        }
      }
    } catch (error) {
      console.error('Error monitoring transaction:', error)
      this.txHistoryService.updateTransactionStatus(txHash, 'failed')
    }
  }

  // Mock direct mode transaction methods
  async startSessionDirect(_deposit: string = '0.1'): Promise<TransactionResult> {
    // Simulate direct contract interaction
    const mockTransaction = new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          hash: this.txHistoryService.generateMockTxHash(),
          wait: () => new Promise(waitResolve => {
            setTimeout(() => {
              waitResolve({
                status: 1,
                blockNumber: 123456 + Math.floor(Math.random() * 1000),
                confirmations: 1
              })
            }, 3000 + Math.random() * 2000) // 3-5 seconds
          })
        })
      }, 500) // Initial transaction delay
    })

    return this.submitAndMonitorTransaction('Start Session (Direct)', mockTransaction)
  }

  async closeSessionDirect(): Promise<TransactionResult> {
    // Simulate direct contract interaction
    const mockTransaction = new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          hash: this.txHistoryService.generateMockTxHash(),
          wait: () => new Promise(waitResolve => {
            setTimeout(() => {
              waitResolve({
                status: 1,
                blockNumber: 123456 + Math.floor(Math.random() * 1000),
                confirmations: 1
              })
            }, 2000 + Math.random() * 2000) // 2-4 seconds
          })
        })
      }, 500) // Initial transaction delay
    })

    return this.submitAndMonitorTransaction('Close Session (Direct)', mockTransaction)
  }
}