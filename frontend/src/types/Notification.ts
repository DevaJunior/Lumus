import { Timestamp } from "firebase/firestore";

export interface Notification {
  id: string;
  recipientId: string; // UID de quem recebe
  type: 'APPOINTMENT_REQUEST' | 'APPOINTMENT_CONFIRMED' | 'APPOINTMENT_CANCELLED' | 'NEW_MESSAGE';
  message: string;
  link: string; // Para onde o usuário será levado ao clicar
  isRead: boolean;
  createdAt: Timestamp;
}