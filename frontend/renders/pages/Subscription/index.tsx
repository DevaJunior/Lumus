import { loadStripe } from '@stripe/stripe-js';
import './styles.css';
import React, { useState } from 'react';
import { createStripeCheckoutSession } from '../../../src/services/firebaseFunctions';


// Coloque sua chave PUBLICÁVEL do Stripe aqui
const stripePromise = loadStripe('pk_test_51SCAeOKYLqMQDDUIVWwcj6WON9j8Ks7nb593MnXw0Tw5X4dZ2RQgjFWAEC6uDF6PyCcciei5Wu7niySYJ3p3O6FL00XS7R019c');

// No painel do Stripe, crie dois produtos (Básico e Premium) e adicione um preço recorrente a cada um. Pegue os IDs dos PREÇOS.
const plans = {
  basic: { name: 'Básico', priceId: 'price_1SCB60KYLqMQDDUIeJzfHUQ7' },
  premium: { name: 'Premium', priceId: 'price_1SCB6OKYLqMQDDUIk3nZBb9H' },
};

const Subscription: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectPlan = async (plan: 'basic' | 'premium') => {
    setIsLoading(true);
    try {
      const { data } = await createStripeCheckoutSession({ 
        plan: plan, 
        priceId: plans[plan].priceId 
      });
      const sessionId = (data as any).id;
      
      const stripe = await stripePromise;
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error("Erro ao redirecionar para o checkout:", error);
      alert("Não foi possível iniciar o pagamento.");
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
            {isLoading ? 'Aguarde...' : 'Selecionar Básico'}
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
            {isLoading ? 'Aguarde...' : 'Selecionar Premium'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Subscription;