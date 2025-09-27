import React from 'react';
import './styles.css';
import { useAuth } from '../../../src/contexts/AuthContext';
import { Link } from 'react-router-dom';

const PatientDashboard: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="patient-dashboard-page">
      <h2>Olá, {currentUser?.displayName || 'Paciente'}!</h2>
      <p>Bem-vindo(a) ao seu espaço na plataforma Lumus.</p>
      <div className="patient-actions">
        <Link to="/solicitar-consulta" className="action-card-link">
          <div className="action-card">
            <h3>Nova Consulta</h3>
            <p>Veja os horários e solicite um novo agendamento.</p>
          </div>
        </Link>
        <Link to="/meu-diario" className="action-card-link">
          <div className="action-card">
            <h3>Meu Diário</h3>
            <p>Acesse e escreva em seu diário pessoal.</p>
          </div>
        </Link>
        <Link to="/minhas-consultas" className="action-card-link">
          <div className="action-card">
            <h3>Minhas Consultas</h3>
            <p>Veja o histórico e os próximos agendamentos.</p>
          </div>
        </Link>
        <Link to="/meus-pagamentos" className="action-card-link">
          <div className="action-card">
            <h3>Meus Pagamentos</h3>
            <p>Acesse seu histórico financeiro.</p>
          </div>
        </Link>
        <Link to="/minhas-mensagens" className="action-card-link">
          <div className="action-card">
            <h3>Mensagens</h3>
            <p>Fale com seu psicólogo.</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default PatientDashboard;