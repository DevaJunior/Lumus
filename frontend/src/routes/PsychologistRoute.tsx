import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PsychologistRoute: React.FC = () => {
  const { userRole, loading } = useAuth();

  if (loading) {
    return <div>Verificando permissões...</div>;
  }

  if (userRole !== 'psychologist') {
    // Se não for psicólogo, manda para o dashboard do paciente
    return <Navigate to="/meu-dashboard" replace />;
  }

  return <Outlet />;
};

export default PsychologistRoute;