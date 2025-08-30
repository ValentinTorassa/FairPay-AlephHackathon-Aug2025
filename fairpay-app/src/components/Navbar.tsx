import { useWeb3 } from '../context/Web3Context'

export function Navbar() {
  const { account, chainId, isConnected, isMetaMaskInstalled, connect, disconnect, switchToSepolia } = useWeb3()

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const isOnSepolia = chainId === 11155111

  const handleConnectClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!isMetaMaskInstalled) {
      window.open('https://metamask.io/download/', '_blank')
      return
    }
    connect()
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">FairPay</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <>
                <div className="flex items-center space-x-2">
                  <div className="text-sm text-gray-600">
                    {formatAddress(account!)}
                  </div>
                  {!isOnSepolia && (
                    <button
                      onClick={switchToSepolia}
                      className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full hover:bg-yellow-200 transition-colors"
                    >
                      Switch to Sepolia
                    </button>
                  )}
                  {isOnSepolia && (
                    <div className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      Sepolia
                    </div>
                  )}
                </div>
                <button
                  onClick={disconnect}
                  className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                {!isMetaMaskInstalled && (
                  <div className="text-xs text-red-600 max-w-xs">
                    MetaMask required
                  </div>
                )}
                <button
                  onClick={handleConnectClick}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isMetaMaskInstalled
                      ? 'text-white bg-indigo-600 hover:bg-indigo-700'
                      : 'text-indigo-600 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100'
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