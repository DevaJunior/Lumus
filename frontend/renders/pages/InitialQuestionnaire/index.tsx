import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import type { QuestionnaireAnswers } from '../../../src/types/Patient';
import { useAuth } from '../../../src/contexts/AuthContext';
import { patientService } from './../../../src/services/patientService';

// Para o MVP, as perguntas são definidas aqui. No futuro, poderiam vir do banco de dados.
const questions = [
  { id: 'main_reason', text: 'Qual o principal motivo que te trouxe à terapia?', type: 'textarea' },
  { id: 'mood_level', text: 'Numa escala de 1 a 10, como você avalia seu humor na última semana?', type: 'number', min: 1, max: 10 },
  { id: 'symptoms', text: 'Você tem experienciado ansiedade, estresse ou desânimo com frequência?', type: 'radio', options: ['Sim', 'Não', 'Às vezes'] },
  { id: 'previous_therapy', text: 'Você já fez terapia antes?', type: 'radio', options: ['Sim', 'Não'] },
  { id: 'expectations', text: 'O que você espera alcançar com a terapia?', type: 'textarea' },
];

const InitialQuestionnaire: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (id: string, value: string | number) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentUser) return;

    setIsLoading(true);
    try {
      await patientService.saveQuestionnaireAnswers(currentUser.uid, answers);
      navigate('/meu-dashboard'); // Redireciona após salvar
    } catch (error) {
      console.error("Erro ao salvar questionário:", error);
      alert("Não foi possível salvar suas respostas. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="questionnaire-container">
      <div className="questionnaire-card">
        <h1>Questionário Inicial</h1>
        <p>Olá! Para começarmos, por favor, responda a algumas perguntas. Suas respostas são confidenciais e ajudarão seu psicólogo a te conhecer melhor.</p>
        <form onSubmit={handleSubmit}>
          {questions.map(q => (
            <div key={q.id} className="question-group">
              <label htmlFor={q.id}>{q.text}</label>
              {q.type === 'textarea' && (
                <textarea id={q.id} rows={4} onChange={e => handleInputChange(q.id, e.target.value)} required />
              )}
              {q.type === 'number' && (
                <input type="number" id={q.id} min={q.min} max={q.max} onChange={e => handleInputChange(q.id, parseInt(e.target.value))} required />
              )}
              {q.type === 'radio' && (
                <div className="radio-group">
                  {q.options?.map(opt => (
                    <label key={opt} className="radio-label">
                      <input type="radio" name={q.id} value={opt} onChange={e => handleInputChange(q.id, e.target.value)} required />
                      {opt}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Enviar Respostas'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InitialQuestionnaire;