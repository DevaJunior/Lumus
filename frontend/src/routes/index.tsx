import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../../renders/pages/Login';
import Register from '../../renders/pages/Register';
import ForgotPassword from '../../renders/pages/ForgotPassword';
import ProtectedRoute from './ProtectedRoute';
import PsychologistRoute from './PsychologistRoute';
import PatientRoute from './PatientRoute';
import HomeRedirect from './HomeRedirect';
import { useAuth } from '../contexts/AuthContext';

// Páginas
import Dashboard from '../../renders/pages/Dashboard';
import Patients from '../../renders/pages/Patients';
import PatientDetail from '../../renders/pages/PatientDetail';
import Agenda from '../../renders/pages/Agenda';
import Financeiro from '../../renders/pages/Financeiro';
import PatientDashboard from '../../renders/pages/PatientDashboard';
import PatientDiary from '../../renders/pages/PatientDiary';
import DiaryEditor from '../../renders/pages/DiaryEditor';

import DashboardLayout from '../../renders/pages/DashboardLayout';

const AppRoutes: React.FC = () => {
  const { currentUser, loading } = useAuth();

  // A tela de carregamento principal agora é controlada pelo AuthProvider,
  // mas podemos manter esta como uma segurança extra.
  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/login" element={currentUser ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/register" element={currentUser ? <Navigate to="/" replace /> : <Register />} />
        <Route path="/esqueci-minha-senha" element={currentUser ? <Navigate to="/" replace /> : <ForgotPassword />} />
        
        {/* Container para todas as rotas que exigem login */}
        <Route element={<ProtectedRoute />}>
          {/* Rota Raiz: Apenas redireciona baseado na função */}
          <Route path="/" element={<HomeRedirect />} />
          {/* Container para rotas de Psicólogo */}
          <Route element={<PsychologistRoute />}>
            <Route path="dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
            <Route path="pacientes" element={<DashboardLayout><Patients /></DashboardLayout>} />
            <Route path="pacientes/:patientId" element={<DashboardLayout><PatientDetail /></DashboardLayout>} />
            <Route path="agenda" element={<DashboardLayout><Agenda /></DashboardLayout>} />
            <Route path="financeiro" element={<DashboardLayout><Financeiro /></DashboardLayout>} />
          </Route>
          {/* Container para rotas de Paciente */}
          <Route element={<PatientRoute />}>
            <Route path="meu-dashboard" element={<PatientDashboard />} />
            <Route path="meu-diario" element={<PatientDiary />} />
            <Route path="meu-diario/novo" element={<DiaryEditor />} />
            <Route path="meu-diario/editar/:entryId" element={<DiaryEditor />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;