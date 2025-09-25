import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles.css';
import { patientService } from '../../../src/services/patientService';
import { useAuth } from '../../../src/contexts/AuthContext';
import type { DiaryEntry } from '../../../src/types/DiaryEntry';

const PatientDiary: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    if (!currentUser) return;
    try {
      setIsLoading(true);
      const fetchedEntries = await patientService.getDiaryEntries(currentUser.uid);
      setEntries(fetchedEntries);
    } catch (err) {
      setError("Não foi possível carregar as entradas do diário.");
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);
  
  const renderEntries = () => {
    if (isLoading) return <p>Carregando entradas...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (entries.length === 0) {
      return <p>Você ainda não tem nenhuma entrada no diário. Que tal criar a primeira?</p>;
    }
    return (
      <div className="diary-list">
        {entries.map(entry => (
          <div key={entry.id} className="diary-entry-card" onClick={() => navigate(`/meu-diario/editar/${entry.id}`)}>
            <div className="entry-card-header">
              <h3>{entry.title}</h3>
              <span className={`privacy-status ${entry.shared ? 'shared' : 'private'}`}>
                {entry.shared ? 'Compartilhado' : 'Privado'}
              </span>
            </div>
            <p className="entry-card-content">{entry.content.substring(0, 150)}...</p>
            <p className="entry-card-date">
              Criado em: {entry.createdAt.toDate().toLocaleDateString('pt-BR')}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    // Idealmente, esta página usaria um PatientLayout, por enquanto usamos um div simples
    <div className="patient-diary-page">
      <header className="diary-header">
        <h1>Meu Diário</h1>
        <Link to="/meu-diario/novo" className="new-entry-button">
          + Nova Entrada
        </Link>
      </header>
      {renderEntries()}
    </div>
  );
};

export default PatientDiary;