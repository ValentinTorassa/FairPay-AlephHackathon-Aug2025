import { useState } from 'react'
import { useWeb3 } from '../context/Web3Context'
import { StatusPanel } from '../components/StatusPanel'
import type { SessionMode } from '../types/session'

export function Session() {
  const { account } = useWeb3()
  const [mode, setMode] = useState<SessionMode>({ type: 'single', sessionId: 'session_123' })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="py-20">
        <div className="max-w-6xl mx-auto px-4 space-y-8">
          {/* Page Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-100 mb-4">
              Session Management
            </h1>
            <p className="text-gray-300">
              Monitor your FairPay sessions in real-time
            </p>
          </div>

          {/* Session Info Card */}
          <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-8">
            <div className="space-y-6">
              <div className="bg-gray-700 border border-gray-600 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">
                  📋 Session Info
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-300 text-sm">
                    <strong>Authenticated User:</strong> {account?.slice(0, 6)}...{account?.slice(-4)}
                  </p>
                  <p className="text-gray-300 text-sm">
                    <strong>Network:</strong> Sepolia Testnet
                  </p>
                  <p className="text-gray-300 text-sm">
                    <strong>Mode:</strong> {mode.type} 
                    {mode.sessionId && <span className="text-gray-400"> ({mode.sessionId})</span>}
                  </p>
                </div>
              </div>

              <div className="bg-indigo-900/20 border border-indigo-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-indigo-200 mb-4">
                  ⚡ Quick Actions
                </h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors">
                    New Session
                  </button>
                  <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
                    View History
                  </button>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setMode({ type: 'single', sessionId: 'session_123' })}
                      className={`px-3 py-2 text-xs rounded transition-colors ${
                        mode.type === 'single'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }`}
                    >
                      Single Mode
                    </button>
                    <button
                      onClick={() => setMode({ type: 'direct' })}
                      className={`px-3 py-2 text-xs rounded transition-colors ${
                        mode.type === 'direct'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }`}
                    >
                      Direct Mode
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-200 mb-2">
                  ℹ️ Protected Route
                </h3>
                <p className="text-yellow-300 text-sm">
                  This page is only accessible after wallet authentication on Sepolia network.
                </p>
              </div>
            </div>
          </div>

          {/* Live Status Panel */}
          <StatusPanel mode={mode} />

          {/* Mode Information */}
          <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">
              📊 Mode Information
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
                <h4 className="font-semibold text-blue-200 mb-2">Single Mode</h4>
                <p className="text-blue-300 text-sm">
                  Polls backend endpoint for session state. Requires session ID.
                </p>
              </div>
              <div className="bg-purple-900/20 border border-purple-800 rounded-lg p-4">
                <h4 className="font-semibold text-purple-200 mb-2">Direct Mode</h4>
                <p className="text-purple-300 text-sm">
                  Reads directly from smart contract using getUserSession().
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}