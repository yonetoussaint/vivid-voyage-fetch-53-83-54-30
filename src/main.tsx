import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './i18n';

// 👇 Add this import
import { registerSW } from 'virtual:pwa-register';

const container = document.getElementById("root");
if (!container) throw new Error('Failed to find the root element');

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 👇 Register Service Worker for offline support
registerSW({
  immediate: true,
});