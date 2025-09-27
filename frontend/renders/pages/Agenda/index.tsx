import './styles.css';
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../src/contexts/AuthContext';
import type { Appointment } from '../../../src/types/Appointment';
import { appointmentService } from '../../../src/services/appointmentService';
import DashboardLayout from '../DashboardLayout';
import type { Patient } from '../../../src/types/Patient';
import { patientService } from '../../../src/services/patientService';
import AddAppointmentModal from '../../modals/AddAppointmentModal';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventApi, EventClickArg, EventInput } from 'fullcalendar/index.js';
import AppointmentDetailModal from '../../modals/AppointmentDetailModal';

const Agenda: React.FC = () => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState<EventInput[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);

  const loadData = useCallback(async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const [appointmentList, patientList] = await Promise.all([
        appointmentService.getAppointmentsByPsychologist(currentUser.uid),
        patientService.getPatientsByPsychologist(currentUser.uid)
      ]);

      const formattedEvents = appointmentList.map((apt: Appointment): EventInput => {
        const status = apt.status;
        let backgroundColor = 'var(--accent-primary)';
        if (status === 'pending') backgroundColor = 'orange';
        if (status === 'cancelled') backgroundColor = 'grey';

        return {
          id: apt.id,
          title: apt.title,
          start: apt.start,
          end: apt.end,
          backgroundColor,
          borderColor: backgroundColor,
          extendedProps: { status }
        };
      });

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
    loadData();
  }, [loadData]);

  const handleDateClick = (arg: any) => {
    setSelectedDate(arg.date);
    setIsAddModalOpen(true);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    setSelectedEvent(clickInfo.event);
  };

  const handleModalCloseAndRefresh = () => {
    setIsAddModalOpen(false);
    setSelectedEvent(null);
    loadData();
  };

  return (
    <>
      <div className="agenda-page">
        <header className="agenda-header">
          <h1>Agenda</h1>
          <p>Clique em um dia para adicionar um novo agendamento ou em uma solicitação para gerenciá-la.</p>
        </header>
        <div className="calendar-container">
          {isLoading ? <p>Carregando...</p> :
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
              locale="pt-br"
              buttonText={{ today: 'Hoje', month: 'Mês', week: 'Semana', day: 'Dia' }}
              dateClick={handleDateClick}
              eventClick={handleEventClick}
            />
          }
        </div>
      </div>
      <AddAppointmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAppointmentAdded={handleModalCloseAndRefresh}
        selectedDate={selectedDate}
        patients={patients}
      />
      <AppointmentDetailModal
        isOpen={Boolean(selectedEvent)}
        onClose={() => setSelectedEvent(null)}
        event={selectedEvent}
        onStatusChange={handleModalCloseAndRefresh}
      />
    </>
  );
};

export default Agenda;