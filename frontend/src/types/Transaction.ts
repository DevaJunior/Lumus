import { Timestamp } from "firebase/firestore";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: Timestamp;
  patientId: string;
  patientName: string;
  psychologistId: string;
  createdAt: Timestamp;
}

export interface NewTransactionData {
  description: string;
  amount: number;
  date: Date | string;
  patientId: string;
  patientName: string;
  psychologistId: string;
}