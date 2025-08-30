import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWeb3 } from '../context/Web3Context'
import { Container } from '../components/ui/Container'
import { Card, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950/20 flex items-center justify-center py-20">
      <Container maxWidth="md">
        <Card className="animate-fade-in" variant="elevated">
          <CardContent className="text-center space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="relative">
                  <img 
                    src={MetaMaskLogo} 
                    alt="MetaMask" 
                    className="w-16 h-16 mx-auto"
                  />
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs">FP</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-to-br from-white to-gray-300 bg-clip-text text-transparent">
                  Sign in to FairPay
                </h1>
                <p className="text-gray-300 text-lg">
                  Connect your MetaMask wallet to access the platform
                </p>
              </div>
            </div>

            {/* Warning for missing MetaMask */}
            {!isMetaMaskInstalled && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl animate-slide-up">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <span className="text-red-400">⚠️</span>
                  <p className="text-red-200 font-medium">
                    MetaMask not detected
                  </p>
                </div>
                <p className="text-red-300 text-sm">
                  Please install MetaMask to continue
                </p>
              </div>
            )}

            {/* Sign In Button */}
            <div className="space-y-4">
              <Button
                onClick={handleSignIn}
                disabled={isConnecting}
                loading={isConnecting}
                size="lg"
                className={`w-full ${
                  isMetaMaskInstalled && !isConnecting
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
                    : ''
                }`}
                variant={isMetaMaskInstalled ? 'primary' : 'secondary'}
              >
                <img 
                  src={MetaMaskLogo} 
                  alt="MetaMask" 
                  className="w-5 h-5 mr-2"
                />
                {isConnecting 
                  ? 'Connecting...' 
                  : isMetaMaskInstalled 
                    ? 'Sign in with MetaMask' 
                    : 'Install MetaMask'
                }
              </Button>
            </div>

            {/* Demo Note */}
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <p className="text-blue-200 text-sm leading-relaxed">
                <span className="font-medium">💡 Demo Note:</span> This demo signs transactions with a static backend wallet. 
                MetaMask is shown for UX demonstration purposes.
              </p>
            </div>

            {/* Back Button */}
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              className="text-blue-400 hover:text-blue-300"
            >
              ← Back to Landing
            </Button>
          </CardContent>
        </Card>
      </Container>
    </div>
  )
}