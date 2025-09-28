import './styles.css';
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';


const NotificationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
);
const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);
const AppearanceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
);

const Settings: React.FC = () => {
    const navItems = [
        { path: '/configuracoes/notificacoes', label: 'Notificações', icon: <NotificationIcon /> },
        { path: '/configuracoes/horarios', label: 'Horários', icon: <ClockIcon /> },
        { path: '/configuracoes/aparencia', label: 'Aparência', icon: <AppearanceIcon /> },
    ];

    return (
        <>
            <div className="settings-wrapper">
                <h1>Configurações Gerais</h1>
                <div className="settings-layout">
                    <aside className="settings-sidebar">
                        <nav>
                            {navItems.map(item => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) => isActive ? 'settings-nav-link active' : 'settings-nav-link'}
                                >
                                    <span className="icon">{item.icon}</span>
                                    <span className="label">{item.label}</span>
                                    {/* <span className="status-icon"><CheckCircleIcon /></span> */}
                                </NavLink>
                            ))}
                        </nav>
                    </aside>
                    <main className="settings-content">
                        <Outlet />
                    </main>
                </div>
            </div>
        </>
    );
};

export default Settings;

