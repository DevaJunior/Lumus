import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './styles.css';
import { authService } from '../../../src/services/authService';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      await authService.register(email, password);
      navigate('/'); // Redireciona para o dashboard após o registro bem-sucedido
    } catch (err) {
      // Aqui você pode tratar erros específicos do Firebase, como "email-already-in-use"
      setError('Falha ao criar a conta. O e-mail pode já estar em uso.');
      console.error(err);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Lumus</h2>
        <p>Crie sua conta de profissional</p>
        <form onSubmit={handleRegister}>
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
          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              placeholder="Crie uma senha forte"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Repita sua senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="register-button">
            Cadastrar
          </button>
        </form>
        <div className="redirect-link">
          <p>
            Já tem uma conta? <Link to="/login">Faça login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;