import { Timestamp } from "firebase/firestore";

export interface Patient {
  id: string; // O ID do documento no Firestore
  name: string;
  email: string;
  phone?: string; // Opcional
  psychologistId: string; // ID do psicólogo responsável
  createdAt: Timestamp;
}

// Usado para criar um novo paciente, já que o ID é gerado pelo Firestore
export type NewPatientData = Omit<Patient, 'id' | 'createdAt'>;