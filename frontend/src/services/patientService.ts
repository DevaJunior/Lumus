import { collection, addDoc, serverTimestamp, query, where, getDocs, type DocumentData, doc, getDoc, orderBy, updateDoc, } from "firebase/firestore";
import { db } from "../config/firebase";
import type { NewPatientData, Patient } from "../types/Patient";
import type { NewSessionNoteData } from "../types/SessionNote";
import { type SessionNote } from './../types/SessionNote';
import type { DiaryEntry, NewDiaryEntryData, UpdateDiaryEntryData } from "../types/DiaryEntry";

class PatientService {
  private patientCollection = collection(db, "patients");

  // --- Funções de Gerenciamento de Pacientes ---
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

  async getPatientById(patientId: string): Promise<Patient | null> {
    try {
      const docRef = doc(db, "patients", patientId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Patient;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Erro ao buscar paciente por ID: ", error);
      throw new Error("Não foi possível buscar os dados do paciente.");
    }
  }

  // --- Funções de Anotações de Sessão ---
  async addSessionNote(patientId: string, noteData: NewSessionNoteData): Promise<string> {
    try {
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

  async getSessionNotes(patientId: string): Promise<SessionNote[]> {
    try {
      const notesCollectionRef = collection(db, "patients", patientId, "sessionNotes");
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

  // --- Funções do Diário do Paciente ---
  async getDiaryEntries(patientId: string): Promise<DiaryEntry[]> {
    const entriesCollectionRef = collection(db, "patients", patientId, "diaryEntries");
    const q = query(entriesCollectionRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DiaryEntry));
  }
  
  // NOVA FUNÇÃO
  async getSharedDiaryEntries(patientId: string): Promise<DiaryEntry[]> {
    const entriesCollectionRef = collection(db, "patients", patientId, "diaryEntries");
    const q = query(
      entriesCollectionRef,
      where("shared", "==", true), // O filtro chave para a privacidade
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DiaryEntry));
  }

  async addDiaryEntry(patientId: string, entryData: NewDiaryEntryData): Promise<string> {
    const entriesCollectionRef = collection(db, "patients", patientId, "diaryEntries");
    const docRef = await addDoc(entriesCollectionRef, {
      ...entryData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }

  async updateDiaryEntry(patientId: string, entryId: string, entryData: UpdateDiaryEntryData): Promise<void> {
    const entryDocRef = doc(db, "patients", patientId, "diaryEntries", entryId);
    await updateDoc(entryDocRef, {
      ...entryData,
      updatedAt: serverTimestamp(),
    });
  }
}

export const patientService = new PatientService();