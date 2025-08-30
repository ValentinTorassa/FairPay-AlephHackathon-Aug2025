import { useState, useEffect, useCallback } from 'react'
import { SessionApiService } from '../services/sessionApi'
import { ContractService } from '../services/contractService'
import { useWeb3 } from '../context/Web3Context'
import type { SessionStatus, SessionMode } from '../types/session'

interface UseSessionStatusReturn {
  status: SessionStatus | null
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function useSessionStatus(
  mode: SessionMode, 
  enabled: boolean = true,
  pollInterval: number = 3000
): UseSessionStatusReturn {
  const [status, setStatus] = useState<SessionStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const { provider, account } = useWeb3()

  const fetchStatus = useCallback(async () => {
    if (!enabled) return

    try {
      setError(null)
      let sessionStatus: SessionStatus

      if (mode.type === 'single') {
        // Use API service for single mode
        const apiService = SessionApiService.getInstance()
        sessionStatus = await apiService.getSessionStatus(mode)
      } else {
        // Use contract service for direct mode
        if (!provider || !account) {
          throw new Error('Provider and account required for direct mode')
        }
        const contractService = new ContractService(provider)
        sessionStatus = await contractService.getSessionStatus(account, mode)
      }

      setStatus(sessionStatus)
    } catch (err) {
      console.error('Failed to fetch session status:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch session status')
    } finally {
      setIsLoading(false)
    }
  }, [mode, enabled, provider, account])

  // Initial fetch
  useEffect(() => {
    if (enabled) {
      fetchStatus()
    }
  }, [fetchStatus, enabled])

  // Polling setup
  useEffect(() => {
    if (!enabled) return

    const interval = setInterval(fetchStatus, pollInterval)
    
    return () => {
      clearInterval(interval)
    }
  }, [fetchStatus, enabled, pollInterval])

  const refresh = useCallback(async () => {
    setIsLoading(true)
    await fetchStatus()
  }, [fetchStatus])

  return {
    status,
    isLoading,
    error,
    refresh
  }
}