import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './styles/theme.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js') // Path relative to the root domain
      .then((registration) => {
        console.log('Service Worker registered successfully with scope: ', registration.scope);
      })
      .catch((error) => {
        console.error('Service Worker registration failed: ', error);
      });
  });
} else {
    console.log('Service Worker is not supported by this browser.');
}
