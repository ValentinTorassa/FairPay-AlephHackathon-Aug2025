import { Link } from 'react-router-dom'
import { useWeb3 } from '../context/Web3Context'
import { Container } from '../components/ui/Container'
import { Card, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

export function Landing() {
  const { isAuthed } = useWeb3()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950/20 flex items-center justify-center py-20">
      <Container maxWidth="md">
        <Card className="animate-fade-in" variant="elevated">
          <CardContent className="text-center space-y-8">
            {/* Hero Section */}
            <div className="space-y-4">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl">
                  <span className="text-white font-bold text-2xl">FP</span>
                </div>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-br from-white to-gray-300 bg-clip-text text-transparent">
                Welcome to FairPay
              </h1>
              <p className="text-lg text-gray-300 max-w-md mx-auto leading-relaxed">
                Fair and transparent payment platform powered by blockchain technology
              </p>
            </div>
            
            {/* Feature Cards */}
            <div className="grid gap-4">
              <div className="p-4 bg-gradient-to-r from-blue-500/10 to-indigo-600/10 border border-blue-500/20 rounded-xl">
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-2xl">🔗</span>
                  <span className="font-semibold text-blue-300">MetaMask Integration</span>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-green-500/10 to-teal-600/10 border border-green-500/20 rounded-xl">
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-2xl">⚡</span>
                  <span className="font-semibold text-green-300">Real-time Monitoring</span>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-600/10 border border-purple-500/20 rounded-xl">
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-2xl">📊</span>
                  <span className="font-semibold text-purple-300">Usage Analytics</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {isAuthed ? (
                <div className="space-y-4">
                  <div className="inline-flex items-center px-4 py-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg text-sm font-medium">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    You're already signed in!
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Link to="/dashboard">
                      <Button size="lg" className="w-full">Go to Dashboard</Button>
                    </Link>
                    <Link to="/session">
                      <Button variant="secondary" size="lg" className="w-full">Manage Sessions</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <Link to="/login">
                  <Button size="lg" className="w-full">Get Started</Button>
                </Link>
              )}
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-gray-700/50">
              <p className="text-sm text-gray-400 flex items-center justify-center space-x-2">
                <span>🚀</span>
                <span>Public landing page - no wallet required</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  )
}