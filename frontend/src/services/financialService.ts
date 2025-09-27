import {  collection,  addDoc,  serverTimestamp,  query,  where,  getDocs,  orderBy,  Timestamp, type DocumentData, Transaction } from "firebase/firestore";
import { db } from "../config/firebase";
import type { NewTransactionData } from "../types/Transaction";

class FinancialService {
  private transactionCollection = collection(db, "transactions");

  async addTransaction(transactionData: NewTransactionData): Promise<string> {
    try {
      const docRef = await addDoc(this.transactionCollection, {
        ...transactionData,
        date: Timestamp.fromDate(new Date(transactionData.date)),
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Erro ao adicionar transação: ", error);
      throw new Error("Não foi possível registrar a transação.");
    }
  }

  async getTransactionsByPsychologist(psychologistId: string): Promise<DocumentData[]> {
    try {
      const q = query(
        this.transactionCollection,
        where("psychologistId", "==", psychologistId),
        orderBy("date", "desc")
      );

      const querySnapshot = await getDocs(q);
      const transactions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return transactions;
    } catch (error) {
      console.error("Erro ao buscar transações: ", error);
      throw new Error("Não foi possível buscar as transações.");
    }
  }
  
  // FUNÇÃO MODIFICADA
  // Agora retorna os dados brutos (DocumentData) em vez de tentar fazer o casting aqui.
  async getTransactionsByPatient(patientId: string): Promise<DocumentData[]> {
    try {
      const q = query(
        this.transactionCollection,
        where("patientId", "==", patientId),
        orderBy("date", "desc")
      );

      const querySnapshot = await getDocs(q);
      const transactions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return transactions;
    } catch (error) {
      console.error("Erro ao buscar transações do paciente: ", error);
      throw new Error("Não foi possível buscar o histórico de pagamentos.");
    }
  }
}

export const financialService = new FinancialService();