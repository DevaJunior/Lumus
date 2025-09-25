import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomeRedirect: React.FC = () => {
  const { userRole, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (userRole === 'psychologist') {
    return <Navigate to="/dashboard" replace />;
  }

  if (userRole === 'patient') {
    return <Navigate to="/meu-dashboard" replace />;
  }

  // Fallback caso o usuário não tenha uma função definida (pode ser uma tela de erro)
  return <Navigate to="/login" replace />;
};

export default HomeRedirect;