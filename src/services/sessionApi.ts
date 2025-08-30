import { formatEther, parseEther } from 'ethers'
import type { SessionStatus, SessionMode } from '../types/session'
import type { TransactionResult } from '../types/transaction'
import { TransactionHistoryService } from './transactionHistory'

// API service for backend communication
export class SessionApiService {
  private static readonly BASE_URL = 'http://localhost:3000/api'
  private static instance: SessionApiService
  private autoInterval?: NodeJS.Timeout
  private mockData = {
    consumedUnits: 0,
    unitPrice: '0.001', // ETH
    deposit: '0.1', // ETH
    isActive: false,
    sessionId: 'session_123',
    autoMode: false
  }

  static getInstance(): SessionApiService {
    if (!SessionApiService.instance) {
      SessionApiService.instance = new SessionApiService()
    }
    return SessionApiService.instance
  }

  private getTxHistoryService() {
    return TransactionHistoryService.getInstance()
  }

  // Mock incrementing consumed units for demo
  private incrementUnits() {
    if (this.mockData.isActive && !this.mockData.autoMode) {
      this.mockData.consumedUnits += Math.floor(Math.random() * 3) + 1
    }
  }

  async getSessionStatus(mode: SessionMode): Promise<SessionStatus> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100))

    // Increment for demo purposes
    this.incrementUnits()

    const { consumedUnits, unitPrice, deposit, isActive, sessionId } = this.mockData

    // Calculate spend and refund using bigint operations
    const unitPriceWei = parseEther(unitPrice)
    const depositWei = parseEther(deposit)
    const spendWei = unitPriceWei * BigInt(consumedUnits)
    const refundWei = depositWei > spendWei ? depositWei - spendWei : 0n

    const spend = formatEther(spendWei)
    const refund = formatEther(refundWei)

    return {
      consumedUnits,
      unitPrice,
      deposit,
      spend,
      refund,
      isActive,
      sessionId: mode.type === 'single' ? sessionId : undefined
    }
  }

  // Start session with backend endpoint
  async startSession(deposit: string = '0.1', unitPrice: string = '0.0000001'): Promise<TransactionResult> {
    try {
      // Update local mock data first
      this.mockData.isActive = true
      this.mockData.deposit = deposit
      this.mockData.unitPrice = unitPrice
      this.mockData.consumedUnits = 0

      // Call backend endpoint
      const response = await fetch(`${SessionApiService.BASE_URL}/start-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          unitPrice: parseFloat(unitPrice),
          deposit: parseFloat(deposit)
        })
      })

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      const txHash = data.txHash

      if (!txHash) {
        throw new Error('No transaction hash returned from backend')
      }

      // Add transaction to history with real hash
      this.getTxHistoryService().addTransaction(txHash, 'Start Session', 'pending')
      
      // Monitor transaction status (will update when mined)
      this.monitorTransaction(txHash)
      
      return { success: true, txHash }
    } catch (error) {
      console.error('Failed to start session:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to start session' 
      }
    }
  }

  // Monitor transaction status
  private async monitorTransaction(txHash: string) {
    const checkStatus = async () => {
      try {
        // Try to get transaction receipt (this would need to be implemented with ethers provider)
        // For now, simulate mining after a delay
        setTimeout(() => {
          this.getTxHistoryService().updateTransactionStatus(txHash, 'mined', 1, Date.now())
        }, Math.random() * 10000 + 5000) // 5-15 seconds
      } catch (error) {
        console.error('Error monitoring transaction:', error)
      }
    }
    
    checkStatus()
  }

  stopSession(): TransactionResult {
    try {
      this.mockData.isActive = false
      
      // Generate mock transaction hash and add to history
      const txHash = this.getTxHistoryService().generateMockTxHash()
      this.getTxHistoryService().addTransaction(txHash, 'Close Session', 'pending')
      
      // Simulate transaction mining after 2-4 seconds
      setTimeout(() => {
        this.getTxHistoryService().updateTransactionStatus(txHash, 'mined', 1, 123457)
      }, Math.random() * 2000 + 2000)
      
      return { success: true, txHash }
    } catch (error) {
      return { success: false, error: 'Failed to close session' }
    }
  }

  resetSession() {
    this.mockData.consumedUnits = 0
    this.mockData.isActive = false
    this.mockData.autoMode = false
    if (this.autoInterval) {
      clearInterval(this.autoInterval)
      this.autoInterval = undefined
    }
  }

  // Usage control endpoints - these don't generate transactions in single mode
  async startAutoUsage(): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.mockData.isActive) {
        return { success: false, error: 'Session not active. Please start a session first.' }
      }
      
      this.mockData.autoMode = true
      
      // Clear existing interval if any
      if (this.autoInterval) {
        clearInterval(this.autoInterval)
      }
      
      // Start auto incrementing every 2 seconds
      this.autoInterval = setInterval(() => {
        if (this.mockData.autoMode && this.mockData.isActive) {
          this.mockData.consumedUnits += Math.floor(Math.random() * 2) + 1
        }
      }, 2000)
      
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Failed to start auto usage' }
    }
  }

  async stopAutoUsage(): Promise<{ success: boolean; error?: string }> {
    try {
      this.mockData.autoMode = false
      if (this.autoInterval) {
        clearInterval(this.autoInterval)
        this.autoInterval = undefined
      }
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Failed to stop auto usage' }
    }
  }

  async addRandomUsage(): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.mockData.isActive) {
        return { success: false, error: 'Session not active. Please start a session first.' }
      }
      
      const randomUnits = Math.floor(Math.random() * 10) + 5 // 5-14 units
      this.mockData.consumedUnits += randomUnits
      
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Failed to add random usage' }
    }
  }

  async addManualUsage(units: number): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.mockData.isActive) {
        return { success: false, error: 'Session not active. Please start a session first.' }
      }
      
      if (units <= 0) {
        return { success: false, error: 'Units must be greater than 0' }
      }
      
      this.mockData.consumedUnits += units
      
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Failed to add manual usage' }
    }
  }

  getAutoMode(): boolean {
    return this.mockData.autoMode
  }

  // Report usage to backend (oracle → backend → chain)
  async reportUsage(units: number): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      if (!this.mockData.isActive) {
        return { success: false, error: 'Session not active. Please start a session first.' }
      }

      if (units <= 0) {
        return { success: false, error: 'Units must be greater than 0' }
      }

      // Call backend report-usage endpoint
      const response = await fetch(`${SessionApiService.BASE_URL}/report-usage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          units: units
        })
      })

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      const txHash = data.result

      if (!txHash) {
        throw new Error('No transaction hash returned from backend')
      }

      // Update local consumed units
      this.mockData.consumedUnits += units

      // Add transaction to history with descriptive message
      this.getTxHistoryService().addTransaction(txHash, `Report Usage (${units} units)`, 'pending')
      
      // Monitor transaction status
      this.monitorTransaction(txHash)
      
      return { success: true, txHash }
    } catch (error) {
      console.error('Failed to report usage:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to report usage' 
      }
    }
  }

  // Deposit method for single mode - using backend endpoint
  async addDeposit(amount: string): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      // Update local mock data
      const currentDeposit = parseFloat(this.mockData.deposit)
      const additionalDeposit = parseFloat(amount)
      const newTotal = (currentDeposit + additionalDeposit).toFixed(6)
      
      this.mockData.deposit = newTotal

      // Call backend add-deposit endpoint
      const response = await fetch(`${SessionApiService.BASE_URL}/add-deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount)
        })
      })

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      const txHash = data.result

      if (!txHash) {
        throw new Error('No transaction hash returned from backend')
      }

      // Add transaction to history with real hash
      this.getTxHistoryService().addTransaction(txHash, `Add Deposit (${amount} ETH)`, 'pending')
      
      // Monitor transaction status
      this.monitorTransaction(txHash)
      
      return { success: true, txHash }
    } catch (error) {
      console.error('Failed to add deposit:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to add deposit' 
      }
    }
  }
}