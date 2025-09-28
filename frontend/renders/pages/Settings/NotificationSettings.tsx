import React from 'react';

const NotificationSettings: React.FC = () => {
  return (
    <div className="settings-section">
      <div className="section-header">
        <h3>Preferências de Notificação</h3>
        <p>Escolha como você gostaria de ser notificado sobre as atividades na plataforma.</p>
      </div>
      <div className="section-content">
        <p>As configurações detalhadas de notificação (por e-mail, push, etc.) estarão disponíveis aqui em uma futura atualização.</p>
        {/* Aqui entrarão os toggles e opções no futuro */}
      </div>
    </div>
  );
};

export default NotificationSettings;