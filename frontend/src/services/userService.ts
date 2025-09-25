import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export interface UserRole {
  role: 'psychologist' | 'patient';
}

class UserService {
  // Cria o documento de função para um novo usuário
  async createUserRole(userId: string, role: 'psychologist' | 'patient'): Promise<void> {
    try {
      const userDocRef = doc(db, "users", userId);
      await setDoc(userDocRef, { role });
    } catch (error) {
      console.error("Erro ao criar a função do usuário:", error);
      throw new Error("Não foi possível configurar o usuário.");
    }
  }

  // Busca a função de um usuário logado
  async getUserRole(userId: string): Promise<UserRole | null> {
    try {
      const userDocRef = doc(db, "users", userId);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        return docSnap.data() as UserRole;
      }
      return null;
    } catch (error) {
      console.error("Erro ao buscar a função do usuário:", error);
      throw new Error("Não foi possível obter os dados do usuário.");
    }
  }
}

export const userService = new UserService();