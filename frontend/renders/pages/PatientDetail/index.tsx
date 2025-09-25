import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import './styles.css';
import { useAuth } from '../../../src/contexts/AuthContext';
import type { Patient } from '../../../src/types/Patient';
import type { SessionNote } from '../../../src/types/SessionNote';
import { patientService } from '../../../src/services/patientService';
import DashboardLayout from '../DashboardLayout';

const PatientDetail: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const { currentUser } = useAuth();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [notes, setNotes] = useState<SessionNote[]>([]);
  const [newNoteContent, setNewNoteContent] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!patientId || !currentUser) return;

    try {
      setIsLoading(true);
      setError(null);
      // Busca dados do paciente e anotações em paralelo
      const [patientData, notesData] = await Promise.all([
        patientService.getPatientById(patientId),
        patientService.getSessionNotes(patientId)
      ]);

      if (patientData && patientData.psychologistId === currentUser.uid) {
        setPatient(patientData);
        setNotes(notesData);
      } else {
        setError("Paciente não encontrado ou não pertence a você.");
      }
    } catch (err) {
      setError("Ocorreu um erro ao carregar os dados.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [patientId, currentUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleNoteSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!patientId || !newNoteContent.trim()) return;

    setIsSubmittingNote(true);
    try {
      await patientService.addSessionNote(patientId, { content: newNoteContent });
      setNewNoteContent(''); // Limpa o campo
      await fetchData(); // Recarrega os dados para mostrar a nova nota
    } catch (err) {
      setError("Falha ao salvar a anotação.");
    } finally {
      setIsSubmittingNote(false);
    }
  };

  if (isLoading) {
    return <DashboardLayout><div className="loading-state">Carregando prontuário...</div></DashboardLayout>;
  }

  if (error) {
    return <DashboardLayout><div className="error-state">{error}</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="patient-detail-page">
        <header className="detail-header">
          <div className="patient-info">
            <h1>{patient?.name}</h1>
            <p>{patient?.email}</p>
            <p>{patient?.phone || 'Telefone não informado'}</p>
          </div>
        </header>

        <section className="new-note-section">
          <h2>Nova Anotação de Sessão</h2>
          <form onSubmit={handleNoteSubmit} className="new-note-form">
            <textarea
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="Digite suas anotações sobre a sessão aqui..."
              rows={8}
              required
            />
            <button type="submit" disabled={isSubmittingNote}>
              {isSubmittingNote ? 'Salvando...' : 'Salvar Anotação'}
            </button>
          </form>
        </section>

        <section className="notes-history-section">
          <h2>Histórico de Sessões</h2>
          <div className="notes-list">
            {notes.length > 0 ? (
              notes.map(note => (
                <div key={note.id} className="note-card">
                  <p className="note-date">
                    {note.createdAt ? new Date(note.createdAt.seconds * 1000).toLocaleDateString('pt-BR', {
                      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    }) : 'Data indisponível'}
                  </p>
                  <p className="note-content">{note.content}</p>
                </div>
              ))
            ) : (
              <p>Nenhuma anotação encontrada para este paciente.</p>
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default PatientDetail;