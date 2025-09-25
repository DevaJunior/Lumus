import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../config/firebase';

// Define o tipo para os valores do contexto
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
}

// Cria o Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook customizado para consumir o contexto facilmente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Define as props do Provider
interface AuthProviderProps {
  children: ReactNode;
}

// Componente Provedor, agora declarado como uma constante
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listener do Firebase que observa mudanças no estado de autenticação
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Função de limpeza: remove o listener quando o componente é desmontado
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};