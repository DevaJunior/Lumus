import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './styles.css';
import { useAuth } from '../../../src/contexts/AuthContext';
import { patientService } from '../../../src/services/patientService';
import type { NewDiaryEntryData, UpdateDiaryEntryData } from '../../../src/types/DiaryEntry';

const DiaryEditor: React.FC = () => {
  const { entryId } = useParams<{ entryId?: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isShared, setIsShared] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(entryId);

  useEffect(() => {
    if (isEditing && currentUser && entryId) {
      const fetchEntry = async () => {
        try {
          const entry = await patientService.getDiaryEntryById(currentUser.uid, entryId);
          if (entry) {
            setTitle(entry.title);
            setContent(entry.content);
            setIsShared(entry.shared);
          } else {
            setError("Entrada do diário não encontrada.");
          }
        } catch (err) {
          setError("Erro ao carregar a entrada do diário.");
        } finally {
          setIsFetching(false);
        }
      };
      fetchEntry();
    } else {
      setIsFetching(false);
    }
  }, [isEditing, entryId, currentUser]);

  const handleSave = async () => {
    if (!currentUser || !title || !content) {
      setError("Título e conteúdo são obrigatórios.");
      return;
    }
    setIsLoading(true);

    try {
      if (isEditing) {
        // CORREÇÃO: Adicionamos esta linha para garantir que entryId não é undefined
        if (!entryId) return;

        const entryData: UpdateDiaryEntryData = { title, content, shared: isShared };
        await patientService.updateDiaryEntry(currentUser.uid, entryId, entryData);
      } else {
        const entryData: NewDiaryEntryData = { title, content, shared: isShared };
        await patientService.addDiaryEntry(currentUser.uid, entryData);
      }
      navigate('/meu-diario');
    } catch (err) {
      setError("Não foi possível salvar a entrada.");
    } finally {
      setIsLoading(false);
    }
  };

  // NOVA FUNÇÃO PARA EXCLUIR
  const handleDelete = async () => {
    if (!isEditing || !currentUser || !entryId) return;

    if (window.confirm("Tem certeza que deseja excluir esta entrada? Esta ação não pode ser desfeita.")) {
      setIsLoading(true);
      try {
        await patientService.deleteDiaryEntry(currentUser.uid, entryId);
        navigate('/meu-diario');
      } catch (err) {
        setError("Não foi possível excluir a entrada.");
        setIsLoading(false);
      }
    }
  };

  if (isFetching) {
    return <div>Carregando editor...</div>;
  }

  return (
    <div className="diary-editor-page">
      <h2>{isEditing ? 'Editar Entrada' : 'Nova Entrada no Diário'}</h2>
      <div className="editor-form">
        <div className="form-group">
          <label htmlFor="title">Título</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="content">Conteúdo</label>
          <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={15}></textarea>
        </div>
        <div className="form-group-inline">
          <label htmlFor="share">Compartilhar com o psicólogo?</label>
          <input type="checkbox" id="share" checked={isShared} onChange={(e) => setIsShared(e.target.checked)} className="share-toggle" />
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="editor-actions">
          {isEditing && (
            <button onClick={handleDelete} className="delete-button" disabled={isLoading}>
              Excluir
            </button>
          )}
          <button onClick={() => navigate('/meu-diario')} className="button-secondary">Cancelar</button>
          <button onClick={handleSave} className="button-primary" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiaryEditor;