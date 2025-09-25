import {  collection,  query,  where,  getDocs,  Timestamp, type DocumentData, addDoc, serverTimestamp,} from "firebase/firestore";
import { db } from "../config/firebase";
import type { Appointment, NewAppointmentData } from "../types/Appointment";

class AppointmentService {
  private appointmentCollection = collection(db, "appointments");

  // Busca todos os agendamentos de um psicólogo
  async getAppointmentsByPsychologist(psychologistId: string): Promise<Appointment[]> {
    try {
      const q = query(
        this.appointmentCollection,
        where("psychologistId", "==", psychologistId)
      );

      const querySnapshot = await getDocs(q);
      const appointments: Appointment[] = [];

      querySnapshot.forEach((doc: DocumentData) => {
        const data = doc.data();
        appointments.push({
          id: doc.id,
          ...data,
          // Converte Timestamps do Firestore para objetos Date do JavaScript
          start: (data.start as Timestamp).toDate(),
          end: (data.end as Timestamp).toDate(),
        } as Appointment);
      });

      return appointments;
    } catch (error) {
      console.error("Erro ao buscar agendamentos: ", error);
      throw new Error("Não foi possível buscar os agendamentos.");
    }
  }

  // NOVA FUNÇÃO: Adiciona um novo agendamento
  async addAppointment(appointmentData: NewAppointmentData): Promise<string> {
    try {
      const docRef = await addDoc(this.appointmentCollection, {
        ...appointmentData,
        // Converte as datas para o formato Timestamp do Firestore antes de salvar
        start: Timestamp.fromDate(appointmentData.start),
        end: Timestamp.fromDate(appointmentData.end),
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Erro ao adicionar agendamento: ", error);
      throw new Error("Não foi possível salvar o agendamento.");
    }
  }
}

export const appointmentService = new AppointmentService();