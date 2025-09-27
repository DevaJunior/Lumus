import { Timestamp } from "firebase/firestore";

export interface Appointment {
  id: string;
  title: string;
  start: Date;
  end: Date;
  patientId: string;
  psychologistId: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  videoRoomId?: string; // NOVO CAMPO: Armazena o ID da sala
  createdAt: Timestamp;
}

export interface NewAppointmentData {
  title: string;
  start: Date;
  end: Date;
  patientId: string;
  psychologistId: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}