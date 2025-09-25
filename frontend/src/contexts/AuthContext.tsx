import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../config/firebase';
import { userService, type UserRole } from '../services/userService';
import type { Patient } from '../types/Patient';
import { patientService } from '../services/patientService';

interface AuthContextType {
  currentUser: User | null;
  userRole: UserRole['role'] | null;
  userProfile: Patient | null; // Armazena o perfil completo do paciente
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
  const [userProfile, setUserProfile] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const roleData = await userService.getUserRole(user.uid);
        const role = roleData ? roleData.role : null;
        setUserRole(role);

        // Se o usuário for um paciente, busca os dados do perfil dele
        if (role === 'patient') {
          const profileData = await patientService.getPatientById(user.uid);
          setUserProfile(profileData);
        } else {
          setUserProfile(null);
        }
      } else {
        setUserRole(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    userProfile,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div>Carregando plataforma...</div> : children}
    </AuthContext.Provider>
  );
};