import { useState, useEffect } from 'react'
import { TransactionHistoryService } from '../services/transactionHistory'
import type { Transaction } from '../types/transaction'

interface TxHistoryProps {
  className?: string
  onRefresh?: boolean
}

export function TxHistory({ className = '', onRefresh }: TxHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const txHistoryService = TransactionHistoryService.getInstance()

  const loadTransactions = () => {
    const recent = txHistoryService.getRecentTransactions(3)
    setTransactions(recent)
  }

  useEffect(() => {
    loadTransactions()
  }, [onRefresh])

  // Auto-refresh transaction statuses every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadTransactions()
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-900/20 text-yellow-200 border border-yellow-800 rounded-full">
            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse mr-1" />
            Pending
          </span>
        )
      case 'mined':
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-900/20 text-green-200 border border-green-800 rounded-full">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1" />
            Mined
          </span>
        )
      case 'failed':
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-900/20 text-red-200 border border-red-800 rounded-full">
            <div className="w-1.5 h-1.5 bg-red-400 rounded-full mr-1" />
            Failed
          </span>
        )
      default:
        return null
    }
  }

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    
    if (diff < 60000) { // Less than 1 minute
      return 'Just now'
    } else if (diff < 3600000) { // Less than 1 hour
      const minutes = Math.floor(diff / 60000)
      return `${minutes}m ago`
    } else if (diff < 86400000) { // Less than 1 day
      const hours = Math.floor(diff / 3600000)
      return `${hours}h ago`
    } else {
      const days = Math.floor(diff / 86400000)
      return `${days}d ago`
    }
  }

  const clearHistory = () => {
    txHistoryService.clearHistory()
    loadTransactions()
  }

  return (
    <div className={`bg-gray-800 rounded-lg shadow-lg border border-gray-700 ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-200">
            📋 Transaction History
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={loadTransactions}
              className="text-xs text-indigo-400 hover:text-indigo-300"
            >
              Refresh
            </button>
            {transactions.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-xs text-gray-400 hover:text-gray-300"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-6">
            <div className="text-gray-400 mb-2">📝</div>
            <p className="text-gray-400 text-sm">No transactions yet</p>
            <p className="text-gray-500 text-xs mt-1">
              Start a session or make usage changes to see transaction history
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.hash}
                className="flex items-center justify-between p-3 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-650 transition-colors"
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="flex-shrink-0">
                    {getStatusBadge(tx.status)}
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-200 text-sm font-medium truncate">
                        {tx.action}
                      </span>
                      {tx.confirmations && (
                        <span className="text-green-400 text-xs">
                          {tx.confirmations} conf
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-1">
                      <code className="text-gray-400 text-xs font-mono">
                        {txHistoryService.formatHash(tx.hash)}
                      </code>
                      <span className="text-gray-500 text-xs">•</span>
                      <span className="text-gray-500 text-xs">
                        {formatTimestamp(tx.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0 ml-3">
                  <a
                    href={txHistoryService.getEtherscanUrl(tx.hash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 border border-indigo-800 hover:border-indigo-700 rounded transition-colors"
                  >
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Etherscan
                  </a>
                </div>
              </div>
            ))}
            
            {transactions.length === 3 && (
              <div className="text-center pt-2">
                <span className="text-gray-500 text-xs">
                  Showing latest 3 transactions
                </span>
              </div>
            )}
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-3">
            <p className="text-blue-300 text-xs">
              💡 <strong>Transaction Tracking:</strong> In direct mode, transactions show real blockchain status. 
              In single mode, we display links when the backend returns transaction hashes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}