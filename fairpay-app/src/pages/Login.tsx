import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWeb3 } from '../context/Web3Context'
import MetaMaskLogo from '../assets/metamask.svg'

export function Login() {
  const navigate = useNavigate()
  const { connect, isMetaMaskInstalled, isAuthed } = useWeb3()
  const [isConnecting, setIsConnecting] = useState(false)

  // If already authenticated, redirect to dashboard
  if (isAuthed) {
    navigate('/dashboard')
    return null
  }

  const handleSignIn = async (e: React.MouseEvent) => {
    e.preventDefault()
    
    if (!isMetaMaskInstalled) {
      window.open('https://metamask.io/download/', '_blank')
      return
    }

    setIsConnecting(true)
    try {
      const success = await connect()
      if (success) {
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-8">
        <div className="text-center">
          <div className="mb-6">
            <img 
              src={MetaMaskLogo} 
              alt="MetaMask" 
              className="w-16 h-16 mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-100 mb-2">
              Sign in to FairPay
            </h1>
            <p className="text-gray-300 text-sm">
              Connect your MetaMask wallet to access the platform
            </p>
          </div>

          {!isMetaMaskInstalled && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
              <p className="text-red-200 text-sm mb-2">
                ⚠️ MetaMask not detected
              </p>
              <p className="text-red-300 text-xs">
                Please install MetaMask to continue
              </p>
            </div>
          )}

          <button
            onClick={handleSignIn}
            disabled={isConnecting}
            className={`w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-lg font-semibold text-white transition-all duration-200 ${
              isMetaMaskInstalled && !isConnecting
                ? 'bg-orange-500 hover:bg-orange-600 hover:shadow-lg transform hover:scale-105'
                : 'bg-gray-600 cursor-not-allowed'
            }`}
          >
            <img 
              src={MetaMaskLogo} 
              alt="MetaMask" 
              className="w-6 h-6"
            />
            <span>
              {isConnecting 
                ? 'Connecting...' 
                : isMetaMaskInstalled 
                  ? 'Sign in with MetaMask' 
                  : 'Install MetaMask'
              }
            </span>
          </button>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
              <p className="text-blue-200 text-xs">
                💡 <strong>Demo Note:</strong> This demo signs transactions with a static backend wallet. 
                MetaMask is shown for UX demonstration purposes.
              </p>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={() => navigate('/')}
              className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
            >
              ← Back to Landing
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}