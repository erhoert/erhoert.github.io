import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker for PWA (Basic implementation)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // In a real build, this would point to a generated sw.js
    // For this dev-like output, we assume standard behavior or no-op
    // navigator.serviceWorker.register('/sw.js');
  });
}
