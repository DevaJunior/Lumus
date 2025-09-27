import React, { useState, useEffect, useRef } from 'react';
import './styles.css';
import { chatService } from '../../../src/services/chatService';
import type { Patient } from '../../../src/types/Patient';
import type { ChatMessage } from '../../../src/types/ChatMessage';
import { useAuth } from '../../../src/contexts/AuthContext';

const PatientChat: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const patientProfile = userProfile as Patient;

  useEffect(() => {
    if (currentUser && patientProfile?.psychologistId) {
      const psychologistId = patientProfile.psychologistId;
      const chatId = chatService.getChatId(currentUser.uid, psychologistId);

      const unsubscribe = chatService.subscribeToChatMessages(chatId, (newMessages) => {
        setMessages(newMessages);
      });

      return () => unsubscribe();
    }
  }, [currentUser, patientProfile]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage && currentUser && patientProfile?.psychologistId) {
      const psychologistId = patientProfile.psychologistId;
      const chatId = chatService.getChatId(currentUser.uid, psychologistId);
      await chatService.sendMessage(chatId, currentUser.uid, newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="patient-chat-page">
      <header className="chat-header">
        <h3>Conversa com seu Psicólogo</h3>
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
    </div>
  );
};

export default PatientChat;