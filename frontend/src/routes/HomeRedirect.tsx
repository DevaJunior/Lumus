import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomeRedirect: React.FC = () => {
  // Alterado de "userRole" para "userProfile"
  const { userProfile, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  // Agora verificamos a propriedade "role" dentro de "userProfile"
  if (userProfile?.role === 'admin') {
    return <Navigate to="/admin/psicologos" replace />;
  }

  if (userProfile?.role === 'psychologist') {
    return <Navigate to="/dashboard" replace />;
  }

  if (userProfile?.role === 'patient') {
    return <Navigate to="/meu-dashboard" replace />;
  }

  if (userProfile?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};

export default HomeRedirect;