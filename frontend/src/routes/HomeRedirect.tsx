import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomeRedirect: React.FC = () => {
  const { userRole, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  // ADICIONA O CASO PARA ADMIN
  if (userRole === 'admin') {
    return <Navigate to="/admin/psicologos" replace />;
  }

  if (userRole === 'psychologist') {
    return <Navigate to="/dashboard" replace />;
  }

  if (userRole === 'patient') {
    return <Navigate to="/meu-dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};

export default HomeRedirect;