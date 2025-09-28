import {  collection,  query,  where,  getDocs,  Timestamp, type DocumentData, addDoc, serverTimestamp, orderBy, doc, updateDoc, getDoc,} from "firebase/firestore";
import { db } from "../config/firebase";
import type { Appointment, NewAppointmentData } from "../types/Appointment";
import { notificationService } from "./notificationService";

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
      
      // Notifica o psicólogo que há uma nova solicitação
      await notificationService.createNotification({
        recipientId: appointmentData.psychologistId,
        type: 'APPOINTMENT_REQUEST',
        message: `Você tem uma nova solicitação de consulta de ${appointmentData.title.replace('Solicitação de ', '')}.`,
        link: '/agenda'
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
      const appointmentSnap = await getDoc(appointmentDocRef);
      if (!appointmentSnap.exists()) throw new Error("Agendamento não encontrado.");
      
      const appointmentData = appointmentSnap.data();
      const updateData: { status: string; videoRoomId?: string } = { status };

      if (status === 'confirmed') {
        updateData.videoRoomId = `lumus-${appointmentId.substring(0, 8)}-${Date.now()}`;
      }
      await updateDoc(appointmentDocRef, updateData);

      // Notifica o paciente sobre a mudança de status
      const message = status === 'confirmed' 
        ? 'Sua solicitação de consulta foi confirmada.'
        : 'Sua solicitação de consulta foi cancelada.';
      
      await notificationService.createNotification({
        recipientId: appointmentData.patientId,
        type: status === 'confirmed' ? 'APPOINTMENT_CONFIRMED' : 'APPOINTMENT_CANCELLED',
        message: message,
        link: '/minhas-consultas'
      });
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
        where("status", "==", "pending"),
        orderBy("start", "asc")
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