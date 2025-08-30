import { useState } from 'react'
import { useToast } from '../context/ToastContext'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { SessionApiService } from '../services/sessionApi'
import type { SessionMode } from '../types/session'

interface ReportUsageProps {
  mode: SessionMode
  onUsageReported?: () => void
}

export function ReportUsage({ mode, onUsageReported }: ReportUsageProps) {
  const { showToast } = useToast()
  const [units, setUnits] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleReportUsage = async () => {
    if (!units || parseInt(units) <= 0) {
      setError('Please enter a valid number of units')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (mode.type !== 'single') {
        setError('Report usage is only available in single mode')
        return
      }

      const sessionApi = SessionApiService.getInstance()
      const result = await sessionApi.reportUsage(parseInt(units))

      if (result.success) {
        // Show success toast with transaction hash
        showToast(
          `Reported ${units} units! Tx: ${result.txHash?.slice(0, 10)}...`,
          'success'
        )
        
        // Show local success message with hash
        setSuccess(`Reported ${units} units! Transaction: ${result.txHash?.slice(0, 12)}...`)
        setUnits('')
        
        // Trigger refresh of parent components
        if (onUsageReported) {
          onUsageReported()
        }

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess('')
        }, 3000)
      } else {
        setError(result.error || 'Report failed')
        showToast(
          `Failed to report usage: ${result.error || 'Unknown error'}`,
          'error'
        )
      }
    } catch (err) {
      setError('Report usage failed')
      showToast('Report usage failed', 'error')
      console.error('Report usage error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Show disabled state for direct mode
  if (mode.type === 'direct') {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-200">
            📊 Report Usage
          </h3>
        </div>
        
        <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-yellow-200 text-sm">ℹ️</span>
            <h4 className="text-yellow-200 font-medium text-sm">Direct Mode</h4>
          </div>
          <p className="text-yellow-300 text-xs">
            Usage reporting is handled automatically by oracles in direct mode. 
            Switch to single mode to manually report usage.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-200">
          📊 Report Usage
        </h3>
        <div className="text-sm text-gray-400">
          Oracle → Backend → Chain
        </div>
      </div>

      <div className="space-y-4">
        {/* Current mode info */}
        <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-3">
          <div className="text-blue-200 text-sm">
            <strong>Mode:</strong> {mode.type} {mode.sessionId && `(${mode.sessionId})`}
          </div>
          <div className="text-blue-300 text-xs mt-1">
            Reports are processed through backend and submitted to blockchain
          </div>
        </div>

        {/* Report usage form */}
        <div className="space-y-3">
          <Input
            label="Consumed Units to Report"
            type="number"
            step="1"
            min="1"
            placeholder="10"
            value={units}
            onChange={(e) => setUnits(e.target.value)}
            error={error}
            disabled={loading}
          />

          <Button
            onClick={handleReportUsage}
            loading={loading}
            disabled={loading || !units}
            className="w-full"
            variant="primary"
          >
            {loading ? 'Reporting...' : 'Report Usage'}
          </Button>

          {success && (
            <div className="bg-green-900/20 border border-green-800 rounded p-3">
              <p className="text-green-300 text-sm">✅ {success}</p>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="bg-purple-900/20 border border-purple-800 rounded-lg p-3">
          <p className="text-purple-300 text-xs">
            💡 <strong>Note:</strong> Reporting usage triggers the oracle to submit consumption data to the blockchain. 
            This creates a transaction that will appear in your history and update your session balance.
          </p>
        </div>
      </div>
    </div>
  )
}