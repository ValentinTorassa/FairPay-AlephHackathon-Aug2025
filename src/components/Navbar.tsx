import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useWeb3 } from '../context/Web3Context'
import fairPayLogo from '../assets/FairPay.png'

export function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { account, chainId, isConnected, isAuthed, isMetaMaskInstalled, hasDeposited, connect, disconnect, switchToSepolia } = useWeb3()

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
      // Redirect to deposit page if user hasn't deposited yet
      navigate(hasDeposited ? '/dashboard' : '/deposit')
    }
  }

  const handleDisconnect = () => {
    disconnect()
    navigate('/')
  }

  const isActivePath = (path: string) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-navbar border-b border-gray-800/50 shadow-soft-dark">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-xl font-semibold text-white hover:text-blue-400 transition-colors"
            >
              <img 
                src={fairPayLogo} 
                alt="FairPay Logo" 
                className="w-8 h-8 rounded-lg shadow-sm"
              />
              <span>FairPay</span>
            </Link>
            
            {isAuthed && (
              <div className="hidden md:flex items-center space-x-6">
                <Link 
                  to="/dashboard" 
                  className={`text-sm font-medium transition-colors ${
                    isActivePath('/dashboard')
                      ? 'text-blue-400'
                      : 'text-gray-300 hover:text-blue-400'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/session" 
                  className={`text-sm font-medium transition-colors ${
                    isActivePath('/session')
                      ? 'text-blue-400'
                      : 'text-gray-300 hover:text-blue-400'
                  }`}
                >
                  Sessions
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            {isConnected ? (
              <>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-gray-800/60 rounded-lg border border-gray-700/50">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <code className="text-sm text-gray-200 font-mono">
                      {formatAddress(account!)}
                    </code>
                  </div>
                  {!isOnSepolia && (
                    <button
                      onClick={switchToSepolia}
                      className="px-3 py-1.5 text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg hover:bg-amber-500/20 transition-colors focus-ring"
                    >
                      Switch to Sepolia
                    </button>
                  )}
                  {isOnSepolia && (
                    <div className="px-3 py-1.5 text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg">
                      Sepolia
                    </div>
                  )}
                </div>
                <button
                  onClick={handleDisconnect}
                  className="px-4 py-2 text-sm font-medium text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-700/50 hover:text-white transition-colors focus-ring"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Sign In
                </Link>
                {!isMetaMaskInstalled && (
                  <div className="hidden sm:block text-xs text-red-400">
                    MetaMask required
                  </div>
                )}
                <button
                  onClick={handleConnectClick}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 focus-ring ${
                    isMetaMaskInstalled
                      ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                      : 'text-blue-400 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20'
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