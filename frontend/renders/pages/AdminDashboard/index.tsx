import React, { useState, useEffect } from 'react';
import './styles.css';
import { adminService, type PlatformStats } from '../../../src/services/adminService';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getPlatformStats();
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="admin-dashboard-page">
      <h1>Dashboard do Administrador</h1>
      <p>Visão geral da plataforma Lumus.</p>
      {isLoading ? <p>Carregando estatísticas...</p> : stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h2>Psicólogos Cadastrados</h2>
            <p>{stats.psychologistCount}</p>
          </div>
          <div className="stat-card">
            <h2>Pacientes na Plataforma</h2>
            <p>{stats.patientCount}</p>
          </div>
          <div className="stat-card">
            <h2>Consultas Agendadas</h2>
            <p>{stats.appointmentCount}</p>
          </div>
          <div className="stat-card">
            <h2>Receita Total Registrada</h2>
            <p>{formatCurrency(stats.totalRevenue)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;