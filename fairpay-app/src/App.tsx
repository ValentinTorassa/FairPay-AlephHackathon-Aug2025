function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to FairPay
          </h1>
          <p className="text-gray-600 mb-6">
            A fresh start with Vite, React, TypeScript, and TailwindCSS
          </p>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg shadow-md">
              <span className="font-semibold">✨ Vite + React</span>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-3 rounded-lg shadow-md">
              <span className="font-semibold">🎨 TailwindCSS</span>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-lg shadow-md">
              <span className="font-semibold">📝 TypeScript</span>
            </div>
          </div>
          <button className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
            Get Started
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
