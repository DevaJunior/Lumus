import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles/theme.css';

console.log("--- 1. main.tsx: Aplicação iniciada ---"); // DEBUG

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)