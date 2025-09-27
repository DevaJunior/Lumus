import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './styles.css';
import type { Transaction } from '../../../src/types/Transaction';
import { useAuth } from '../../../src/contexts/AuthContext';
import { financialService } from './../../../src/services/financialService';

const PatientFinancials: React.FC = () => {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!currentUser) return;
    try {
      setIsLoading(true);
      // O serviço agora retorna dados brutos
      const rawData = await financialService.getTransactionsByPatient(currentUser.uid);
      // Fazemos a conversão de tipo aqui no componente
      const formattedTransactions = rawData.map(data => data as Transaction);
      setTransactions(formattedTransactions);
    } catch (err) {
      setError("Não foi possível carregar seu histórico financeiro.");
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalPaid = useMemo(() => {
    return transactions.reduce((sum, t) => sum + t.amount, 0);
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
          <h3>Nenhum pagamento encontrado</h3>
          <p>Seu histórico de pagamentos aparecerá aqui.</p>
        </div>
      );
    }
    return (
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Descrição</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(t => (
            <tr key={t.id}>
              <td data-label="Data">{t.date.toDate().toLocaleDateString('pt-BR')}</td>
              <td data-label="Descrição">{t.description}</td>
              <td data-label="Valor" className="amount">{formatCurrency(t.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="patient-financials-page">
      <header className="page-header">
        <h1>Meus Pagamentos</h1>
      </header>

      <section className="summary-card">
        <h2>Total Pago</h2>
        <p>{formatCurrency(totalPaid)}</p>
      </section>

      <section className="transactions-list-container">
        <h2>Histórico de Transações</h2>
        {renderContent()}
      </section>
    </div>
  );
};

export default PatientFinancials;