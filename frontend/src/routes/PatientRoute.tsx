import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PatientRoute: React.FC = () => {
  const { userRole, loading } = useAuth();

  if (loading) {
    return <div>Verificando permissões...</div>;
  }

  if (userRole !== 'patient') {
    // Se não for paciente, manda para o dashboard principal do psicólogo
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PatientRoute;