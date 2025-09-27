import React, { useState, useEffect, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './styles.css';
import { useAuth } from '../../../src/contexts/AuthContext';
import type { Patient } from '../../../src/types/Patient';
import { userService } from '../../../src/services/userService';
import { appointmentService } from '../../../src/services/appointmentService';
import type { EventInput } from 'fullcalendar/index.js';

const RequestAppointment: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  // 2. ATUALIZA O TIPO DO ESTADO
  const [events, setEvents] = useState<EventInput[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const patientProfile = userProfile as Patient;

  const fetchSchedule = useCallback(async () => {
    if (!patientProfile?.psychologistId) return;

    try {
      setIsLoading(true);
      const psychologistId = patientProfile.psychologistId;
      
      const [psychologistProfile, bookedAppointments] = await Promise.all([
        userService.getUserProfile(psychologistId),
        appointmentService.getAppointmentsByPsychologist(psychologistId)
      ]);

      // 3. ATUALIZA A DECLARAÇÃO DA VARIÁVEL
      const calendarEvents: EventInput[] = [];

      // Adiciona os horários de trabalho do psicólogo como eventos de fundo
      if (psychologistProfile?.workHours) {
        psychologistProfile.workHours.forEach(wh => {
          calendarEvents.push({
            groupId: 'workHours',
            daysOfWeek: wh.daysOfWeek,
            startTime: wh.startTime,
            endTime: wh.endTime,
            display: 'background',
            backgroundColor: 'var(--accent-positive)',
          });
        });
      }

      // Adiciona os agendamentos já confirmados
      bookedAppointments.forEach(apt => {
        if (apt.status === 'confirmed') {
          calendarEvents.push({
            title: 'Horário Ocupado',
            start: apt.start,
            end: apt.end,
            backgroundColor: 'var(--accent-negative)',
            borderColor: 'var(--accent-negative)',
          });
        }
      });
      
      setEvents(calendarEvents);
    } catch (error) {
      console.error(error);
      alert("Não foi possível carregar a agenda do psicólogo.");
    } finally {
      setIsLoading(false);
    }
  }, [patientProfile]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  const handleDateSelect = async (selectInfo: any) => {
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();

    const title = `Solicitação de ${patientProfile.name}`;
    if (window.confirm(`Você deseja solicitar uma consulta de ${formatTime(selectInfo.start)} até ${formatTime(selectInfo.end)}?`)) {
      try {
        if (!currentUser || !patientProfile.psychologistId) return;
        
        await appointmentService.addAppointment({
          title: title,
          start: selectInfo.start,
          end: selectInfo.end,
          patientId: currentUser.uid,
          psychologistId: patientProfile.psychologistId,
          status: 'pending',
        });
        alert("Solicitação enviada com sucesso! Aguarde a confirmação do seu psicólogo.");
        fetchSchedule();
      } catch (error) {
        alert("Não foi possível enviar a solicitação.");
      }
    }
  };

  const formatTime = (date: Date) => date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="request-appointment-page">
      <h1>Solicitar Consulta</h1>
      <p>Veja os horários disponíveis do seu psicólogo. Clique e arraste no calendário para selecionar o período desejado e enviar uma solicitação.</p>
      
      <div className="calendar-container">
        {isLoading ? <p>Carregando agenda...</p> : (
          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'timeGridWeek,timeGridDay'
            }}
            allDaySlot={false}
            locale="pt-br"
            selectable={true}
            selectMirror={true}
            events={events}
            select={handleDateSelect}
            eventOverlap={false}
            slotMinTime="08:00:00"
            slotMaxTime="21:00:00"
            buttonText={{ today: 'Hoje', week: 'Semana', day: 'Dia' }}
          />
        )}
      </div>
    </div>
  );
};

export default RequestAppointment;