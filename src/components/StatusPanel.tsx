import { useState, forwardRef, useImperativeHandle } from 'react'
import { useWeb3 } from '../context/Web3Context'
import { useSessionStatus } from '../hooks/useSessionStatus'
import { SessionApiService } from '../services/sessionApi'
import { TransactionMonitorService } from '../services/transactionMonitor'
import type { SessionMode } from '../types/session'

interface StatusPanelProps {
  mode?: SessionMode
  className?: string
  onTransactionUpdate?: () => void
}

export interface StatusPanelRef {
  refresh: () => void
}

export const StatusPanel = forwardRef<StatusPanelRef, StatusPanelProps>(
  ({ mode = { type: 'single' }, className = '', onTransactionUpdate }, ref) => {
  const { totalDeposited } = useWeb3()
  const [isPollingEnabled, setIsPollingEnabled] = useState(true)
  const { status, isLoading, error, refresh } = useSessionStatus(mode, isPollingEnabled, 2500)

  // Expose refresh function to parent
  useImperativeHandle(ref, () => ({
    refresh
  }))

  // Mock controls for demo
  const apiService = SessionApiService.getInstance()
  const txMonitorService = TransactionMonitorService.getInstance()

  const handleStartDemo = async () => {
    if (mode?.type === 'direct') {
      // Use direct mode with transaction monitoring
      const result = await txMonitorService.startSessionDirect('0.1')
      if (result.success) {
        setIsPollingEnabled(true)
        refresh()
        onTransactionUpdate?.()
      }
    } else {
      // Use single mode (backend simulation)
      const result = apiService.startSession('0.1')
      if (result.success) {
        setIsPollingEnabled(true)
        refresh()
        onTransactionUpdate?.()
      }
    }
  }

  const handleStopDemo = async () => {
    if (mode?.type === 'direct') {
      // Use direct mode with transaction monitoring
      const result = await txMonitorService.closeSessionDirect()
      if (result.success) {
        refresh()
        onTransactionUpdate?.()
      }
    } else {
      // Use single mode (backend simulation)
      const result = apiService.stopSession()
      if (result.success) {
        refresh()
        onTransactionUpdate?.()
      }
    }
  }

  const handleResetDemo = () => {
    apiService.resetSession()
    refresh()
  }

  const formatEthValue = (value: string | undefined): string => {
    if (!value) return '—'
    const num = parseFloat(value)
    if (num === 0) return '0'
    return num < 0.0001 ? '<0.0001' : num.toFixed(4)
  }

  const formatUnits = (units: number | undefined): string => {
    if (units === undefined) return '—'
    return units.toLocaleString()
  }

  return (
    <div className={`bg-gray-800 rounded-lg shadow-lg border border-gray-700 ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-100">
            Live Session Status
          </h3>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isPollingEnabled ? 'bg-green-500' : 'bg-gray-400'}`} />
            <span className="text-xs text-gray-400">
              {isPollingEnabled ? 'Live' : 'Paused'}
            </span>
            <button
              onClick={() => setIsPollingEnabled(!isPollingEnabled)}
              className="text-xs text-indigo-400 hover:text-indigo-300 ml-2"
            >
              {isPollingEnabled ? 'Pause' : 'Resume'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-lg">
            <p className="text-red-200 text-sm">⚠️ {error}</p>
            <button
              onClick={refresh}
              className="text-xs text-red-400 hover:text-red-300 mt-1"
            >
              Retry
            </button>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Consumed Units */}
          <div className="text-center p-4 bg-blue-900/20 rounded-lg border border-blue-800">
            <div className="text-2xl font-bold text-blue-200 mb-1">
              {isLoading ? (
                <div className="animate-pulse bg-blue-700 h-8 w-16 mx-auto rounded" />
              ) : (
                formatUnits(status?.consumedUnits)
              )}
            </div>
            <div className="text-sm text-blue-300 font-medium">Consumed Units</div>
            <div className="text-xs text-blue-400 mt-1">
              @ {formatEthValue(status?.unitPrice)} ETH/unit
            </div>
          </div>

          {/* Accrued Spend */}
          <div className="text-center p-4 bg-orange-900/20 rounded-lg border border-orange-800">
            <div className="text-2xl font-bold text-orange-200 mb-1">
              {isLoading ? (
                <div className="animate-pulse bg-orange-700 h-8 w-20 mx-auto rounded" />
              ) : (
                formatEthValue(status?.spend)
              )}
            </div>
            <div className="text-sm text-orange-300 font-medium">Accrued Spend</div>
            <div className="text-xs text-orange-400 mt-1">ETH</div>
          </div>

          {/* Expected Refund */}
          <div className="text-center p-4 bg-green-900/20 rounded-lg border border-green-800">
            <div className="text-2xl font-bold text-green-200 mb-1">
              {isLoading ? (
                <div className="animate-pulse bg-green-700 h-8 w-20 mx-auto rounded" />
              ) : (
                formatEthValue(status?.refund)
              )}
            </div>
            <div className="text-sm text-green-300 font-medium">Expected Refund</div>
            <div className="text-xs text-green-400 mt-1">
              of {formatEthValue(status?.deposit)} ETH deposit
            </div>
          </div>

          {/* Total Deposited */}
          <div className="text-center p-4 bg-purple-900/20 rounded-lg border border-purple-800">
            <div className="text-2xl font-bold text-purple-200 mb-1">
              {formatEthValue(totalDeposited)}
            </div>
            <div className="text-sm text-purple-300 font-medium">Total Deposited</div>
            <div className="text-xs text-purple-400 mt-1">
              Across all deposits
            </div>
          </div>
        </div>

        {/* Session Info */}
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-300">
              Mode: <span className="font-medium text-gray-100">{mode.type}</span>
              {mode.sessionId && (
                <span className="ml-2 text-gray-400">({mode.sessionId})</span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${status?.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span className="text-gray-300">
                {status?.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Demo Controls */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Demo Controls:</span>
            <div className="flex space-x-2">
              <button
                onClick={handleStartDemo}
                className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
              >
                Start
              </button>
              <button
                onClick={handleStopDemo}
                className="px-3 py-1 text-xs bg-yellow-600 hover:bg-yellow-700 text-white rounded transition-colors"
              >
                Stop
              </button>
              <button
                onClick={handleResetDemo}
                className="px-3 py-1 text-xs bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
              >
                Reset
              </button>
              <button
                onClick={refresh}
                className="px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})