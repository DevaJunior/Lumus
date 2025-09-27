import React, { useState } from 'react';
import Modal from '../../components/Components/Modal';
import { type EventApi } from '@fullcalendar/core';
import './styles.css';
import { appointmentService } from '../../../src/services/appointmentService';
import { Link } from 'react-router-dom';

interface AppointmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventApi | null;
  onStatusChange: () => void;
}

const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({
  isOpen,
  onClose,
  event,
  onStatusChange,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!event) return null;

  const { title, start, end } = event;
  const status = event.extendedProps.status;

  const handleStatusUpdate = async (newStatus: 'confirmed' | 'cancelled') => {
    setIsLoading(true);
    try {
      await appointmentService.updateAppointmentStatus(event.id, newStatus);
      onStatusChange();
      onClose();
    } catch (error) {
      alert("Erro ao atualizar o agendamento.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date | null) => date?.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) || '';
  const formatTime = (date: Date | null) => date?.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) || '';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalhes do Agendamento">
      <div className="appointment-details">
        <p><strong>Paciente:</strong> {title}</p>
        <p><strong>Data:</strong> {formatDate(start)}</p>
        <p><strong>Horário:</strong> {formatTime(start)} - {formatTime(end)}</p>
        <p><strong>Status Atual:</strong> <span className={`status-text status-${status}`}>{status}</span></p>
      </div>

      {status === 'confirmed' && (
        <div className="start-call-action">
          <Link to={`/consulta/${event.id}`} target="_blank" className="button-start-call">
            Iniciar Chamada de Vídeo
          </Link>
        </div>
      )}

      {status === 'pending' && (
        <div className="form-actions">
          <button className="button-decline" onClick={() => handleStatusUpdate('cancelled')} disabled={isLoading}>
            Recusar
          </button>
          <button className="button-confirm" onClick={() => handleStatusUpdate('confirmed')} disabled={isLoading}>
            {isLoading ? 'Confirmando...' : 'Confirmar Consulta'}
          </button>
        </div>
      )}
    </Modal>
  );
};

export default AppointmentDetailModal;