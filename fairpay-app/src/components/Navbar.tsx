import { Link, useNavigate } from 'react-router-dom'
import { useWeb3 } from '../context/Web3Context'

export function Navbar() {
  const navigate = useNavigate()
  const { account, chainId, isConnected, isAuthed, isMetaMaskInstalled, connect, disconnect, switchToSepolia } = useWeb3()

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const isOnSepolia = chainId === 11155111

  const handleConnectClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!isMetaMaskInstalled) {
      window.open('https://metamask.io/download/', '_blank')
      return
    }
    const success = await connect()
    if (success) {
      navigate('/dashboard')
    }
  }

  const handleDisconnect = () => {
    disconnect()
    navigate('/')
  }

  return (
    <nav className="bg-gray-800 shadow-sm border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-gray-100 hover:text-indigo-400">
              FairPay
            </Link>
            
            {isAuthed && (
              <div className="hidden md:flex items-center space-x-6">
                <Link 
                  to="/dashboard" 
                  className="text-sm text-gray-300 hover:text-indigo-400 font-medium"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/session" 
                  className="text-sm text-gray-300 hover:text-indigo-400 font-medium"
                >
                  Sessions
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <>
                <div className="flex items-center space-x-2">
                  <div className="text-sm text-gray-300">
                    {formatAddress(account!)}
                  </div>
                  {!isOnSepolia && (
                    <button
                      onClick={switchToSepolia}
                      className="px-3 py-1 text-xs bg-yellow-900 text-yellow-200 rounded-full hover:bg-yellow-800 transition-colors"
                    >
                      Switch to Sepolia
                    </button>
                  )}
                  {isOnSepolia && (
                    <div className="px-2 py-1 text-xs bg-green-900 text-green-200 rounded-full">
                      Sepolia
                    </div>
                  )}
                </div>
                <button
                  onClick={handleDisconnect}
                  className="px-4 py-2 text-sm text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-indigo-400 hover:text-indigo-300"
                >
                  Sign In
                </Link>
                {!isMetaMaskInstalled && (
                  <div className="text-xs text-red-400 max-w-xs">
                    MetaMask required
                  </div>
                )}
                <button
                  onClick={handleConnectClick}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isMetaMaskInstalled
                      ? 'text-white bg-indigo-600 hover:bg-indigo-700'
                      : 'text-indigo-400 bg-indigo-900/20 border border-indigo-800 hover:bg-indigo-900/40'
                  }`}
                >
                  {isMetaMaskInstalled ? 'Connect Wallet' : 'Install MetaMask'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}