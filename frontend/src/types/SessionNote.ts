import { Timestamp } from "firebase/firestore";

export interface SessionNote {
  id: string;
  content: string;
  createdAt: Timestamp;
}

export type NewSessionNoteData = Omit<SessionNote, 'id' | 'createdAt'>;