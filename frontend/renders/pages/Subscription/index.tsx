import React, { useState } from 'react';
import './styles.css';
import { useAuth } from '../../../src/contexts/AuthContext';
import { userService } from '../../../src/services/userService';

const Subscription: React.FC = () => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectPlan = async (plan: 'basic' | 'premium') => {
    if (!currentUser) return;

    setIsLoading(true);
    try {
      await userService.updateUserSubscription(currentUser.uid, plan);
      alert(`Plano ${plan} ativado com sucesso! Você será redirecionado.`);
      // Força um recarregamento para o AuthContext pegar o novo status
      window.location.href = '/dashboard';
    } catch (error) {
      alert("Erro ao ativar o plano.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="subscription-page">
      <h1>Escolha seu Plano</h1>
      <p>Selecione o plano que melhor se adapta às suas necessidades para ter acesso completo à plataforma.</p>
      <div className="plans-container">
        <div className="plan-card">
          <h2>Plano Básico</h2>
          <p className="price">R$ 49,90<span>/mês</span></p>
          <ul>
            <li>Até 10 pacientes ativos</li>
            <li>Agenda e Prontuários</li>
            <li>Consultas por Vídeo</li>
          </ul>
          <button onClick={() => handleSelectPlan('basic')} disabled={isLoading}>
            Selecionar Básico
          </button>
        </div>
        <div className="plan-card premium">
          <h2>Plano Premium</h2>
          <p className="price">R$ 89,90<span>/mês</span></p>
          <ul>
            <li>Pacientes ilimitados</li>
            <li>Agenda e Prontuários</li>
            <li>Consultas por Vídeo</li>
            <li>Relatórios Financeiros Avançados</li>
          </ul>
          <button onClick={() => handleSelectPlan('premium')} disabled={isLoading}>
            Selecionar Premium
          </button>
        </div>
      </div>
    </div>
  );
};

export default Subscription;