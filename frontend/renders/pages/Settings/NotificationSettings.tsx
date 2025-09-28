import React, { useState } from 'react';

// Este componente precisa ser criado ou importado de um arquivo de componentes reutilizáveis
const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void; }> = ({ checked, onChange }) => (
    <label className="toggle-switch">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="slider"></span>
    </label>
);

const NotificationSettings: React.FC = () => {
    // Adicionando estado para controlar os toggles, como no exemplo de design
    const [newsletter, setNewsletter] = useState(false);
    const [reports, setReports] = useState(true);

    return (
        <div className="settings-section">
            <div className="section-header">
                <h3>Preferências de Notificação</h3>
                <p>Escolha como você gostaria de ser notificado.</p>
            </div>
            <div className="section-content">
                <div className="setting-item">
                    <div className="setting-item-info">
                        <span>Our Newsletter</span>
                        <p>Nós lhe informaremos sobre mudanças importantes.</p>
                    </div>
                    <div className="setting-item-action">
                        <ToggleSwitch checked={newsletter} onChange={() => setNewsletter(p => !p)} />
                    </div>
                </div>
                <div className="setting-item">
                    <div className="setting-item-info">
                        <span>Statistics Reports</span>
                        <p>Um boletim informativo que oferece análises aprofundadas sobre tendências.</p>
                    </div>
                    <div className="setting-item-action">
                        <ToggleSwitch checked={reports} onChange={() => setReports(p => !p)} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationSettings;
