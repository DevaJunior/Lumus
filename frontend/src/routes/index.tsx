import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../../renders/pages/Login';
import Register from '../../renders/pages/Register';
import ForgotPassword from '../../renders/pages/ForgotPassword';
import ProtectedRoute from './ProtectedRoute';
import PsychologistRoute from './PsychologistRoute'; // IMPORTA O GUARDIÃO
import PatientRoute from './PatientRoute';       // IMPORTA O GUARDIÃO
import { useAuth } from '../contexts/AuthContext';

// Páginas do Psicólogo
import Dashboard from '../../renders/pages/Dashboard';
import Patients from '../../renders/pages/Patients';
import PatientDetail from '../../renders/pages/PatientDetail';
import Agenda from '../../renders/pages/Agenda';
import Financeiro from '../../renders/pages/Financeiro';

// Páginas do Paciente
import PatientDashboard from '../../renders/pages/PatientDashboard';
import DashboardLayout from '../../renders/pages/DashboardLayout';

const AppRoutes: React.FC = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Carregando plataforma...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/login" element={currentUser ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/register" element={currentUser ? <Navigate to="/" replace /> : <Register />} />
        <Route path="/esqueci-minha-senha" element={currentUser ? <Navigate to="/" replace /> : <ForgotPassword />} />
        
        {/* Container para todas as rotas que exigem login */}
        <Route path="/" element={<ProtectedRoute />}>

          {/* Container para rotas de Psicólogo */}
          <Route element={<PsychologistRoute />}>
            <Route path="/" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
            <Route path="pacientes" element={<DashboardLayout><Patients /></DashboardLayout>} />
            <Route path="pacientes/:patientId" element={<DashboardLayout><PatientDetail /></DashboardLayout>} />
            <Route path="agenda" element={<DashboardLayout><Agenda /></DashboardLayout>} />
            <Route path="financeiro" element={<DashboardLayout><Financeiro /></DashboardLayout>} />
          </Route>

          {/* Container para rotas de Paciente */}
          <Route element={<PatientRoute />}>
            {/* O layout do paciente pode ser mais simples ou um novo componente */}
            <Route path="meu-dashboard" element={<PatientDashboard />} />
            {/* Futuramente: <Route path="meu-diario" element={<PatientDiary />} /> */}
          </Route>

        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;