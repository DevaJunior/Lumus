import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './styles.css';
import { useAuth } from '../../../src/contexts/AuthContext';
import type { Appointment } from '../../../src/types/Appointment';
import { appointmentService } from '../../../src/services/appointmentService';
import { Link } from 'react-router-dom';

const PatientAppointments: React.FC = () => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    if (!currentUser) return;
    try {
      setIsLoading(true);
      const data = await appointmentService.getAppointmentsByPatient(currentUser.uid);
      setAppointments(data);
    } catch (err) {
      setError("Não foi possível carregar seus agendamentos.");
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const { upcomingAppointments, pastAppointments } = useMemo(() => {
    const now = new Date();
    const upcoming = appointments.filter(apt => apt.start >= now);
    const past = appointments.filter(apt => apt.start < now);
    return { upcomingAppointments: upcoming, pastAppointments: past };
  }, [appointments]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit', minute: '2-digit',
    });
  };

  const getStatusText = (status: 'pending' | 'confirmed' | 'cancelled') => {
    switch (status) {
      case 'pending': return 'Aguardando Confirmação';
      case 'confirmed': return 'Confirmada';
      case 'cancelled': return 'Cancelada';
      default: return '';
    }
  };

  if (isLoading) {
    return <div className="loading-state">Carregando...</div>;
  }
  if (error) {
    return <div className="error-state">{error}</div>;
  }

  return (
    <div className="patient-appointments-page">
      <h1>Minhas Consultas</h1>

      <section className="appointments-section">
        <h2>Próximas Consultas</h2>
        {upcomingAppointments.length > 0 ? (
          <div className="appointments-list">
            {upcomingAppointments.map(apt => (
              <div key={apt.id} className={`appointment-card ${apt.status}`}>
                <div className="card-header">
                  <h3>{apt.title}</h3>
                  <span className={`status-badge status-${apt.status}`}>
                    {getStatusText(apt.status)}
                  </span>
                </div>
                <p><strong>Data:</strong> {formatDate(apt.start)}</p>
                <p><strong>Horário:</strong> {formatTime(apt.start)} - {formatTime(apt.end)}</p>
                {apt.status === 'confirmed' && apt.videoRoomId && (
                  <Link to={`/consulta/${apt.id}`} target="_blank" className="join-call-button">
                    Entrar na Consulta
                  </Link>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>Você não tem nenhuma consulta agendada.</p>
        )}
      </section>

      <section className="appointments-section">
        <h2>Consultas Anteriores</h2>
        {pastAppointments.length > 0 ? (
          <div className="appointments-list">
            {pastAppointments.map(apt => (
              <div key={apt.id} className={`appointment-card ${apt.status}`}>
                <div className="card-header">
                  <h3>{apt.title}</h3>
                  <span className={`status-badge status-${apt.status}`}>
                    {getStatusText(apt.status)}
                  </span>
                </div>
                <p><strong>Data:</strong> {formatDate(apt.start)}</p>
                <p><strong>Horário:</strong> {formatTime(apt.start)} - {formatTime(apt.end)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>Nenhuma consulta anterior encontrada.</p>
        )}
      </section>
    </div>
  );
};

export default PatientAppointments;