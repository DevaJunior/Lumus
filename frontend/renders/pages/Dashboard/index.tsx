import React from 'react';
import './styles.css';
import DashboardLayout from '../DashboardLayout';
import PendingAppointmentsWidget from './../../components/Components/PendingAppointmentsWidget/index';

const Dashboard: React.FC = () => {
  // A função onUpdate pode ser usada no futuro para atualizar outros widgets
  const handleWidgetUpdate = () => {
    console.log("Um widget foi atualizado, recarregando dados do dashboard se necessário.");
    // Ex: forceRerender(prev => prev + 1);
  };

  return (
    <div className="dashboard-page-container">
      <div className="dashboard-header">
        <h1>Bem-vindo(a) à sua Dashboard!</h1>
        <p>Este é o seu painel de controle. Acompanhe suas solicitações e atividades.</p>
      </div>

      <div className="dashboard-grid">
        <PendingAppointmentsWidget onUpdate={handleWidgetUpdate} />
        {/* Futuramente, outros widgets podem ser adicionados aqui */}
        <div className="widget-placeholder">
          <h2>Próximas Consultas</h2>
          <p>Em breve...</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;