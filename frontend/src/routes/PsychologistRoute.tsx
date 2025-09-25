import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PsychologistRoute: React.FC = () => {
  const { userRole, loading } = useAuth();

  if (loading) {
    return <div>Verificando permissões...</div>;
  }

  // Se o usuário logado não for um psicólogo, redireciona para o dashboard do paciente
  if (userRole !== 'psychologist') {
    return <Navigate to="/meu-dashboard" replace />;
  }

  // Se for um psicólogo, permite o acesso à rota filha
  return <Outlet />;
};

export default PsychologistRoute;