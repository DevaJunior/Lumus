import { Timestamp } from "firebase/firestore";

export interface Appointment {
  id: string;
  title: string; // Ex: "Sessão com [Nome do Paciente]"
  start: Date;   // Data e hora de início
  end: Date;     // Data e hora de término
  patientId: string;
  psychologistId: string;
  createdAt: Timestamp;
}

// Para criar um novo agendamento
export interface NewAppointmentData {
  title: string;
  start: Date;
  end: Date;
  patientId: string;
  psychologistId: string;
}