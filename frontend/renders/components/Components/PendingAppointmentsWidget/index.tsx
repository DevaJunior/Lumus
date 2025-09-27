import { useAuth } from '../../../../src/contexts/AuthContext';
import { appointmentService } from '../../../../src/services/appointmentService';
import type { Appointment } from '../../../../src/types/Appointment';
import './styles.css';
import React, { useState, useEffect, useCallback } from 'react';

interface PendingAppointmentsWidgetProps {
  onUpdate: () => void; // Função para notificar o Dashboard a recarregar tudo
}

const PendingAppointmentsWidget: React.FC<PendingAppointmentsWidgetProps> = ({ onUpdate }) => {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRequests = useCallback(async () => {
    if (!currentUser) return;
    try {
      const data = await appointmentService.getPendingAppointments(currentUser.uid);
      setRequests(data);
    } catch (error) {
      console.error(error);
      // Não mostraremos erro no widget, apenas no console
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleStatusUpdate = async (appointmentId: string, status: 'confirmed' | 'cancelled') => {
    const actionText = status === 'confirmed' ? 'confirmar' : 'recusar';
    if (window.confirm(`Tem certeza que deseja ${actionText} esta solicitação?`)) {
      try {
        await appointmentService.updateAppointmentStatus(appointmentId, status);
        onUpdate(); // Chama a função do componente pai para atualizar tudo
        fetchRequests(); // Recarrega apenas o widget
      } catch (error) {
        alert("Erro ao processar a solicitação.");
      }
    }
  };
  
  const formatDate = (date: Date) => date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' });
  const formatTime = (date: Date) => date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  if (isLoading) return <div className="widget-loading">Carregando solicitações...</div>;

  return (
    <div className="widget-container">
      <h2>Solicitações Pendentes</h2>
      {requests.length > 0 ? (
        <ul className="requests-list">
          {requests.map(req => (
            <li key={req.id} className="request-item">
              <div className="request-info">
                <span className="request-title">{req.title}</span>
                <span className="request-time">{formatDate(req.start)} às {formatTime(req.start)}</span>
              </div>
              <div className="request-actions">
                <button className="button-decline" onClick={() => handleStatusUpdate(req.id, 'cancelled')}>Recusar</button>
                <button className="button-confirm" onClick={() => handleStatusUpdate(req.id, 'confirmed')}>Confirmar</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhuma solicitação pendente no momento.</p>
      )}
    </div>
  );
};

export default PendingAppointmentsWidget;