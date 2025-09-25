import './styles.css';
import React, { useState, useEffect, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useAuth } from '../../../src/contexts/AuthContext';
import type { Appointment } from '../../../src/types/Appointment';
import { appointmentService } from '../../../src/services/appointmentService';
import DashboardLayout from '../DashboardLayout';
import type { Patient } from '../../../src/types/Patient';
import { patientService } from '../../../src/services/patientService';
import AddAppointmentModal from '../../modals/AddAppointmentModal';

const Agenda: React.FC = () => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para o modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    if (!currentUser) return;
    try {
      setIsLoading(true);
      // Busca agendamentos e pacientes em paralelo
      const [appointmentList, patientList] = await Promise.all([
        appointmentService.getAppointmentsByPsychologist(currentUser.uid),
        patientService.getPatientsByPsychologist(currentUser.uid)
      ]);
      
      const formattedEvents = appointmentList.map((apt: Appointment) => ({
        id: apt.id,
        title: apt.title,
        start: apt.start,
        end: apt.end,
      }));

      setAppointments(formattedEvents);
      setPatients(patientList);
    } catch (err) {
      setError("Não foi possível carregar os dados da agenda.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const handleDateClick = (arg: any) => {
    setSelectedDate(arg.date);
    setIsModalOpen(true);
  };

  const handleAppointmentAdded = () => {
    // Fecha o modal e recarrega os eventos
    setIsModalOpen(false);
    fetchData();
  };

  if (isLoading) {
    return <DashboardLayout><div className="loading-state">Carregando agenda...</div></DashboardLayout>;
  }

  if (error) {
    return <DashboardLayout><div className="error-state">{error}</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="agenda-page">
        <header className="agenda-header">
          <h1>Agenda</h1>
          <p>Clique em um dia para adicionar um novo agendamento.</p>
        </header>
        <div className="calendar-container">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            events={appointments}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            dateClick={handleDateClick}
            locale="pt-br"
            buttonText={{
              today: 'Hoje',
              month: 'Mês',
              week: 'Semana',
              day: 'Dia',
            }}
          />
        </div>
      </div>
      <AddAppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAppointmentAdded={handleAppointmentAdded}
        selectedDate={selectedDate}
        patients={patients}
      />
    </DashboardLayout>
  );
};

export default Agenda;