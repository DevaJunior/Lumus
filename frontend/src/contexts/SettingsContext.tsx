import React, { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';

type SidebarBehavior = 'retractable' | 'fixed';

interface SettingsContextType {
  sidebarBehavior: SidebarBehavior;
  setSidebarBehavior: (behavior: SidebarBehavior) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sidebarBehavior, setSidebarBehavior] = useState<SidebarBehavior>(() => {
    // Busca a preferência salva ou usa 'fixed' como padrão
    return (localStorage.getItem('lumus-sidebar-behavior') as SidebarBehavior) || 'fixed';
  });

  useEffect(() => {
    // Salva a preferência no localStorage sempre que ela mudar
    localStorage.setItem('lumus-sidebar-behavior', sidebarBehavior);
  }, [sidebarBehavior]);

  const value = useMemo(() => ({ sidebarBehavior, setSidebarBehavior }), [sidebarBehavior]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};