import { Timestamp } from "firebase/firestore";

export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  createdAt: Timestamp;
}