import React, { type ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './styles.css';
import { useAuth } from '../../../src/contexts/AuthContext';
import { authService } from '../../../src/services/authService';
import { useTheme } from '../../../src/contexts/ThemeContext';
import NotificationBell from '../../components/Components/NotificationBell';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <div className="layout-container">
      <aside className="sidebar">
        {/* ... (código da sidebar header e nav) ... */}
        <div className="sidebar-header">
          <h1 className="sidebar-logo">Lumus</h1>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Início
          </NavLink>
          <NavLink to="/mensagens" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Mensagens
          </NavLink>
          <NavLink to="/pacientes" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Pacientes
          </NavLink>
          <NavLink to="/agenda" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Agenda
          </NavLink>
          <NavLink to="/financeiro" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Financeiro
          </NavLink>
          <NavLink to="/configuracoes" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Configurações
          </NavLink>
          <NavLink to="/assinatura" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Assinatura
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <div className="theme-toggle">
            <span>Tema: {theme === 'light' ? 'Claro' : 'Escuro'}</span>
            <button onClick={toggleTheme} className="theme-toggle-button">
              Alterar Tema
            </button>
          </div>
          <div className="user-profile">
            <span>{currentUser?.email}</span>
            <button onClick={handleLogout} className="logout-button">Sair</button>
          </div>
        </div>
      </aside>
      <main className="main-content">
        <header className="main-content-header">
          <NotificationBell />
        </header>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;