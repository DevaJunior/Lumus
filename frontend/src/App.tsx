import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';
import AppRoutes from './routes';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  console.log("--- 2. App.tsx: Renderizando App ---"); // DEBUG
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppRoutes />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;