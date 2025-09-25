import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import { authService } from '../../../src/services/authService';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      await authService.sendPasswordResetEmail(email);
      setMessage("Se existir uma conta com este e-mail, um link para redefinir a senha foi enviado.");
    } catch (err) {
      setError("Ocorreu um erro. Tente novamente.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h2>Redefinir Senha</h2>
        <p>Insira seu e-mail para receber um link de redefinição.</p>
        <form onSubmit={handleResetPassword}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="reset-button" disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Enviar Link'}
          </button>
        </form>
        <div className="redirect-link">
          <p>
            Lembrou a senha? <Link to="/login">Voltar para o Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;