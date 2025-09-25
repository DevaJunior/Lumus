import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../config/firebase';
import { userService, type UserRole } from '../services/userService';

interface AuthContextType {
  currentUser: User | null;
  userRole: UserRole['role'] | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole['role'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("AuthProvider: onAuthStateChanged disparado. Usuário:", user?.email); // DEBUG
      setCurrentUser(user);

      if (user) {
        console.log("AuthProvider: Buscando função para o UID:", user.uid); // DEBUG
        const roleData = await userService.getUserRole(user.uid);
        
        // DEBUG: O que o Firestore retornou?
        console.log("AuthProvider: Função do usuário (do Firestore):", roleData);

        setUserRole(roleData ? roleData.role : null);
        setLoading(false);
      } else {
        setUserRole(null);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div>Carregando plataforma...</div> : children}
    </AuthContext.Provider>
  );
};