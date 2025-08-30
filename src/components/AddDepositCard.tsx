import { useState } from 'react'
import { useWeb3 } from '../context/Web3Context'
import { useToast } from '../context/ToastContext'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { SessionApiService } from '../services/sessionApi'
import { ContractService } from '../services/contractService'
import type { SessionMode } from '../types/session'

interface AddDepositCardProps {
  mode: SessionMode
  onDepositComplete?: () => void
}

export function AddDepositCard({ mode, onDepositComplete }: AddDepositCardProps) {
  const { account, provider, addDeposit, totalDeposited } = useWeb3()
  const { showToast } = useToast()
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleAddDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid deposit amount')
      return
    }

    if (!account || !provider) {
      setError('Wallet not connected')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      let result

      if (mode.type === 'single') {
        // Use backend API for single mode
        const sessionApi = SessionApiService.getInstance()
        result = await sessionApi.addDeposit(amount)
      } else {
        // Use contract service for direct mode
        const contractService = new ContractService(provider)
        result = await contractService.addDeposit(amount)
      }

      if (result.success) {
        // Update context with new deposit
        addDeposit(amount)
        
        // Show success toast with transaction hash
        showToast(
          `Added ${amount} ETH! Tx: ${result.txHash?.slice(0, 10)}...`,
          'success'
        )
        
        // Show local success message with hash
        setSuccess(`Added ${amount} ETH! Transaction: ${result.txHash?.slice(0, 12)}...`)
        setAmount('')
        
        // Trigger refresh of parent components
        if (onDepositComplete) {
          onDepositComplete()
        }

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess('')
        }, 3000)
      } else {
        setError(result.error || 'Deposit failed')
        showToast(
          `Failed to add deposit: ${result.error || 'Unknown error'}`,
          'error'
        )
      }
    } catch (err) {
      setError('Deposit transaction failed')
      showToast('Deposit transaction failed', 'error')
      console.error('Add deposit error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-200">
          💳 Add Deposit
        </h3>
        <div className="text-sm text-gray-400">
          Current: {totalDeposited} ETH
        </div>
      </div>

      <div className="space-y-4">
        {/* Current deposit info */}
        <div className="bg-green-900/20 border border-green-800 rounded-lg p-3">
          <div className="text-green-200 text-sm">
            <strong>Total Deposited:</strong> {totalDeposited} ETH
          </div>
          <div className="text-green-300 text-xs mt-1">
            Mode: {mode.type} {mode.type === 'single' ? '(Backend)' : '(Direct Contract)'}
          </div>
        </div>

        {/* Add deposit form */}
        <div className="space-y-3">
          <Input
            label="Additional Deposit Amount (ETH)"
            type="number"
            step="0.001"
            min="0"
            placeholder="0.05"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            error={error}
            disabled={loading}
          />

          <Button
            onClick={handleAddDeposit}
            loading={loading}
            disabled={loading || !amount}
            className="w-full"
            variant="success"
          >
            {loading ? 'Processing...' : 'Add Deposit'}
          </Button>

          {success && (
            <div className="bg-green-900/20 border border-green-800 rounded p-3">
              <p className="text-green-300 text-sm">✅ {success}</p>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-3">
          <p className="text-blue-300 text-xs">
            💡 <strong>Note:</strong> Adding deposits increases your available balance for session usage. 
            Unused deposits can be refunded when you close your session.
          </p>
        </div>
      </div>
    </div>
  )
}