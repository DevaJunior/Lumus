import React from 'react';
import './styles.css';
import DashboardLayout from '../DashboardLayout';

const Dashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="dashboard-page-container">
        <h1>Bem-vindo(a) à sua Dashboard!</h1>
        <p>Este é o seu painel de controle. Use o menu à esquerda para navegar.</p>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;