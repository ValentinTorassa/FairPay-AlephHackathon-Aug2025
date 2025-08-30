import { useWeb3 } from '../context/Web3Context'

export function Dashboard() {
  const { account, chainId } = useWeb3()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome to your FairPay dashboard
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  ✅ Wallet Connected
                </h3>
                <p className="text-green-700 text-sm">
                  <strong>Address:</strong> {account?.slice(0, 6)}...{account?.slice(-4)}
                </p>
                <p className="text-green-700 text-sm mt-1">
                  <strong>Chain ID:</strong> {chainId} (Sepolia)
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  📊 Status
                </h3>
                <p className="text-blue-700 text-sm">
                  Ready for FairPay operations
                </p>
                <p className="text-blue-600 text-xs mt-2">
                  Protected route - wallet required
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                  🔧 Demo Mode
                </h3>
                <p className="text-yellow-700 text-sm">
                  Transactions signed with static backend wallet
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">
                  🚀 Next Steps
                </h3>
                <p className="text-purple-700 text-sm">
                  Navigate to session management or other features
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}