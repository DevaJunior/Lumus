import React from 'react';
import './styles.css';
import { useAuth } from '../../../src/contexts/AuthContext';

const Profile: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <>
      <div className="profile-page">
        <div className="profile-card">
          <h2>Informações da Conta</h2>
          <div className="info-group">
            <label>E-mail</label>
            <p>{currentUser?.email}</p>
          </div>
          <div className="info-group">
            <label>UID do Usuário</label>
            <p className="uid-text">{currentUser?.uid}</p>
          </div>
          {/* Futuramente, campos para alterar senha, etc., podem ser adicionados aqui */}
        </div>
      </div>
    </>
  );
};

export default Profile;