import { Navbar } from './components/Navbar'
import { useWeb3 } from './context/Web3Context'

function App() {
  const { isConnected, account, isMetaMaskInstalled } = useWeb3()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="flex items-center justify-center py-20">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to FairPay
            </h1>
            <p className="text-gray-600 mb-6">
              Connect your MetaMask wallet to get started
            </p>
            
            {!isMetaMaskInstalled && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm mb-2">
                  ⚠️ MetaMask not detected
                </p>
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                >
                  Install MetaMask
                </a>
              </div>
            )}
            
            {isConnected && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm">
                  ✅ Wallet connected: {account?.slice(0, 6)}...{account?.slice(-4)}
                </p>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg shadow-md">
                <span className="font-semibold">🔗 MetaMask Integration</span>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-3 rounded-lg shadow-md">
                <span className="font-semibold">🎨 TailwindCSS</span>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-lg shadow-md">
                <span className="font-semibold">📝 TypeScript</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
