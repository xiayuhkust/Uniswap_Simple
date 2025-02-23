import React from 'react'
import ReactDOM from 'react-dom/client'
import { TestApp } from './components/test/TestApp'
import './index.css'

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found')

console.log('Mounting TestApp component...')
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <TestApp />
  </React.StrictMode>
)
