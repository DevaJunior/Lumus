import { collection, query, where, getDocs, type DocumentData, doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import type { UserProfile } from "./userService";

// Agora o tipo de dado inclui o perfil completo do usuário
export interface PsychologistData extends UserProfile {
    uid: string;
}

class AdminService {
  async getAllPsychologists(): Promise<PsychologistData[]> {
    try {
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, where("role", "==", "psychologist"));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map((doc: DocumentData) => ({
        uid: doc.id,
        ...doc.data()
      } as PsychologistData));
    } catch (error) {
      console.error("Erro ao buscar psicólogos:", error);
      throw new Error("Não foi possível buscar os psicólogos.");
    }
  }

  // NOVA FUNÇÃO
  async updatePsychologistStatus(uid: string, status: 'approved' | 'suspended'): Promise<void> {
    try {
      const userDocRef = doc(db, "users", uid);
      await updateDoc(userDocRef, { status: status });
    } catch (error) {
      console.error("Erro ao atualizar status do psicólogo:", error);
      throw new Error("Não foi possível atualizar o status.");
    }
  }
}

export const adminService = new AdminService();