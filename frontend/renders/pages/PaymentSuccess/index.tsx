import React from 'react';
import { Link } from 'react-router-dom';

const PaymentSuccess: React.FC = () => (
  <div style={{ textAlign: 'center', padding: '50px' }}>
    <h1>Pagamento Concluído!</h1>
    <p>Sua assinatura foi ativada com sucesso. Você já pode usar todos os recursos.</p>
    <Link to="/dashboard">Voltar para o Início</Link>
  </div>
);

export default PaymentSuccess;