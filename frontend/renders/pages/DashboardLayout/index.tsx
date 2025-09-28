import React, { useState, type ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './styles.css';
import { useAuth } from '../../../src/contexts/AuthContext';
import { authService } from '../../../src/services/authService';
import { useTheme } from '../../../src/contexts/ThemeContext';
import NotificationBell from '../../components/Components/NotificationBell';
import { MenuIcon } from '../../components/Components/Icons';
import { useSettings } from '../../../src/contexts/SettingsContext';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const { currentUser } = useAuth();
  const { sidebarBehavior } = useSettings();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const layoutRootClass = `layout-root ${sidebarBehavior === 'fixed' ? 'sidebar-fixed' : ''}`;

  return (
    <div className={layoutRootClass}>
      <div
        className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          {/* Este logo é para a sidebar quando ela está aberta */}
          <h1 className="sidebar-logo">Lumus</h1>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/perfil" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Perfil
          </NavLink>
          <NavLink to="/dashboard" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
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
          <NavLink to="/assinatura" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Assinatura
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          {/* <div className="user-profile">
            <span>{currentUser?.email}</span>
            <button onClick={handleLogout} className="logout-button">Sair</button>
          </div> */}

          <NavLink to="/configuracoes" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Configurações
          </NavLink>
          <button onClick={handleLogout} className="logout-button">Sair</button>
        </div>
      </aside>

      <div className="content-wrapper">
        <header className="topbar">
          <div className="topbar-left">
            <h1 className="topbar-logo">Lumus</h1>
          </div>
          <div className="topbar-center">
            <h2 className="topbar-title">{title}</h2>
          </div>
          <div className="topbar-right">
            <NotificationBell />
            <button className="menu-button" onClick={() => setIsSidebarOpen(true)}>
              <MenuIcon />
            </button>
          </div>
        </header>
        <main className="page-content-area">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;