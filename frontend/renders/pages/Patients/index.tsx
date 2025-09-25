import React, { useState, useEffect, useCallback } from 'react';
import AddPatientModal from '../../modals/AddPatientModal';
import './styles.css';
import type { Patient } from '../../../src/types/Patient';
import { useAuth } from '../../../src/contexts/AuthContext';
import { patientService } from '../../../src/services/patientService';
import DashboardLayout from '../DashboardLayout';
import { useNavigate } from 'react-router-dom';

const Patients: React.FC = () => {
  const { currentUser } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate(); // Inicializa o hook de navegação

  const fetchPatients = useCallback(async () => {
    if (currentUser) {
      try {
        setIsLoading(true);
        const patientList = await patientService.getPatientsByPsychologist(currentUser.uid);
        setPatients(patientList);
      } catch (err) {
        setError("Não foi possível carregar a lista de pacientes.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handlePatientAdded = () => {
    fetchPatients();
  };

  const handleRowClick = (patientId: string) => {
    navigate(`/pacientes/${patientId}`); // Função para navegar
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="loading-state">Carregando pacientes...</div>;
    }
    if (error) {
      return <div className="error-state">{error}</div>;
    }
    if (patients.length === 0) {
      return (
        <div className="empty-state">
          <h3>Nenhum paciente encontrado</h3>
          <p>Clique em "Adicionar Paciente" para começar a cadastrar.</p>
        </div>
      );
    }
    return (
      <table className="patients-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            // Adiciona onClick e classe para indicar que é clicável
            <tr key={patient.id} onClick={() => handleRowClick(patient.id)} className="clickable-row">
              <td data-label="Nome">{patient.name}</td>
              <td data-label="Email">{patient.email}</td>
              <td data-label="Telefone">{patient.phone || 'Não informado'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <DashboardLayout>
      <div className="patients-page">
        <header className="patients-header">
          <h1>Meus Pacientes</h1>
          <button className="add-patient-button" onClick={() => setIsModalOpen(true)}>
            + Adicionar Paciente
          </button>
        </header>
        <div className="patients-list-container">
          {renderContent()}
        </div>
      </div>
      <AddPatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPatientAdded={handlePatientAdded}
      />
    </DashboardLayout>
  );
};

export default Patients;