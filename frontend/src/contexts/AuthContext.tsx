import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../config/firebase';
import { userService, type UserProfile } from '../services/userService';
import type { Patient } from '../types/Patient';
import { patientService } from '../services/patientService';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | Patient | null;
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
  const [userProfile, setUserProfile] = useState<UserProfile | Patient | null>(null);
  const [loading, setLoading] = useState(true);

  console.log("--- 3. AuthProvider: Componente renderizado. Estado de loading:", loading, "---"); // DEBUG

  useEffect(() => {
    console.log("--- AuthProvider: useEffect iniciado (só deve aparecer uma vez) ---"); // DEBUG
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("--- 4. AuthProvider: onAuthStateChanged disparado. Usuário:", user?.email); // DEBUG
      setCurrentUser(user);
      if (user) {
        const baseProfile = await userService.getUserProfile(user.uid);
        console.log("--- 5. AuthProvider: Perfil base (role/status) buscado:", baseProfile); // DEBUG
        
        if (baseProfile?.role === 'patient') {
          const patientProfileData = await patientService.getPatientById(user.uid);
          console.log("--- 6. AuthProvider: Perfil completo de paciente buscado:", patientProfileData); // DEBUG
          setUserProfile(patientProfileData);
        } else {
          setUserProfile(baseProfile);
        }
        setLoading(false);
      } else {
        setUserProfile(null);
        setLoading(false);
      }
      console.log("--- 7. AuthProvider: Fim do onAuthStateChanged, setLoading é false ---"); // DEBUG
    });

    return unsubscribe;
  }, []);

  const value = { currentUser, userProfile, loading };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div>Carregando plataforma... (do AuthContext)</div> : children}
    </AuthContext.Provider>
  );
};