import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PatientRoute: React.FC = () => {
  const { userRole, userProfile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Verificando permissões...</div>;
  }

  // Primeiro, garante que é um paciente
  if (userRole !== 'patient') {
    return <Navigate to="/dashboard" replace />;
  }
  
  // LÓGICA DE REDIRECIONAMENTO PARA O QUESTIONÁRIO
  const hasCompletedQuestionnaire = userProfile?.hasCompletedQuestionnaire;

  // Se não completou o questionário e NÃO está na página do questionário...
  if (!hasCompletedQuestionnaire && location.pathname !== '/questionario-inicial') {
    // ...redireciona para o questionário.
    return <Navigate to="/questionario-inicial" replace />;
  }

  // Se já completou e tenta acessar o questionário novamente...
  if (hasCompletedQuestionnaire && location.pathname === '/questionario-inicial') {
      // ...redireciona para o dashboard principal dele.
      return <Navigate to="/meu-dashboard" replace />;
  }

  return <Outlet />;
};

export default PatientRoute;