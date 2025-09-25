import React, { useState, useEffect } from 'react';
import './styles.css';
import { adminService, type PsychologistData } from '../../../src/services/adminService';

const ManagePsychologists: React.FC = () => {
  const [psychologists, setPsychologists] = useState<PsychologistData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPsychologists = async () => {
      try {
        const data = await adminService.getAllPsychologists();
        setPsychologists(data);
      } catch (err) {
        setError("Não foi possível carregar a lista.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPsychologists();
  }, []);

  return (
    // Para o MVP, não usaremos um layout complexo de admin
    <div className="admin-page">
      <h1>Gerenciar Psicólogos</h1>
      <p>Abaixo está a lista de todos os psicólogos cadastrados na plataforma.</p>
      <div className="admin-table-container">
        {isLoading && <p>Carregando...</p>}
        {error && <p className="error-message">{error}</p>}
        {!isLoading && !error && (
          <table className="admin-table">
            <thead>
              <tr>
                <th>UID do Usuário (ID de Autenticação)</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {psychologists.map(psy => (
                <tr key={psy.uid}>
                  <td>{psy.uid}</td>
                  <td><span className="status-active">Ativo</span></td>
                  <td><button disabled>Gerenciar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManagePsychologists;