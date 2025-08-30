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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <div className="mb-6">
            <img 
              src={MetaMaskLogo} 
              alt="MetaMask" 
              className="w-16 h-16 mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Sign in to FairPay
            </h1>
            <p className="text-gray-600 text-sm">
              Connect your MetaMask wallet to access the platform
            </p>
          </div>

          {!isMetaMaskInstalled && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm mb-2">
                ⚠️ MetaMask not detected
              </p>
              <p className="text-red-600 text-xs">
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
                : 'bg-gray-400 cursor-not-allowed'
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

          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-xs">
                💡 <strong>Demo Note:</strong> This demo signs transactions with a static backend wallet. 
                MetaMask is shown for UX demonstration purposes.
              </p>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={() => navigate('/')}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              ← Back to Landing
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}