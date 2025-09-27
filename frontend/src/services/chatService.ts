import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import type { ChatMessage } from "../types/ChatMessage";
import type { Unsubscribe } from "firebase/auth";
import { db } from "../config/firebase";


class ChatService {
  // Gera um ID de chat único e consistente entre dois usuários
  getChatId(uid1: string, uid2: string): string {
    return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
  }

  // Escuta por novas mensagens em tempo real
  subscribeToChatMessages(
    chatId: string,
    callback: (messages: ChatMessage[]) => void
  ): Unsubscribe {
    const messagesCollection = collection(db, "chats", chatId, "messages");
    const q = query(messagesCollection, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ChatMessage));
      callback(messages);
    });

    return unsubscribe;
  }

  // Envia uma nova mensagem
  async sendMessage(chatId: string, senderId: string, text: string): Promise<void> {
    if (!text.trim()) return; // Não envia mensagens vazias

    const messagesCollection = collection(db, "chats", chatId, "messages");
    await addDoc(messagesCollection, {
      senderId,
      text,
      createdAt: serverTimestamp(),
    });
  }
}

export const chatService = new ChatService();