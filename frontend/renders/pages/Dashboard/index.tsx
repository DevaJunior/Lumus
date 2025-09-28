import React from 'react';
import './styles.css';
import PendingAppointmentsWidget from './../../components/Components/PendingAppointmentsWidget/index';
import UpcomingAppointmentsWidget from '../../components/Components/UpcomingAppointmentsWidget';

const Dashboard: React.FC = () => {
  const handleWidgetUpdate = () => {
    // Esta função pode ser usada para forçar a recarga de múltiplos widgets
    // Por enquanto, podemos deixar um log
    console.log("Um widget foi atualizado, recarregando dados do dashboard se necessário.");
  };

  return (
    <div className="dashboard-page-container">
      <div className="dashboard-header">
        <h1>Bem-vindo(a) à sua Dashboard!</h1>
        <p>Este é o seu painel de controle. Acompanhe suas solicitações e atividades.</p>
      </div>

      <div className="dashboard-grid">
        <PendingAppointmentsWidget onUpdate={handleWidgetUpdate} />
        
        {/* SUBSTITUI O PLACEHOLDER PELO NOVO WIDGET */}
        <UpcomingAppointmentsWidget />
      </div>
    </div>
  );
};

export default Dashboard;