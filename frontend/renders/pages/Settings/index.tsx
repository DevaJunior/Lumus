import './styles.css';
import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const Settings: React.FC = () => {
  return (
    <div className="settings-layout">
      <aside className="settings-sidebar">
        <nav>
          <NavLink to="/configuracoes/aparencia" className={({ isActive }) => isActive ? 'settings-nav-link active' : 'settings-nav-link'}>
            Aparência
          </NavLink>
          <NavLink to="/configuracoes/horarios" className={({ isActive }) => isActive ? 'settings-nav-link active' : 'settings-nav-link'}>
            Horários
          </NavLink>
          <NavLink to="/configuracoes/notificacoes" className={({ isActive }) => isActive ? 'settings-nav-link active' : 'settings-nav-link'}>
            Notificações
          </NavLink>
        </nav>
      </aside>
      <main className="settings-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Settings;