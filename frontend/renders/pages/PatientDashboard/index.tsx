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
        {/* Transforma o card em um link */}
        <Link to="/meu-diario" className="action-card-link">
          <div className="action-card">
            <h3>Meu Diário</h3>
            <p>Acesse e escreva em seu diário pessoal.</p>
          </div>
        </Link>
        <div className="action-card disabled">
          <h3>Minhas Consultas</h3>
          <p>Veja o histórico e os próximos agendamentos.</p>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;