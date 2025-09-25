import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { currentUser, loading } = useAuth();

  // Enquanto verifica a autenticação, não renderiza nada (ou um spinner)
  if (loading) {
    return <div>Carregando...</div>;
  }

  // Se não houver usuário, redireciona para a página de login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Se houver usuário, renderiza a rota filha (o conteúdo protegido)
  return <Outlet />;
};

export default ProtectedRoute;