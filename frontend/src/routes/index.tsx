import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Login from './../../renders/pages/Login/index';
import Register from './../../renders/pages/Register/index';
import ProtectedRoute from './ProtectedRoute';
import Dashboard from '../../renders/pages/Dashboard';
import Patients from '../../renders/pages/Patients';
import PatientDetail from '../../renders/pages/PatientDetail';
import Agenda from '../../renders/pages/Agenda';
import Financeiro from '../../renders/pages/Financeiro';

const AppRoutes: React.FC = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Carregando plataforma...</div>;
  }

  return (
    // Adicione a propriedade "basename" aqui
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={currentUser ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/register" element={currentUser ? <Navigate to="/" replace /> : <Register />} />
        
        <Route path="/" element={<ProtectedRoute />}>
          <Route index element={<Dashboard />} />
          <Route path="pacientes" element={<Patients />} />
          <Route path="pacientes/:patientId" element={<PatientDetail />} />

          <Route path="agenda" element={<Agenda />} />
          <Route path="financeiro" element={<Financeiro />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;