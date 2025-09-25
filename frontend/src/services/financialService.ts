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

  // FUNÇÃO MODIFICADA
  // Agora retorna os dados brutos do Firestore
  async getTransactionsByPsychologist(psychologistId: string): Promise<DocumentData[]> {
    try {
      const q = query(
        this.transactionCollection,
        where("psychologistId", "==", psychologistId),
        orderBy("date", "desc")
      );

      const querySnapshot = await getDocs(q);
      
      // Mapeia os documentos para um array de objetos, cada um com seu id e dados
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
}

export const financialService = new FinancialService();