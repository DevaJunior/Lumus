import {  collection,  query,  where,  getDocs,  Timestamp, type DocumentData, addDoc, serverTimestamp, orderBy, doc, updateDoc, getDoc,} from "firebase/firestore";
import { db } from "../config/firebase";
import type { Appointment, NewAppointmentData } from "../types/Appointment";

class AppointmentService {
  private appointmentCollection = collection(db, "appointments");

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

  async getAppointmentsByPatient(patientId: string): Promise<Appointment[]> {
    try {
      const q = query(
        this.appointmentCollection,
        where("patientId", "==", patientId),
        orderBy("start", "desc")
      );
      const querySnapshot = await getDocs(q);
      const appointments: Appointment[] = [];
      querySnapshot.forEach((doc: DocumentData) => {
        const data = doc.data();
        appointments.push({
          id: doc.id,
          ...data,
          start: (data.start as Timestamp).toDate(),
          end: (data.end as Timestamp).toDate(),
        } as Appointment);
      });
      return appointments;
    } catch (error) {
      console.error("Erro ao buscar agendamentos do paciente: ", error);
      throw new Error("Não foi possível buscar os agendamentos.");
    }
  }

  async addAppointment(appointmentData: NewAppointmentData): Promise<string> {
    try {
      const docRef = await addDoc(this.appointmentCollection, {
        ...appointmentData,
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

  async updateAppointmentStatus(appointmentId: string, status: 'confirmed' | 'cancelled'): Promise<void> {
    try {
      const appointmentDocRef = doc(db, "appointments", appointmentId);
      const updateData: { status: string; videoRoomId?: string } = { status };

      if (status === 'confirmed') {
        updateData.videoRoomId = `lumus-${appointmentId.substring(0, 8)}-${Date.now()}`;
      }

      await updateDoc(appointmentDocRef, updateData);
    } catch (error) {
      console.error("Erro ao atualizar status do agendamento:", error);
      throw new Error("Não foi possível atualizar o agendamento.");
    }
  }

  async getAppointmentById(appointmentId: string): Promise<Appointment | null> {
    try {
      const docRef = doc(db, "appointments", appointmentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          start: (data.start as Timestamp).toDate(),
          end: (data.end as Timestamp).toDate(),
        } as Appointment;
      }
      return null;
    } catch (error) {
      console.error("Erro ao buscar agendamento por ID:", error);
      throw new Error("Não foi possível buscar o agendamento.");
    }
  }

  async getPendingAppointments(psychologistId: string): Promise<Appointment[]> {
    try {
      const q = query(
        this.appointmentCollection,
        where("psychologistId", "==", psychologistId),
        where("status", "==", "pending"), // Filtra apenas os pendentes
        orderBy("start", "asc") // Ordena pelos mais próximos primeiro
      );
      const querySnapshot = await getDocs(q);
      const appointments: Appointment[] = [];
      querySnapshot.forEach((doc: DocumentData) => {
        const data = doc.data();
        appointments.push({
          id: doc.id,
          ...data,
          start: (data.start as Timestamp).toDate(),
          end: (data.end as Timestamp).toDate(),
        } as Appointment);
      });
      return appointments;
    } catch (error) {
      console.error("Erro ao buscar solicitações pendentes:", error);
      throw new Error("Não foi possível buscar as solicitações.");
    }
  }
}

export const appointmentService = new AppointmentService();