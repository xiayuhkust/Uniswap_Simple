import { MetaMaskContext, MetaMaskProvider } from './contexts/MetaMask';
import { useContext } from 'react';

function AppContent() {
  const { status, account, connect } = useContext(MetaMaskContext);
  return (
    <div className="App flex flex-col min-h-screen">
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl">Tura DEX</h1>
        <button 
          onClick={connect}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          {status === 'connected' ? 
            `Connected: ${account?.slice(0, 6)}...${account?.slice(-4)}` : 
            status === 'not_installed' ? 
            'Install MetaMask' : 
            'Connect Wallet'}
        </button>
      </header>
      <main className="flex-grow container mx-auto p-4">
        {/* Components will be added here */}
      </main>
    </div>
  )
}

function App() {
  return (
    <MetaMaskProvider>
      <AppContent />
    </MetaMaskProvider>
  );
}

export default App;
