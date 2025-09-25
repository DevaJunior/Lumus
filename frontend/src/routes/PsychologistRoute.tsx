import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { UserProfile } from '../services/userService';

const PsychologistRoute: React.FC = () => {
  // Alterado de "userRole" para "userProfile"
  const { userProfile, loading } = useAuth();

  if (loading) {
    return <div>Verificando permissões...</div>;
  }
  
  const profile = userProfile as UserProfile;

  if (profile?.role === 'psychologist' && profile?.status === 'approved') {
    return <Outlet />;
  }
  
  if (profile?.role === 'psychologist' && profile?.status === 'pending') {
    alert("Sua conta está pendente de aprovação pelo administrador.");
    return <Navigate to="/login" replace />;
  }

  // Se for paciente ou admin, redireciona
  if (profile?.role === 'patient') {
    return <Navigate to="/meu-dashboard" replace />;
  }
  
  // Fallback para outros casos (como admin tentando acessar rota de psicólogo)
  return <Navigate to="/" replace />;
};

export default PsychologistRoute;