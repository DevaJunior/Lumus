import { doc, getDoc, setDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "../config/firebase";

// NOVA ESTRUTURA PARA HORÁRIOS
// Um único intervalo de tempo
export interface TimeInterval {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
}

// O agendamento para um dia agora contém um ARRAY de intervalos
export interface DaySchedule {
  isEnabled: boolean;
  intervals: TimeInterval[];
}
export type WorkSchedule = Record<number, DaySchedule>;

export interface UserProfile {
  role: 'psychologist' | 'patient' | 'admin';
  status?: 'pending' | 'approved' | 'suspended';
  workSchedule?: WorkSchedule;
  subscriptionPlan?: 'basic' | 'premium' | null;
  subscriptionStatus?: 'active' | 'inactive';
  subscriptionEndDate?: Timestamp;
  email?: string;
}

const createDefaultSchedule = (): WorkSchedule => {
  const schedule: WorkSchedule = {};
  for (let i = 0; i < 7; i++) {
    const isWeekday = i > 0 && i < 6;
    // O primeiro intervalo é sempre o "Horário de Trabalho"
    schedule[i] = { isEnabled: isWeekday, intervals: [{ id: `default-${i}`, name: "Horário de Trabalho", startTime: '09:00', endTime: '18:00' }] };
  }
  return schedule;
};

class UserService {
  async createPsychologistProfile(userId: string, email: string): Promise<void> {
    try {
      const userDocRef = doc(db, "users", userId);
      await setDoc(userDocRef, { 
        role: 'psychologist', 
        status: 'pending',
        workSchedule: createDefaultSchedule(),
        subscriptionPlan: null,
        subscriptionStatus: 'inactive',
        email: email
      });
    } catch (error) {
      console.error("Erro ao criar o perfil do psicólogo:", error);
      throw new Error("Não foi possível configurar o usuário.");
    }
  }

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
  
  async updateWorkSchedule(userId: string, workSchedule: WorkSchedule): Promise<void> {
    try {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, { workSchedule });
    } catch (error) {
      console.error("Erro ao atualizar horários de trabalho:", error);
      throw new Error("Não foi possível salvar os horários.");
    }
  }

  // FUNÇÃO RESTAURADA E MANTIDA
  async updateUserSubscription(userId: string, plan: 'basic' | 'premium'): Promise<void> {
    try {
      const userDocRef = doc(db, "users", userId);
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);

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
