import { useWeb3 } from '../context/Web3Context'

export function Dashboard() {
  const { account, chainId } = useWeb3()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-100 mb-4">
                Dashboard
              </h1>
              <p className="text-gray-300">
                Welcome to your FairPay dashboard
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-900/20 border border-green-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-200 mb-2">
                  ✅ Wallet Connected
                </h3>
                <p className="text-green-300 text-sm">
                  <strong>Address:</strong> {account?.slice(0, 6)}...{account?.slice(-4)}
                </p>
                <p className="text-green-300 text-sm mt-1">
                  <strong>Chain ID:</strong> {chainId} (Sepolia)
                </p>
              </div>

              <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-200 mb-2">
                  📊 Status
                </h3>
                <p className="text-blue-300 text-sm">
                  Ready for FairPay operations
                </p>
                <p className="text-blue-400 text-xs mt-2">
                  Protected route - wallet required
                </p>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-200 mb-2">
                  🔧 Demo Mode
                </h3>
                <p className="text-yellow-300 text-sm">
                  Transactions signed with static backend wallet
                </p>
              </div>

              <div className="bg-purple-900/20 border border-purple-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-200 mb-2">
                  🚀 Next Steps
                </h3>
                <p className="text-purple-300 text-sm">
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