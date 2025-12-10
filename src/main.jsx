import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found!');
} else {
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  } catch (error) {
    console.error('Error rendering app:', error);
    rootElement.innerHTML = `<div style="padding: 20px; color: red;">
      <h1>Error Loading App</h1>
      <p>${error.message}</p>
      <p>Check console for details.</p>
    </div>`;
  }
}




