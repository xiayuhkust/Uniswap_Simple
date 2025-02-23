import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { TestApp } from './components/test/TestApp'

const root = document.getElementById('root')
if (!root) {
  throw new Error('Root element not found')
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <TestApp />
  </React.StrictMode>
)
