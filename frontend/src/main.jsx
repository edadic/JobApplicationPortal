import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
}

const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <BrowserRouter {...router}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)