import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import RootRedirect from './RootRedirect.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/:lang" element={<App />} />
        <Route path="/:lang/blog/:slug" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
