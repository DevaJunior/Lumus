import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../../renders/pages/DashboardLayout';


const AppLayout: React.FC = () => {
  const { userRole } = useAuth();

  // Se o usuário for um psicólogo, mostra o dashboard completo
  if (userRole === 'psychologist') {
    return (
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    );
  }

  // Se o usuário for um paciente, mostra um layout simples (por enquanto)
  if (userRole === 'patient') {
    // Por enquanto, mostraremos um layout simples. Futuramente, será o 'PatientLayout'.
    return (
      <div>
        <h1>Área do Paciente</h1>
        <Outlet />
      </div>
    );
  }

  // Se não tiver função ou enquanto carrega, não mostra nada
  return <div>Carregando área do usuário...</div>;
};

export default AppLayout;