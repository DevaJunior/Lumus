import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../src/contexts/AuthContext';
import { appointmentService } from '../../../../src/services/appointmentService';
import { type Appointment } from '../../../../src/types/Appointment';
import './styles.css';

const UpcomingAppointmentsWidget: React.FC = () => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAppointments = useCallback(async () => {
    if (!currentUser) return;
    try {
      // Reutilizamos a função que busca todos os agendamentos
      const data = await appointmentService.getAppointmentsByPsychologist(currentUser.uid);
      setAppointments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Filtramos e ordenamos os agendamentos aqui no componente
  const upcomingAppointments = useMemo(() => {
    const now = new Date();
    return appointments
      .filter(apt => apt.status === 'confirmed' && apt.start >= now)
      .sort((a, b) => a.start.getTime() - b.start.getTime()) // Ordena do mais próximo para o mais distante
      .slice(0, 5); // Limita a exibir no máximo 5
  }, [appointments]);
  
  const formatDate = (date: Date) => date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  const formatTime = (date: Date) => date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  if (isLoading) return <div className="widget-loading">Carregando...</div>;

  return (
    <div className="widget-container upcoming-appointments">
      <h2>Próximas Consultas</h2>
      {upcomingAppointments.length > 0 ? (
        <ul className="upcoming-list">
          {upcomingAppointments.map(apt => (
            <li key={apt.id} className="upcoming-item" onClick={() => navigate('/agenda')}>
              <div className="upcoming-date">
                <span>{formatDate(apt.start)}</span>
              </div>
              <div className="upcoming-info">
                <span className="upcoming-title">{apt.title}</span>
                <span className="upcoming-time">{formatTime(apt.start)}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhuma consulta confirmada para os próximos dias.</p>
      )}
      <button className="view-full-agenda-btn" onClick={() => navigate('/agenda')}>
        Ver agenda completa
      </button>
    </div>
  );
};

export default UpcomingAppointmentsWidget;