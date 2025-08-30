import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWeb3 } from '../context/Web3Context'
import { useToast } from '../context/ToastContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { SessionApiService } from '../services/sessionApi'
import { ContractService } from '../services/contractService'
import type { SessionMode } from '../types/session'

export function Deposit() {
  const { account, provider, addDeposit } = useWeb3()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode] = useState<SessionMode>({ type: 'single', sessionId: 'session_123' })

  const handleDeposit = async () => {
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

    try {
      let result

      if (mode.type === 'single') {
        // Use backend API for single mode - start session with initial deposit
        const sessionApi = SessionApiService.getInstance()
        result = await sessionApi.startSession(amount, '0.0000001')
      } else {
        // Use contract service for direct mode
        const contractService = new ContractService(provider)
        result = await contractService.addDeposit(amount)
      }

      if (result.success) {
        // Store deposit in context and localStorage
        addDeposit(amount)

        // Show success toast with transaction hash
        showToast(
          `Deposit successful! Tx: ${result.txHash?.slice(0, 10)}... Redirecting to dashboard...`,
          'success',
          4000
        )

        // Redirect to dashboard
        setTimeout(() => {
          navigate('/dashboard', { replace: true })
        }, 2000)
      } else {
        setError(result.error || 'Deposit failed')
        showToast(
          `Deposit failed: ${result.error || 'Unknown error'}`,
          'error'
        )
      }
    } catch (err) {
      setError('Deposit transaction failed')
      showToast('Deposit transaction failed', 'error')
      console.error('Deposit error:', err)
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="py-20">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-100 mb-4">
                Initial Deposit Required
              </h1>
              <p className="text-gray-300 mb-6">
                Make your first deposit to start using FairPay
              </p>
              
              {/* Wallet Info */}
              <div className="bg-gray-700 rounded-lg px-4 py-3 mb-6">
                <div className="text-sm text-gray-400">Connected Wallet</div>
                <div className="text-gray-200 font-mono text-lg">
                  {account?.slice(0, 6)}...{account?.slice(-4)}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Mode Info */}
              <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
                <h3 className="text-blue-200 font-semibold mb-2">
                  🔧 Current Mode: {mode.type}
                </h3>
                <p className="text-blue-300 text-sm">
                  {mode.type === 'single' 
                    ? 'Deposit will be processed by backend with demo wallet'
                    : 'Deposit will be sent directly to smart contract'
                  }
                </p>
              </div>

              {/* Deposit Form */}
              <div>
                <Input
                  label="Deposit Amount (ETH)"
                  type="number"
                  step="0.001"
                  min="0"
                  placeholder="0.1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  error={error}
                  disabled={loading}
                />
              </div>

              {/* Deposit Button */}
              <Button
                onClick={handleDeposit}
                loading={loading}
                disabled={loading || !amount}
                className="w-full"
                size="lg"
              >
                {loading ? 'Processing Deposit...' : 'Make Initial Deposit'}
              </Button>

              {/* Info Message */}
              <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
                <p className="text-yellow-300 text-sm">
                  💡 <strong>Note:</strong> This is your initial deposit to activate your FairPay account. 
                  You can add more deposits later from the session page.
                </p>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-8 text-center">
            <div className="bg-green-900/20 border border-green-800 rounded-lg p-4">
              <h4 className="text-green-200 font-semibold mb-2">🔒 Security</h4>
              <p className="text-green-300 text-sm">
                Your deposit is secured by the Ethereum blockchain. 
                Transaction will be visible on Sepolia Etherscan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}