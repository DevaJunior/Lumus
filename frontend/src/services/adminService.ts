import { collection, query, where, getDocs, getCountFromServer, type DocumentData } from "firebase/firestore";
import { db } from "../config/firebase";
import type { UserProfile } from "./userService";

export interface PsychologistData extends UserProfile { uid: string; }

export interface PlatformStats {
  psychologistCount: number;
  patientCount: number;
  appointmentCount: number;
  totalRevenue: number;
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
  async getPlatformStats(): Promise<PlatformStats> {
    try {
      const psyQuery = query(collection(db, "users"), where("role", "==", "psychologist"));
      const patCollection = collection(db, "patients");
      const apptCollection = collection(db, "appointments");
      const transCollection = collection(db, "transactions");

      const psyCountPromise = getCountFromServer(psyQuery);
      const patCountPromise = getCountFromServer(patCollection);
      const apptCountPromise = getCountFromServer(apptCollection);
      const totalRevenuePromise = getDocs(transCollection);

      const [psySnapshot, patSnapshot, apptSnapshot, revenueSnapshot] = await Promise.all([
        psyCountPromise,
        patCountPromise,
        apptCountPromise,
        totalRevenuePromise
      ]);

      const totalRevenue = revenueSnapshot.docs.reduce(
        (sum, doc) => sum + doc.data().amount, 0
      );

      return {
        psychologistCount: psySnapshot.data().count,
        patientCount: patSnapshot.data().count,
        appointmentCount: apptSnapshot.data().count,
        totalRevenue: totalRevenue
      };
    } catch (error) {
      console.error("Erro ao buscar estatísticas da plataforma:", error);
      throw new Error("Não foi possível carregar as estatísticas.");
    }
  }
}

export const adminService = new AdminService();