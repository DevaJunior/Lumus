import React, { useState, useEffect } from 'react';
import Modal from '../../components/Components/Modal';
import './styles.css';
import { useAuth } from '../../../src/contexts/AuthContext';
import type { Patient } from '../../../src/types/Patient';
import type { NewTransactionData } from '../../../src/types/Transaction';
import { financialService } from '../../../src/services/financialService';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransactionAdded: () => void;
  patients: Patient[];
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onTransactionAdded,
  patients,
}) => {
  const { currentUser } = useAuth();
  
  // Função para obter a data atual no formato YYYY-MM-DD
  const getTodayString = () => new Date().toISOString().split('T')[0];

  const [patientId, setPatientId] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(getTodayString());
  const [description, setDescription] = useState('Sessão de Terapia');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPatientId('');
      setAmount('');
      setDate(getTodayString());
      setDescription('Sessão de Terapia');
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!patientId || !amount || !date || !description || !currentUser) {
      setError("Todos os campos são obrigatórios.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const selectedPatient = patients.find(p => p.id === patientId);
    if (!selectedPatient) {
      setError("Paciente selecionado é inválido.");
      setIsLoading(false);
      return;
    }

    const newTransactionData: NewTransactionData = {
      description,
      amount: parseFloat(amount),
      date: date,
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      psychologistId: currentUser.uid,
    };

    try {
      await financialService.addTransaction(newTransactionData);
      onTransactionAdded();
      onClose();
    } catch (err) {
      setError("Ocorreu um erro ao registrar a transação.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Nova Transação">
      <form onSubmit={handleSubmit} className="add-transaction-form">
        <div className="form-group">
          <label htmlFor="patient-select">Paciente</label>
          <select id="patient-select" value={patientId} onChange={(e) => setPatientId(e.target.value)} required>
            <option value="" disabled>Selecione um paciente</option>
            {patients.map(patient => (
              <option key={patient.id} value={patient.id}>{patient.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="description">Descrição</label>
          <input id="description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div className="inline-group">
          <div className="form-group">
            <label htmlFor="amount">Valor (R$)</label>
            <input id="amount" type="number" step="0.01" placeholder="150.00" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="date">Data do Pagamento</label>
            <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
        </div>
        {error && <p className="form-error">{error}</p>}
        <div className="form-actions">
          <button type="button" className="button-secondary" onClick={onClose} disabled={isLoading}>
            Cancelar
          </button>
          <button type="submit" className="button-primary" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar Transação'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTransactionModal;