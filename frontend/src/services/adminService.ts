import { collection, query, where, getDocs, type DocumentData } from "firebase/firestore";
import { db } from "../config/firebase";

// Um tipo simples para os dados do psicólogo que o admin verá
export interface PsychologistData {
    uid: string;
    email?: string;
    // Futuramente, podemos buscar mais dados de uma coleção 'profiles'
}

class AdminService {
  async getAllPsychologists(): Promise<PsychologistData[]> {
    try {
      // Busca na coleção 'users' por todos com a função 'psychologist'
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, where("role", "==", "psychologist"));

      const querySnapshot = await getDocs(q);
      const psychologists: PsychologistData[] = [];

      querySnapshot.forEach((doc: DocumentData) => {
        // O ID do documento é o UID do usuário
        psychologists.push({ uid: doc.id });
      });

      // Nota: Para obter o e-mail, o ideal seria ter os e-mails no documento do Firestore
      // ou usar uma Cloud Function para buscar da Autenticação (mais complexo).
      // Por enquanto, exibiremos apenas o UID.
      return psychologists;

    } catch (error) {
      console.error("Erro ao buscar psicólogos:", error);
      throw new Error("Não foi possível buscar os psicólogos.");
    }
  }
}

export const adminService = new AdminService();