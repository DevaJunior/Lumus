import React, { type ReactNode } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './styles.css';
import { useTheme } from '../../../src/contexts/ThemeContext';
import { useAuth } from '../../../src/contexts/AuthContext';
import { authService } from '../../../src/services/authService';

// 2. Remove a necessidade da interface, já que não usamos mais 'children' como prop
const AdminLayout: React.FC = () => {
  const { currentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  return (
    <div className="admin-layout-container">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h1 className="admin-sidebar-logo">Lumus (Admin)</h1>
        </div>
        <nav className="admin-sidebar-nav">
          <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/psicologos" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Psicólogos
          </NavLink>
        </nav>
        <div className="admin-sidebar-footer">
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
      <main className="admin-main-content">
        {/* 3. Substitui {children} por <Outlet /> */}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;