import { Timestamp } from "firebase/firestore";

// Define um tipo para as respostas do questionário
export type QuestionnaireAnswers = Record<string, string | number>;

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone?: string;
  psychologistId: string;
  createdAt: Timestamp;
  hasCompletedQuestionnaire?: boolean;
  questionnaireAnswers?: QuestionnaireAnswers;
}

export type NewPatientData = Omit<Patient, 'id' | 'createdAt' | 'hasCompletedQuestionnaire' | 'questionnaireAnswers'>;