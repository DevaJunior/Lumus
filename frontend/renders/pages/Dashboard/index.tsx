import React from 'react';
import './styles.css';
import DashboardLayout from '../DashboardLayout';

const Dashboard: React.FC = () => {
  return (
    // Removido o <DashboardLayout> que estava aqui
    <div className="dashboard-page-container">
      <h1>Bem-vindo(a) à sua Dashboard!</h1>
      <p>Este é o seu painel de controle. Use o menu à esquerda para navegar.</p>
    </div>
  );
};

export default Dashboard;