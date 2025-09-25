import { Timestamp } from "firebase/firestore";

export type QuestionnaireAnswers = Record<string, string | number>;

export interface Patient {
  id: string;
  name: string;
  email: string;
  role: 'patient'; // ADICIONA A PROPRIEDADE 'role'
  phone?: string;
  psychologistId: string;
  createdAt: Timestamp;
  hasCompletedQuestionnaire?: boolean;
  questionnaireAnswers?: QuestionnaireAnswers;
}

export type NewPatientData = Omit<Patient, 'id' | 'createdAt' | 'hasCompletedQuestionnaire' | 'questionnaireAnswers' | 'role'>;