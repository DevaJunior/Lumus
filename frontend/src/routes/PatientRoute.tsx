import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { UserProfile } from '../services/userService';

const PatientRoute: React.FC = () => {
  // Alterado de "userRole" para "userProfile"
  const { userProfile, loading } = useAuth();

  if (loading) {
    return <div>Verificando permissões...</div>;
  }
  
  const profile = userProfile as UserProfile;

  // Se for paciente, permite o acesso
  if (profile?.role === 'patient') {
    return <Outlet />;
  }

  // Se for psicólogo ou admin, redireciona para o dashboard correto
  if (profile?.role === 'psychologist') {
    return <Navigate to="/dashboard" replace />;
  }
  
  if (profile?.role === 'admin') {
    return <Navigate to="/admin/psicologos" replace />;
  }

  // Fallback
  return <Navigate to="/login" replace />;
};

export default PatientRoute;