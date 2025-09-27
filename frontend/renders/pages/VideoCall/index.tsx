import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import './styles.css';
import { useAuth } from '../../../src/contexts/AuthContext';
import type { Appointment } from '../../../src/types/Appointment';
import { appointmentService } from './../../../src/services/appointmentService';

// Declara o JitsiMeetExternalAPI para o TypeScript
declare const JitsiMeetExternalAPI: any;

const VideoCall: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const { currentUser, userProfile } = useAuth();
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!appointmentId) {
      setError("ID da consulta não encontrado.");
      return;
    }
    
    const fetchAppointment = async () => {
      try {
        const data = await appointmentService.getAppointmentById(appointmentId);
        // Validação de segurança: o usuário logado deve ser o paciente ou o psicólogo da consulta
        if (data && (data.patientId === currentUser?.uid || data.psychologistId === currentUser?.uid)) {
          setAppointment(data);
        } else {
          setError("Consulta não encontrada ou você não tem permissão para acessá-la.");
        }
      } catch (err) {
        setError("Erro ao carregar os dados da consulta.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppointment();
  }, [appointmentId, currentUser]);

  useEffect(() => {
    if (appointment && jitsiContainerRef.current && currentUser) {
      const domain = 'meet.jit.si';
      const options = {
        roomName: appointment.videoRoomId,
        width: '100%',
        height: '100%',
        parentNode: jitsiContainerRef.current,
        interfaceConfigOverwrite: {
          FILM_STRIP_VIEW_ENABLED: false,
          SHOW_JITSI_WATERMARK: false,
        },
        userInfo: {
          displayName: (userProfile as any)?.name || currentUser.email
        }
      };
      const api = new JitsiMeetExternalAPI(domain, options);
      
      // Cleanup
      return () => api.dispose();
    }
  }, [appointment, currentUser, userProfile]);

  if (isLoading) return <div className="video-call-status">Carregando sala de vídeo...</div>;
  if (error) return <div className="video-call-status error">{error}</div>;

  return (
    <div className="video-call-container">
      <div ref={jitsiContainerRef} className="jitsi-container" />
    </div>
  );
};

export default VideoCall;