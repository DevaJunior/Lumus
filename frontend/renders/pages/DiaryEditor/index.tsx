import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './styles.css';
import { useAuth } from '../../../src/contexts/AuthContext';
import type { NewDiaryEntryData } from '../../../src/types/DiaryEntry';
import { patientService } from '../../../src/services/patientService';

const DiaryEditor: React.FC = () => {
  const { entryId } = useParams<{ entryId?: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isShared, setIsShared] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lógica para buscar a entrada se estivermos editando
  // ... (implementação futura)

  const handleSave = async () => {
    if (!currentUser || !title || !content) {
      setError("Título e conteúdo são obrigatórios.");
      return;
    }
    setIsLoading(true);
    try {
      const entryData: NewDiaryEntryData = { title, content, shared: isShared };
      await patientService.addDiaryEntry(currentUser.uid, entryData);
      navigate('/meu-diario');
    } catch (err) {
      setError("Não foi possível salvar a entrada.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="diary-editor-page">
      <h2>{entryId ? 'Editar Entrada' : 'Nova Entrada no Diário'}</h2>
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