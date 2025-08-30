import { useWeb3 } from '../context/Web3Context'

export function Session() {
  const { account } = useWeb3()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Session Management
              </h1>
              <p className="text-gray-600">
                Manage your FairPay sessions
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  📋 Session Info
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-700 text-sm">
                    <strong>Authenticated User:</strong> {account?.slice(0, 6)}...{account?.slice(-4)}
                  </p>
                  <p className="text-gray-700 text-sm">
                    <strong>Session Status:</strong> Active
                  </p>
                  <p className="text-gray-700 text-sm">
                    <strong>Network:</strong> Sepolia Testnet
                  </p>
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-indigo-800 mb-4">
                  ⚡ Quick Actions
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                    New Session
                  </button>
                  <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                    View History
                  </button>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                  ℹ️ Protected Route
                </h3>
                <p className="text-yellow-700 text-sm">
                  This page is only accessible after wallet authentication on Sepolia network.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}