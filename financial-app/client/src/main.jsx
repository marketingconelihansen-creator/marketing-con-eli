import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';

// Registrar Service Worker para control de caché
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/marketing-con-eli/service-worker.js', {
      scope: '/marketing-con-eli/'
    }).catch(err => console.log('SW registration failed'));
  });
}

// Detectar cambios en localStorage entre pestañas
window.addEventListener('storage', (e) => {
  if (e.key === 'financialData' || e.key === null) {
    window.location.reload();
  }
});

// Verificar versión cada 5 minutos y recargar si cambió
setInterval(async () => {
  try {
    const response = await fetch('/marketing-con-eli/index.html?t=' + Date.now());
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const remoteVersion = doc.querySelector('script[type="module"]')?.src || '';
    const localVersion = document.querySelector('script[type="module"]')?.src || '';
    if (remoteVersion && remoteVersion !== localVersion) {
      window.location.reload();
    }
  } catch (err) {
    console.log('Version check skipped');
  }
}, 300000);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
