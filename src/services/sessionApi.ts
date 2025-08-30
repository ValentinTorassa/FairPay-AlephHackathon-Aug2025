import { formatEther, parseEther } from 'ethers'
import type { SessionStatus, SessionMode } from '../types/session'
import type { TransactionResult } from '../types/transaction'
import { TransactionHistoryService } from './transactionHistory'

// Mock API service - replace with actual backend calls
export class SessionApiService {
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

  // Mock methods to control session state for demo
  startSession(deposit: string = '0.1'): TransactionResult {
    try {
      this.mockData.isActive = true
      this.mockData.deposit = deposit
      this.mockData.consumedUnits = 0
      
      // Generate mock transaction hash and add to history
      const txHash = this.getTxHistoryService().generateMockTxHash()
      this.getTxHistoryService().addTransaction(txHash, 'Start Session', 'pending')
      
      // Simulate transaction mining after 3-5 seconds
      setTimeout(() => {
        this.getTxHistoryService().updateTransactionStatus(txHash, 'mined', 1, 123456)
      }, Math.random() * 2000 + 3000)
      
      return { success: true, txHash }
    } catch (error) {
      return { success: false, error: 'Failed to start session' }
    }
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
}