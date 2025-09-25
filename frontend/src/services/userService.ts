import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export interface UserProfile {
  role: 'psychologist' | 'patient' | 'admin';
  status: 'pending' | 'approved' | 'suspended'; // Novo campo de status
}

class UserService {
  // Cria o documento de perfil para um novo psicólogo
  async createPsychologistProfile(userId: string): Promise<void> {
    try {
      const userDocRef = doc(db, "users", userId);
      // Novos psicólogos sempre começam como 'pendente'
      await setDoc(userDocRef, { role: 'psychologist', status: 'pending' });
    } catch (error) {
      console.error("Erro ao criar o perfil do psicólogo:", error);
      throw new Error("Não foi possível configurar o usuário.");
    }
  }

  // Busca o perfil completo de um usuário logado
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
}

export const userService = new UserService();