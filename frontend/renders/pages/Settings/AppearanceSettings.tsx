import React from 'react';
import { useTheme } from '../../../src/contexts/ThemeContext';
import { useSettings } from '../../../src/contexts/SettingsContext';

const AppearanceSettings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { sidebarBehavior, setSidebarBehavior } = useSettings();

  return (
    <>
      <div className="settings-section">
        <div className="section-header">
          <h3>Tema da Interface</h3>
          <p>Escolha entre o tema claro ou escuro para a plataforma.</p>
        </div>
        <div className="section-content">
          <div className="setting-option">
            <span>Tema Atual: <strong>{theme === 'light' ? 'Claro' : 'Escuro'}</strong></span>
            <button className="settings-button" onClick={toggleTheme}>
              Alterar Tema
            </button>
          </div>
        </div>
      </div>
      <div className="settings-section">
        <div className="section-header">
          <h3>Comportamento do Menu Lateral</h3>
          <p>Escolha como o menu principal deve se comportar em telas grandes (acima de 1024px).</p>
        </div>
        <div className="section-content">
          <div className="radio-group">
            <label className="radio-label">
              <input 
                type="radio" 
                name="sidebar" 
                value="fixed" 
                checked={sidebarBehavior === 'fixed'}
                onChange={() => setSidebarBehavior('fixed')}
              />
              Fixo (sempre visível)
            </label>
            <label className="radio-label">
              <input 
                type="radio" 
                name="sidebar" 
                value="retractable"
                checked={sidebarBehavior === 'retractable'}
                onChange={() => setSidebarBehavior('retractable')}
              />
              Retrátil (ativado por botão)
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppearanceSettings;