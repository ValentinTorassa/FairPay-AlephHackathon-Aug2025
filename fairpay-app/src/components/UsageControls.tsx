import { useState } from 'react'
import { SessionApiService } from '../services/sessionApi'
import type { SessionMode } from '../types/session'

interface UsageControlsProps {
  mode: SessionMode
  onUsageUpdate?: () => void
}

export function UsageControls({ mode, onUsageUpdate }: UsageControlsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [manualUnits, setManualUnits] = useState<string>('')
  
  const apiService = SessionApiService.getInstance()
  const isAutoMode = apiService.getAutoMode()

  const handleUsageAction = async (action: () => Promise<{ success: boolean; error?: string }>) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await action()
      if (result.success) {
        onUsageUpdate?.()
      } else {
        setError(result.error || 'Operation failed')
      }
    } catch (err) {
      setError('Request failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAutoStart = () => {
    handleUsageAction(() => apiService.startAutoUsage())
  }

  const handleAutoStop = () => {
    handleUsageAction(() => apiService.stopAutoUsage())
  }

  const handleRandomIncrement = () => {
    handleUsageAction(() => apiService.addRandomUsage())
  }

  const handleManualIncrement = () => {
    const units = parseInt(manualUnits)
    if (isNaN(units) || units <= 0) {
      setError('Please enter a valid number of units')
      return
    }
    
    handleUsageAction(() => apiService.addManualUsage(units))
    setManualUnits('')
  }

  // In direct mode, show disabled controls with tooltip
  if (mode.type === 'direct') {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-200">
            ⚙️ Usage Controls
          </h3>
        </div>
        
        <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-yellow-200 text-sm">ℹ️</span>
            <h4 className="text-yellow-200 font-medium text-sm">Direct Mode</h4>
          </div>
          <p className="text-yellow-300 text-xs">
            Usage is handled by the oracle backend in single mode. 
            Switch to single mode to access usage controls.
          </p>
        </div>
      </div>
    )
  }

  // Check if session is active
  const hasValidSession = mode.sessionId && mode.sessionId !== ''

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-200">
          ⚙️ Usage Controls
        </h3>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isAutoMode ? 'bg-green-500' : 'bg-gray-400'}`} />
          <span className="text-xs text-gray-400">
            {isAutoMode ? 'Auto Mode' : 'Manual Mode'}
          </span>
        </div>
      </div>

      {!hasValidSession && (
        <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-800 rounded-lg">
          <p className="text-yellow-200 text-sm">
            ⚠️ No active session found. Please start a session first to control usage.
          </p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-lg">
          <p className="text-red-200 text-sm">⚠️ {error}</p>
        </div>
      )}

      <div className="space-y-4">
        {/* Auto Mode Controls */}
        <div className="bg-indigo-900/20 border border-indigo-800 rounded-lg p-4">
          <h4 className="text-indigo-200 font-medium text-sm mb-3">🤖 Auto Mode</h4>
          <div className="flex space-x-2">
            <button
              onClick={handleAutoStart}
              disabled={isLoading || !hasValidSession || isAutoMode}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isAutoMode || !hasValidSession
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isLoading ? '...' : 'Start Auto'}
            </button>
            <button
              onClick={handleAutoStop}
              disabled={isLoading || !hasValidSession || !isAutoMode}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                !isAutoMode || !hasValidSession
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {isLoading ? '...' : 'Stop Auto'}
            </button>
          </div>
          <p className="text-indigo-300 text-xs mt-2">
            Auto mode periodically increments usage every 2 seconds
          </p>
        </div>

        {/* Manual Controls */}
        <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
          <h4 className="text-blue-200 font-medium text-sm mb-3">🎯 Manual Controls</h4>
          <div className="space-y-3">
            {/* Random Increment */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleRandomIncrement}
                disabled={isLoading || !hasValidSession}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  !hasValidSession
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                {isLoading ? '...' : 'Random +5-14'}
              </button>
              <span className="text-blue-300 text-xs">Add random usage burst</span>
            </div>

            {/* Manual Increment */}
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={manualUnits}
                onChange={(e) => setManualUnits(e.target.value)}
                placeholder="Units"
                min="1"
                disabled={isLoading || !hasValidSession}
                className="w-20 px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded text-gray-100 placeholder-gray-400 disabled:bg-gray-600 disabled:text-gray-500"
              />
              <button
                onClick={handleManualIncrement}
                disabled={isLoading || !hasValidSession || !manualUnits}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  !hasValidSession || !manualUnits
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isLoading ? '...' : 'Add Units'}
              </button>
              <span className="text-blue-300 text-xs">Add specific amount</span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-gray-700 border border-gray-600 rounded-lg p-3">
          <p className="text-gray-300 text-xs">
            💡 <strong>Usage Simulation:</strong> These controls simulate service consumption. 
            Changes will be reflected in the Live Status Panel within 2-3 seconds.
          </p>
        </div>
      </div>
    </div>
  )
}