import './styles.css';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import AddTransactionModal from '../../modals/AddTransactionModal';
import { useAuth } from '../../../src/contexts/AuthContext';
import type { Patient } from '../../../src/types/Patient';
import { financialService } from '../../../src/services/financialService';
import { patientService } from '../../../src/services/patientService';
import DashboardLayout from '../DashboardLayout';
import type { Transaction } from '../../../src/types/Transaction';

const Financeiro: React.FC = () => {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    if (!currentUser) return;
    try {
      setIsLoading(true);
      const [transactionsData, patientsData] = await Promise.all([
        financialService.getTransactionsByPsychologist(currentUser.uid),
        patientService.getPatientsByPsychologist(currentUser.uid)
      ]);
      setTransactions(transactionsData);
      setPatients(patientsData);
    } catch (err) {
      setError("Não foi possível carregar os dados financeiros.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const monthlyRevenue = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return transactions
      .filter(t => {
        const transactionDate = t.date.toDate();
        return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const renderContent = () => {
    if (isLoading) return <div className="loading-state">Carregando...</div>;
    if (error) return <div className="error-state">{error}</div>;
    if (transactions.length === 0) {
      return (
        <div className="empty-state">
          <h3>Nenhuma transação registrada</h3>
          <p>Clique em "Registrar Transação" para adicionar seu primeiro pagamento.</p>
        </div>
      );
    }
    return (
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Paciente</th>
            <th>Descrição</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(t => (
            <tr key={t.id}>
              <td data-label="Data">{t.date.toDate().toLocaleDateString('pt-BR')}</td>
              <td data-label="Paciente">{t.patientName}</td>
              <td data-label="Descrição">{t.description}</td>
              <td data-label="Valor" className="amount">{formatCurrency(t.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <DashboardLayout>
      <div className="financeiro-page">
        <header className="financeiro-header">
          <h1>Financeiro</h1>
          <button className="add-transaction-button" onClick={() => setIsModalOpen(true)}>
            + Registrar Transação
          </button>
        </header>

        <section className="summary-cards">
          <div className="summary-card">
            <h2>Faturamento do Mês</h2>
            <p>{formatCurrency(monthlyRevenue)}</p>
          </div>
          <div className="summary-card">
            <h2>Transações no Mês</h2>
            <p>{transactions.filter(t => t.date.toDate().getMonth() === new Date().getMonth()).length}</p>
          </div>
        </section>

        <section className="transactions-list-container">
          <h2>Histórico de Transações</h2>
          {renderContent()}
        </section>
      </div>
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTransactionAdded={fetchData}
        patients={patients}
      />
    </DashboardLayout>
  );
};

export default Financeiro;