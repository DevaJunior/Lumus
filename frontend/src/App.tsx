import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';
import AppRoutes from './routes';
import { ThemeProvider } from './contexts/ThemeContext';
import { SettingsProvider } from './contexts/SettingsContext';

function App() {
  console.log("--- 2. App.tsx: Renderizando App ---"); // DEBUG
  return (
    <AuthProvider>
      <ThemeProvider>
        <SettingsProvider>
          <AppRoutes />
        </SettingsProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;