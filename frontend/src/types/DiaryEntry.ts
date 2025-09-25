import { Timestamp } from "firebase/firestore";

export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  shared: boolean; // true se compartilhada com o psicólogo
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export type NewDiaryEntryData = Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateDiaryEntryData = Partial<NewDiaryEntryData>;