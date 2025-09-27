import React, { useState, useEffect, useCallback } from 'react';
import './styles.css';
import { adminService, type PsychologistData } from '../../../src/services/adminService';

const ManagePsychologists: React.FC = () => {
  const [psychologists, setPsychologists] = useState<PsychologistData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPsychologists = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getAllPsychologists();
      setPsychologists(data);
    } catch (err) {
      setError("Não foi possível carregar a lista.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPsychologists();
  }, [fetchPsychologists]);

  const handleApprove = async (uid: string) => {
    if (window.confirm("Tem certeza que deseja aprovar este psicólogo?")) {
      await adminService.updatePsychologistStatus(uid, 'approved');
      fetchPsychologists(); // Recarrega a lista
    }
  };

  return (
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
                <th>UID do Usuário</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {psychologists.map(psy => (
                <tr key={psy.uid}>
                  <td data-label="UID">{psy.uid}</td>
                  <td data-label="Status">
                    <span className={`status-badge status-${psy.status}`}>
                      {psy.status === 'pending' ? 'Pendente' : 'Aprovado'}
                    </span>
                  </td>
                  <td data-label="Ações">
                    {psy.status === 'pending' && (
                      <button className="approve-button" onClick={() => handleApprove(psy.uid)}>
                        Aprovar
                      </button>
                    )}
                  </td>
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