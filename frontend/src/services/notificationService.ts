import { collection, query, where, orderBy, limit, onSnapshot, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";
import { type Notification } from "../types/Notification";
import type { Unsubscribe } from "firebase/auth";

class NotificationService {
  // Dispara a criação de uma nova notificação
  async createNotification(data: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): Promise<void> {
    const notificationsCollection = collection(db, "notifications");
    await addDoc(notificationsCollection, {
      ...data,
      isRead: false,
      createdAt: serverTimestamp(),
    });
  }

  // Se inscreve para ouvir as notificações de um usuário em tempo real
  subscribeToNotifications(
    userId: string,
    callback: (notifications: Notification[]) => void
  ): Unsubscribe{
    const notificationsCollection = collection(db, "notifications");
    const q = query(
      notificationsCollection,
      where("recipientId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(20) // Limita às 20 mais recentes
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notifications = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Notification));
      callback(notifications);
    });

    return unsubscribe;
  }

  // Marca uma notificação como lida
  async markAsRead(notificationId: string): Promise<void> {
    const notificationDocRef = doc(db, "notifications", notificationId);
    await updateDoc(notificationDocRef, { isRead: true });
  }
}

export const notificationService = new NotificationService();