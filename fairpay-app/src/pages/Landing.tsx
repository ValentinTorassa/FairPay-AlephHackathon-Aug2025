import { Link } from 'react-router-dom'
import { useWeb3 } from '../context/Web3Context'

export function Landing() {
  const { isAuthed } = useWeb3()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to FairPay
          </h1>
          <p className="text-gray-600 mb-6">
            Fair and transparent payment platform powered by blockchain
          </p>
          
          <div className="space-y-4 mb-6">
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

          <div className="space-y-3">
            {isAuthed ? (
              <div className="space-y-3">
                <div className="text-sm text-green-600 mb-3">
                  ✅ You're already signed in!
                </div>
                <Link
                  to="/dashboard"
                  className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  Go to Dashboard
                </Link>
                <Link
                  to="/session"
                  className="block w-full border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  Manage Sessions
                </Link>
              </div>
            ) : (
              <Link
                to="/login"
                className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Get Started
              </Link>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              🚀 Public landing page - no wallet required
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}