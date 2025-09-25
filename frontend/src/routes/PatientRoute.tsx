import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PatientRoute: React.FC = () => {
  const { userRole, loading } = useAuth();

  if (loading) {
    return <div>Verificando permissões...</div>;
  }

  // Se o usuário logado não for um paciente, redireciona para o dashboard do psicólogo
  if (userRole !== 'patient') {
    return <Navigate to="/" replace />;
  }

  // Se for um paciente, permite o acesso à rota filha
  return <Outlet />;
};

export default PatientRoute;