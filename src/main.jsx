import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { CollectionProvider } from './context/CollectionContext'
import { ProgressProvider } from './context/ProgressContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ProgressProvider>
        <CollectionProvider>
          <App />
        </CollectionProvider>
      </ProgressProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
