import React, { useState, useEffect, useRef, useCallback } from 'react';
import './styles.css';
import { useAuth } from '../../../src/contexts/AuthContext';
import type { Patient } from '../../../src/types/Patient';
import type { ChatMessage } from '../../../src/types/ChatMessage';
import { patientService } from '../../../src/services/patientService';
import { chatService } from '../../../src/services/chatService';

const Chat: React.FC = () => {
  const { currentUser } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentUser) return;
    const fetchPatients = async () => {
      try {
        const patientList = await patientService.getPatientsByPsychologist(currentUser.uid);
        setPatients(patientList);
      } catch (error) {
        console.error("Erro ao buscar pacientes:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatients();
  }, [currentUser]);

  useEffect(() => {
    // Se um paciente for selecionado, se inscreve no chat dele
    if (selectedPatient && currentUser) {
      const chatId = chatService.getChatId(currentUser.uid, selectedPatient.id);
      const unsubscribe = chatService.subscribeToChatMessages(chatId, (newMessages) => {
        setMessages(newMessages);
      });
      // Cancela a inscrição ao trocar de paciente ou desmontar o componente
      return () => unsubscribe();
    }
  }, [selectedPatient, currentUser]);

  useEffect(() => {
    // Rola para a última mensagem
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage && selectedPatient && currentUser) {
      const chatId = chatService.getChatId(currentUser.uid, selectedPatient.id);
      await chatService.sendMessage(chatId, currentUser.uid, newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="chat-page-container">
      <aside className="patient-list-sidebar">
        <header>
          <h3>Conversas</h3>
        </header>
        <ul>
          {isLoading ? <p>Carregando...</p> : patients.map(patient => (
            <li 
              key={patient.id} 
              className={selectedPatient?.id === patient.id ? 'active' : ''}
              onClick={() => setSelectedPatient(patient)}
            >
              {patient.name}
            </li>
          ))}
        </ul>
      </aside>
      <main className="chat-area">
        {selectedPatient ? (
          <>
            <header className="chat-header">
              <h3>{selectedPatient.name}</h3>
            </header>
            <div className="messages-container">
              {messages.map(msg => (
                <div key={msg.id} className={`message-bubble ${msg.senderId === currentUser?.uid ? 'sent' : 'received'}`}>
                  <p>{msg.text}</p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form className="message-input-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
              />
              <button type="submit">Enviar</button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <p>Selecione um paciente para iniciar a conversa.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Chat;