import { MetaMaskProvider } from './contexts/MetaMask';

function App() {
  return (
    <MetaMaskProvider>
      <div className="App flex flex-col min-h-screen">
        <header className="bg-gray-800 text-white p-4">
          <h1 className="text-2xl">Tura DEX</h1>
        </header>
        <main className="flex-grow container mx-auto p-4">
          {/* Components will be added here */}
        </main>
      </div>
    </MetaMaskProvider>
  )
}

export default App
