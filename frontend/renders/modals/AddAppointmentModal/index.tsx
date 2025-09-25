import React, { useState, useEffect } from 'react';
import Modal from '../../components/Components/Modal';
import './styles.css';
import type { Patient } from '../../../src/types/Patient';
import { useAuth } from '../../../src/contexts/AuthContext';
import type { NewAppointmentData } from '../../../src/types/Appointment';
import { appointmentService } from '../../../src/services/appointmentService';

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAppointmentAdded: () => void;
  selectedDate: Date | null;
  patients: Patient[];
}

const AddAppointmentModal: React.FC<AddAppointmentModalProps> = ({
  isOpen,
  onClose,
  onAppointmentAdded,
  selectedDate,
  patients,
}) => {
  const { currentUser } = useAuth();
  const [patientId, setPatientId] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Reseta o formulário quando o modal é aberto
    if (isOpen) {
      setPatientId('');
      setStartTime('09:00');
      setEndTime('10:00');
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!patientId || !startTime || !endTime || !selectedDate || !currentUser) {
      setError("Todos os campos são obrigatórios.");
      return;
    }

    setIsLoading(true);
    setError(null);

    // Constrói as datas de início e fim completas
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const startDate = new Date(selectedDate);
    startDate.setHours(startHour, startMinute, 0, 0);

    const [endHour, endMinute] = endTime.split(':').map(Number);
    const endDate = new Date(selectedDate);
    endDate.setHours(endHour, endMinute, 0, 0);

    if (endDate <= startDate) {
      setError("O horário de término deve ser posterior ao de início.");
      setIsLoading(false);
      return;
    }

    const selectedPatient = patients.find(p => p.id === patientId);
    if (!selectedPatient) {
        setError("Paciente selecionado inválido.");
        setIsLoading(false);
        return;
    }

    const newAppointmentData: NewAppointmentData = {
      title: `Sessão com ${selectedPatient.name}`,
      start: startDate,
      end: endDate,
      patientId: selectedPatient.id,
      psychologistId: currentUser.uid,
    };

    try {
      await appointmentService.addAppointment(newAppointmentData);
      onAppointmentAdded();
      onClose();
    } catch (err) {
      setError("Ocorreu um erro ao salvar o agendamento.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Agendamento">
      <form onSubmit={handleSubmit} className="add-appointment-form">
        <div className="form-group">
          <label htmlFor="patient-select">Paciente</label>
          <select
            id="patient-select"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            required
          >
            <option value="" disabled>Selecione um paciente</option>
            {patients.map(patient => (
              <option key={patient.id} value={patient.id}>{patient.name}</option>
            ))}
          </select>
        </div>
        <div className="time-group">
          <div className="form-group">
            <label htmlFor="start-time">Horário de Início</label>
            <input
              id="start-time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="end-time">Horário de Término</label>
            <input
              id="end-time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
        </div>
        {error && <p className="form-error">{error}</p>}
        <div className="form-actions">
          <button type="button" className="button-secondary" onClick={onClose} disabled={isLoading}>
            Cancelar
          </button>
          <button type="submit" className="button-primary" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar Agendamento'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddAppointmentModal;