import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, Timestamp, Transaction, type DocumentData } from "firebase/firestore";
import { db } from "../config/firebase";
import type { NewTransactionData } from "../types/Transaction";

class FinancialService {
  private transactionCollection = collection(db, "transactions");

  // Adiciona uma nova transação (receita)
  async addTransaction(transactionData: NewTransactionData): Promise<string> {
    try {
      const docRef = await addDoc(this.transactionCollection, {
        ...transactionData,
        // Garante que a data do pagamento seja salva como Timestamp
        date: Timestamp.fromDate(new Date(transactionData.date)),
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Erro ao adicionar transação: ", error);
      throw new Error("Não foi possível registrar a transação.");
    }
  }

  // Busca todas as transações de um psicólogo, ordenadas pela data do pagamento
  async getTransactionsByPsychologist(psychologistId: string): Promise<Transaction[]> {
    try {
      const q = query(
        this.transactionCollection,
        where("psychologistId", "==", psychologistId),
        orderBy("date", "desc") // Ordena das mais recentes para as mais antigas
      );

      const querySnapshot = await getDocs(q);
      const transactions: Transaction[] = [];

      querySnapshot.forEach((doc: DocumentData) => {
        transactions.push({ id: doc.id, ...doc.data() } as Transaction);
      });

      return transactions;
    } catch (error) {
      console.error("Erro ao buscar transações: ", error);
      throw new Error("Não foi possível buscar as transações.");
    }
  }
}

export const financialService = new FinancialService();