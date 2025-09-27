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
import InitialQuestionnaire from '../../renders/pages/InitialQuestionnaire';
import AdminRoute from './AdminRoute';
import ManagePsychologists from '../../renders/pages/ManagePsychologists';
import PatientAppointments from '../../renders/pages/PatientAppointments';
import Settings from '../../renders/pages/Settings';
import RequestAppointment from '../../renders/pages/RequestAppointment';
import PatientFinancials from '../../renders/pages/PatientFinancials';
import VideoCall from '../../renders/pages/VideoCall';
import Subscription from '../../renders/pages/Subscription';
import Chat from '../../renders/pages/Chat';
import AdminLayout from '../../renders/pages/AdminLayout';
import PatientChat from '../../renders/pages/PatientChat';
import AdminDashboard from '../../renders/pages/AdminDashboard';

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

          {/* Container para rotas de Administrador com o novo layout */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard/>} />
              <Route path="psicologos" element={<ManagePsychologists />} />
            </Route>
          </Route>

          {/* Rota da Videochamada - Acessível por ambos os papéis */}
          <Route path="/consulta/:appointmentId" element={<VideoCall />} />

          {/* Rota Raiz: Apenas redireciona baseado na função */}
          <Route path="/" element={<HomeRedirect />} />

          {/* Rota de Assinatura (acessível por psicólogos aprovados, mas sem assinatura) */}
          <Route path="/assinatura" element={<Subscription />} />

          {/* Container para rotas de Administrador */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route path="psicologos" element={<ManagePsychologists />} />
          </Route>

          {/* Container para rotas de Psicólogo */}
          <Route element={<PsychologistRoute />}>
            <Route path="dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
            <Route path="pacientes" element={<DashboardLayout><Patients /></DashboardLayout>} />
            <Route path="pacientes/:patientId" element={<DashboardLayout><PatientDetail /></DashboardLayout>} />
            <Route path="agenda" element={<DashboardLayout><Agenda /></DashboardLayout>} />
            <Route path="financeiro" element={<DashboardLayout><Financeiro /></DashboardLayout>} />
            <Route path="mensagens" element={<DashboardLayout><Chat /></DashboardLayout>} />
            <Route path="configuracoes" element={<DashboardLayout><Settings /></DashboardLayout>} />
          </Route>

          {/* Container para rotas de Paciente */}
          <Route element={<PatientRoute />}>
            <Route path="meu-dashboard" element={<PatientDashboard />} />
            <Route path="meu-diario" element={<PatientDiary />} />
            <Route path="meu-diario/novo" element={<DiaryEditor />} />
            <Route path="meu-diario/editar/:entryId" element={<DiaryEditor />} />
            <Route path="questionario-inicial" element={<InitialQuestionnaire />} />
            <Route path="minhas-consultas" element={<PatientAppointments />} />
            <Route path="solicitar-consulta" element={<RequestAppointment />} />
            <Route path="meus-pagamentos" element={<PatientFinancials />} />
            <Route path="minhas-mensagens" element={<PatientChat />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;