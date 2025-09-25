import React, { useState } from 'react';
import './styles.css';
import { useAuth } from '../../../src/contexts/AuthContext';
import type { NewPatientData } from '../../../src/types/Patient';
import { patientService } from '../../../src/services/patientService';
import Modal from '../../components/Components/Modal';

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPatientAdded: () => void; // Para atualizar a lista na página principal
}

const AddPatientModal: React.FC<AddPatientModalProps> = ({ isOpen, onClose, onPatientAdded }) => {
  const { currentUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name || !email) {
      setError("Nome e E-mail são obrigatórios.");
      return;
    }
    if (!currentUser) {
      setError("Você precisa estar logado para adicionar um paciente.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const newPatientData: NewPatientData = {
      name,
      email,
      phone,
      psychologistId: currentUser.uid,
    };

    try {
      await patientService.addPatient(newPatientData);
      onPatientAdded(); // Avisa o componente pai para recarregar os dados
      handleClose(); // Fecha e limpa o modal
    } catch (err) {
      setError("Ocorreu um erro ao adicionar o paciente.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Reseta o formulário ao fechar
    setName('');
    setEmail('');
    setPhone('');
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Adicionar Novo Paciente">
      <form onSubmit={handleSubmit} className="add-patient-form">
        <div className="form-group">
          <label htmlFor="patient-name">Nome Completo</label>
          <input
            id="patient-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome do paciente"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="patient-email">E-mail</label>
          <input
            id="patient-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@paciente.com"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="patient-phone">Telefone (Opcional)</label>
          <input
            id="patient-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(XX) XXXXX-XXXX"
          />
        </div>
        {error && <p className="form-error">{error}</p>}
        <div className="form-actions">
          <button type="button" className="button-secondary" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </button>
          <button type="submit" className="button-primary" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar Paciente'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddPatientModal;