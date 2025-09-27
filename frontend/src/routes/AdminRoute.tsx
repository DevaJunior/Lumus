import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute: React.FC = () => {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return <div>Verificando permissões de administrador...</div>;
  }

  // Agora verificamos a propriedade "role" dentro de "userProfile"
  if (userProfile?.role !== 'admin') {
    // Se não for admin, manda para a rota raiz, que o redirecionará corretamente
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;