import { collection, addDoc, serverTimestamp, query, where, getDocs, type DocumentData, doc, getDoc, orderBy, } from "firebase/firestore";
import { db } from "../config/firebase";
import type { NewPatientData, Patient } from "../types/Patient";
import type { NewSessionNoteData } from "../types/SessionNote";
import { type SessionNote } from './../types/SessionNote';

class PatientService {
  private patientCollection = collection(db, "patients");

  // Adiciona um novo paciente ao Firestore
  async addPatient(patientData: NewPatientData): Promise<string> {
    try {
      const docRef = await addDoc(this.patientCollection, {
        ...patientData,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Erro ao adicionar paciente: ", error);
      throw new Error("Não foi possível adicionar o paciente.");
    }
  }

  // Busca todos os pacientes de um psicólogo específico
  async getPatientsByPsychologist(psychologistId: string): Promise<Patient[]> {
    try {
      const q = query(
        this.patientCollection,
        where("psychologistId", "==", psychologistId)
      );
      
      const querySnapshot = await getDocs(q);
      const patients: Patient[] = [];
      
      querySnapshot.forEach((doc: DocumentData) => {
        patients.push({ id: doc.id, ...doc.data() } as Patient);
      });

      return patients;
    } catch (error) {
      console.error("Erro ao buscar pacientes: ", error);
      throw new Error("Não foi possível buscar os pacientes.");
    }
  }

  // NOVA FUNÇÃO: Busca um único paciente pelo seu ID
  async getPatientById(patientId: string): Promise<Patient | null> {
    try {
      const docRef = doc(db, "patients", patientId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Patient;
      } else {
        return null; // Paciente não encontrado
      }
    } catch (error) {
      console.error("Erro ao buscar paciente por ID: ", error);
      throw new Error("Não foi possível buscar os dados do paciente.");
    }
  }

  // NOVA FUNÇÃO: Adiciona uma anotação de sessão para um paciente
  async addSessionNote(patientId: string, noteData: NewSessionNoteData): Promise<string> {
    try {
      // Cria uma referência para a subcoleção "sessionNotes" dentro do documento do paciente
      const notesCollectionRef = collection(db, "patients", patientId, "sessionNotes");
      const docRef = await addDoc(notesCollectionRef, {
        ...noteData,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Erro ao adicionar anotação de sessão: ", error);
      throw new Error("Não foi possível salvar a anotação.");
    }
  }

  // NOVA FUNÇÃO: Busca todas as anotações de sessão de um paciente
  async getSessionNotes(patientId: string): Promise<SessionNote[]> {
    try {
      const notesCollectionRef = collection(db, "patients", patientId, "sessionNotes");
      // Ordena as anotações da mais recente para a mais antiga
      const q = query(notesCollectionRef, orderBy("createdAt", "desc"));

      const querySnapshot = await getDocs(q);
      const notes: SessionNote[] = [];

      querySnapshot.forEach((doc: DocumentData) => {
        notes.push({ id: doc.id, ...doc.data() } as SessionNote);
      });

      return notes;
    } catch (error) {
      console.error("Erro ao buscar anotações de sessão: ", error);
      throw new Error("Não foi possível carregar as anotações.");
    }
  }
}

export const patientService = new PatientService();