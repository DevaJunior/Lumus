import React from 'react';
import './styles.css';
import { useAuth } from '../../../src/contexts/AuthContext';

const PatientDashboard: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="patient-dashboard-page">
      <h2>Olá, {currentUser?.displayName || 'Paciente'}!</h2>
      <p>Bem-vindo(a) ao seu espaço na plataforma Lumus.</p>
      <div className="patient-actions">
        {/* Futuramente, aqui entrarão os cards para o Diário, Agendamentos, etc. */}
        <div className="action-card">
          <h3>Meu Diário</h3>
          <p>Acesse e escreva em seu diário pessoal.</p>
        </div>
        <div className="action-card">
          <h3>Minhas Consultas</h3>
          <p>Veja o histórico e os próximos agendamentos.</p>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;