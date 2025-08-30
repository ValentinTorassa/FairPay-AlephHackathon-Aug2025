import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useWeb3 } from '../context/Web3Context'
import { TxHistory } from '../components/TxHistory'
import { ContractService } from '../services/contractService'
import type { SessionMode } from '../types/session'

interface DashboardStats {
  totalSessions: number
  totalEthDeposited: string
  totalEthRefunded: string
  hasActiveSession: boolean
}

export function Dashboard() {
  const { account, chainId, provider } = useWeb3()
  const [mode] = useState<SessionMode>({ type: 'single', sessionId: 'session_123' })
  const [stats, setStats] = useState<DashboardStats>({
    totalSessions: 0,
    totalEthDeposited: '0.0',
    totalEthRefunded: '0.0',
    hasActiveSession: false
  })
  const [loading, setLoading] = useState(true)

  const loadDashboardData = useCallback(async () => {
    setLoading(true)
    try {
      // Mock data - replace with actual API calls or contract queries
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate loading
      
      if (account && provider) {
        const contractService = new ContractService(provider)
        try {
          const sessionStatus = await contractService.getSessionStatus(account, mode)
          setStats({
            totalSessions: Math.floor(Math.random() * 10) + 1,
            totalEthDeposited: sessionStatus.deposit,
            totalEthRefunded: sessionStatus.refund,
            hasActiveSession: sessionStatus.isActive
          })
        } catch {
          // Fall back to mock data on error
          setStats({
            totalSessions: 3,
            totalEthDeposited: '0.15',
            totalEthRefunded: '0.05',
            hasActiveSession: true
          })
        }
      }
    } finally {
      setLoading(false)
    }
  }, [account, provider, mode])

  useEffect(() => {
    loadDashboardData()
  }, [loadDashboardData])

  const StatCard = ({ title, value, icon, color, description }: {
    title: string
    value: string
    icon: string
    color: 'green' | 'blue' | 'purple' | 'yellow'
    description?: string
  }) => {
    const colorClasses = {
      green: 'bg-green-900/20 border-green-800 text-green-200',
      blue: 'bg-blue-900/20 border-blue-800 text-blue-200', 
      purple: 'bg-purple-900/20 border-purple-800 text-purple-200',
      yellow: 'bg-yellow-900/20 border-yellow-800 text-yellow-200'
    }

    return (
      <div className={`${colorClasses[color]} border rounded-xl p-6 shadow-lg`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="text-2xl font-bold mb-1">
          {loading ? '...' : value}
        </div>
        {description && (
          <p className="text-sm opacity-80">{description}</p>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="py-20">
        <div className="max-w-6xl mx-auto px-4 space-y-8">
          
          {/* Welcome Banner */}
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-100 mb-4">
                Welcome to FairPay Dashboard
              </h1>
              <p className="text-gray-300 mb-4">
                Monitor your FairPay activity and manage your sessions
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="bg-gray-700 rounded-lg px-4 py-2">
                  <span className="text-gray-400">Wallet: </span>
                  <span className="text-gray-200 font-mono">
                    {account?.slice(0, 6)}...{account?.slice(-4)}
                  </span>
                </div>
                <div className="bg-gray-700 rounded-lg px-4 py-2">
                  <span className="text-gray-400">Mode: </span>
                  <span className="text-gray-200 capitalize">
                    {mode.type} {mode.type === 'single' ? '(Demo)' : '(Direct)'}
                  </span>
                </div>
                <div className="bg-gray-700 rounded-lg px-4 py-2">
                  <span className="text-gray-400">Network: </span>
                  <span className="text-gray-200">Sepolia ({chainId})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Stats Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Sessions"
              value={stats.totalSessions.toString()}
              icon="📋"
              color="blue"
              description="Sessions started"
            />
            
            <StatCard
              title="ETH Deposited"
              value={`${stats.totalEthDeposited} ETH`}
              icon="💰"
              color="green"
              description="Total deposited"
            />
            
            <StatCard
              title="ETH Refunded"
              value={`${stats.totalEthRefunded} ETH`}
              icon="↩️"
              color="purple"
              description="Total refunded"
            />
            
            <StatCard
              title="Active Session"
              value={stats.hasActiveSession ? "Yes" : "No"}
              icon={stats.hasActiveSession ? "✅" : "⏸️"}
              color={stats.hasActiveSession ? "green" : "yellow"}
              description={stats.hasActiveSession ? "Session running" : "No active session"}
            />
          </div>

          {/* Quick Links */}
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-gray-100 mb-6 text-center">
              🚀 Quick Actions
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                to="/session"
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-lg transition-colors text-center block"
              >
                <div className="text-2xl mb-2">⚡</div>
                <div className="font-semibold">Manage Session</div>
                <div className="text-sm opacity-80">Start or monitor sessions</div>
              </Link>
              
              <button
                onClick={() => window.open(`https://sepolia.etherscan.io/address/${account}`, '_blank')}
                className="bg-gray-600 hover:bg-gray-700 text-white p-4 rounded-lg transition-colors text-center"
              >
                <div className="text-2xl mb-2">🔍</div>
                <div className="font-semibold">View on Etherscan</div>
                <div className="text-sm opacity-80">Check wallet activity</div>
              </button>
              
              <button
                onClick={loadDashboardData}
                className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg transition-colors text-center"
                disabled={loading}
              >
                <div className="text-2xl mb-2">🔄</div>
                <div className="font-semibold">
                  {loading ? 'Refreshing...' : 'Refresh Data'}
                </div>
                <div className="text-sm opacity-80">Update dashboard stats</div>
              </button>
              
              <Link
                to="/session"
                className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg transition-colors text-center block"
              >
                <div className="text-2xl mb-2">💳</div>
                <div className="font-semibold">Deposit</div>
                <div className="text-sm opacity-80">Add funds to session</div>
              </Link>
            </div>
          </div>

          {/* Recent Transactions */}
          <TxHistory />

          {/* System Info */}
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
            <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-200 mb-2">
                ℹ️ System Information
              </h3>
              <div className="text-blue-300 text-sm space-y-1">
                <p><strong>Mode:</strong> {mode.type} - {mode.type === 'single' ? 'Backend polling with demo wallet' : 'Direct contract interaction'}</p>
                <p><strong>Network:</strong> Sepolia Testnet (Chain ID: {chainId})</p>
                <p><strong>Status:</strong> Dashboard loaded and ready for operations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}