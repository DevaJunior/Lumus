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

  // Se a conta está pendente de aprovação, bloqueia
  if (profile?.role === 'psychologist' && profile?.status === 'pending') {
    alert("Sua conta está pendente de aprovação pelo administrador.");
    return <Navigate to="/login" replace />;
  }

  // Se a conta está aprovada, MAS a assinatura está inativa, redireciona para a página de assinatura
  if (profile?.role === 'psychologist' && profile?.status === 'approved' && profile?.subscriptionStatus !== 'active') {
    return <Navigate to="/assinatura" replace />;
  }

  // Se está tudo certo (aprovado e assinatura ativa), permite o acesso
  if (profile?.role === 'psychologist' && profile?.status === 'approved' && profile?.subscriptionStatus === 'active') {
    return <Outlet />;
  }
  
  // Para qualquer outro caso (paciente, etc.), redireciona para a rota correta
  return <Navigate to="/" replace />;
};

export default PsychologistRoute;