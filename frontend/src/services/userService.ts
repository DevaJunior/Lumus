import { doc, getDoc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";

// Define a estrutura para um único horário de trabalho
export interface WorkHour {
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
}

export interface UserProfile {
  role: 'psychologist' | 'patient' | 'admin';
  status?: 'pending' | 'approved' | 'suspended'; // Status da conta
  workHours?: WorkHour[];
  // NOVOS CAMPOS DE ASSINATURA
  subscriptionPlan?: 'basic' | 'premium' | null;
  subscriptionStatus?: 'active' | 'inactive';
  subscriptionEndDate?: Timestamp;
}

class UserService {
  async createPsychologistProfile(userId: string): Promise<void> {
    try {
      const userDocRef = doc(db, "users", userId);
      await setDoc(userDocRef, {
        role: 'psychologist',
        status: 'pending',
        workHours: [],
        // Inicia sem plano e com status inativo
        subscriptionPlan: null,
        subscriptionStatus: 'inactive'
      });
    } catch (error) {
      console.error("Erro ao criar o perfil do psicólogo:", error);
      throw new Error("Não foi possível configurar o usuário.");
    }
  }

  // Busca o perfil completo de um usuário
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userDocRef = doc(db, "users", userId);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error("Erro ao buscar o perfil do usuário:", error);
      throw new Error("Não foi possível obter os dados do usuário.");
    }
  }

  // Atualizar os horários de trabalho
  async updateWorkHours(userId: string, workHours: WorkHour[]): Promise<void> {
    try {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, { workHours: workHours });
    } catch (error) {
      console.error("Erro ao atualizar horários de trabalho:", error);
      throw new Error("Não foi possível salvar os horários.");
    }
  }

  async updateUserSubscription(userId: string, plan: 'basic' | 'premium'): Promise<void> {
    try {
      const userDocRef = doc(db, "users", userId);
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30); // Adiciona 30 dias de assinatura

      await updateDoc(userDocRef, {
        subscriptionPlan: plan,
        subscriptionStatus: 'active',
        subscriptionEndDate: Timestamp.fromDate(endDate)
      });
    } catch (error) {
      console.error("Erro ao atualizar assinatura:", error);
      throw new Error("Não foi possível atualizar a assinatura.");
    }
  }

}

export const userService = new UserService();