import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { UserProfile } from '../services/userService';
const PsychologistRoute: React.FC = () => {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return <div>Verificando permissões...</div>;
  }
  
  const profile = userProfile as UserProfile;

  // Se a conta está aprovada e a assinatura ativa, permite o acesso
  if (profile?.role === 'psychologist' && profile?.status === 'approved' && profile?.subscriptionStatus === 'active') {
    return <Outlet />;
  }
  
  if (profile?.role === 'psychologist' && profile?.status === 'approved' && profile?.subscriptionStatus !== 'active') {
    return <Navigate to="/assinatura" replace />;
  }

  // Mensagens para outros status
  if (profile?.role === 'psychologist' && profile?.status === 'pending') {
    alert("Sua conta está pendente de aprovação pelo administrador.");
    return <Navigate to="/login" replace />;
  }

  if (profile?.role === 'psychologist' && profile?.status === 'suspended') {
    alert("Sua conta foi suspensa. Por favor, entre em contato com o suporte.");
    return <Navigate to="/login" replace />;
  }

  // Para qualquer outro caso (paciente, etc.), redireciona
  return <Navigate to="/" replace />;
};

export default PsychologistRoute;