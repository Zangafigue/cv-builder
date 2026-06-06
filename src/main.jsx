import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CvProvider } from './context/CvContext.jsx'
import ErrorBoundary from './components/ui/ErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <CvProvider>
        <App />
      </CvProvider>
    </ErrorBoundary>
  </StrictMode>,
)
