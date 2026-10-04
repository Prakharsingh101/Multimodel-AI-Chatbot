import { useState, useEffect } from 'react'
import Chat from './components/Chat'
import './index.css'

function App() {
  const [healthStatus, setHealthStatus] = useState('Checking...')

  useEffect(() => {
    // Check backend health on load
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setHealthStatus(data.status))
      .catch(err => setHealthStatus('Backend not reachable'))
  }, [])

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Multi-Modal AI Chatbot</h1>
        <div className={`health-badge ${healthStatus === 'ok' ? 'health-ok' : 'health-error'}`}>
          Backend: {healthStatus === 'ok' ? '🟢 Online' : `🔴 ${healthStatus}`}
        </div>
      </header>
      
      <main className="main-content chat-layout">
        <Chat />
      </main>
    </div>
  )
}

export default App
