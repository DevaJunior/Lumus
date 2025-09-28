import React from 'react';
import { useTheme } from '../../../src/contexts/ThemeContext';
import { useSettings } from '../../../src/contexts/SettingsContext';

// Este componente precisa ser criado ou importado de um arquivo de componentes reutilizáveis
const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void; }> = ({ checked, onChange }) => (
  <label className="toggle-switch">
    <input type="checkbox" checked={checked} onChange={onChange} />
    <span className="slider"></span>
  </label>
);

const AppearanceSettings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { sidebarBehavior, setSidebarBehavior } = useSettings();

  return (
    <div className="settings-section">
      <div className="section-header">
        <h3>Aparência</h3>
        <p>Personalize a aparência da interface.</p>
      </div>
      <div className="section-content">
        <div className="setting-item">
          <div className="setting-item-info">
            <span>Modo Escuro</span>
            <p>Alterne entre o tema claro e escuro.</p>
          </div>
          <div className="setting-item-action">
            {/* A lógica original foi mantida, mas aplicada ao novo componente de toggle */}
            <ToggleSwitch checked={theme === 'dark'} onChange={toggleTheme} />
          </div>
        </div>
        <div className="setting-item">
          <div className="setting-item-info">
            <span>Comportamento do Menu Lateral</span>
            <p>Escolha como o menu principal deve se comportar em telas grandes (acima de 1024px).</p>
          </div>
          <div className="setting-item-action">
            {/* Utilizando um select estilizado para manter a lógica original */}
            <select
              value={sidebarBehavior}
              onChange={(e) => setSidebarBehavior(e.target.value as 'fixed' | 'retractable')}
              className="settings-select"
            >
              <option value="fixed">Fixo (sempre visível)</option>
              <option value="retractable">Retrátil (ativado por botão)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;
