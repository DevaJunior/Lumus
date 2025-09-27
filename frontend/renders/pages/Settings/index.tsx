import React, { useState, useEffect } from 'react';
import './styles.css';
import { useAuth } from '../../../src/contexts/AuthContext';
import { userService, type UserProfile, type WorkHour } from '../../../src/services/userService';

const daysOfWeek = [
  { label: 'Domingo', value: 0 },
  { label: 'Segunda', value: 1 },
  { label: 'Terça', value: 2 },
  { label: 'Quarta', value: 3 },
  { label: 'Quinta', value: 4 },
  { label: 'Sexta', value: 5 },
  { label: 'Sábado', value: 6 },
];

const Settings: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const [workHours, setWorkHours] = useState<WorkHour[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const profile = userProfile as UserProfile;
    if (profile && profile.workHours) {
      setWorkHours(profile.workHours);
    }
  }, [userProfile]);

  const handleDayToggle = (dayValue: number) => {
    // Para simplificar, vamos trabalhar com um único intervalo de horário por enquanto
    const newWorkHours = workHours[0] ? { ...workHours[0] } : { daysOfWeek: [], startTime: '09:00', endTime: '18:00' };
    
    const dayIndex = newWorkHours.daysOfWeek.indexOf(dayValue);
    if (dayIndex > -1) {
      newWorkHours.daysOfWeek.splice(dayIndex, 1); // Remove o dia
    } else {
      newWorkHours.daysOfWeek.push(dayValue); // Adiciona o dia
    }
    setWorkHours([newWorkHours]);
  };

  const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    const newWorkHours = workHours[0] ? { ...workHours[0] } : { daysOfWeek: [], startTime: '09:00', endTime: '18:00' };
    newWorkHours[field] = value;
    setWorkHours([newWorkHours]);
  };
  
  const handleSave = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      await userService.updateWorkHours(currentUser.uid, workHours);
      alert("Horários salvos com sucesso!");
    } catch (error) {
      alert("Erro ao salvar os horários.");
    } finally {
      setIsLoading(false);
    }
  };

  const currentWorkHours = workHours[0] || { daysOfWeek: [], startTime: '09:00', endTime: '18:00' };

  return (
    <div className="settings-page">
      <h1>Configurações de Atendimento</h1>
      <div className="settings-card">
        <h2>Meus Horários de Trabalho</h2>
        <p>Selecione os dias e horários em que você está disponível para consultas. Seus pacientes verão estes horários para solicitar agendamentos.</p>
        
        <div className="days-selector">
          {daysOfWeek.map(day => (
            <button
              key={day.value}
              className={`day-button ${currentWorkHours.daysOfWeek.includes(day.value) ? 'selected' : ''}`}
              onClick={() => handleDayToggle(day.value)}
            >
              {day.label}
            </button>
          ))}
        </div>

        <div className="time-selector">
          <div className="form-group">
            <label>Horário de Início</label>
            <input type="time" value={currentWorkHours.startTime} onChange={e => handleTimeChange('startTime', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Horário de Término</label>
            <input type="time" value={currentWorkHours.endTime} onChange={e => handleTimeChange('endTime', e.target.value)} />
          </div>
        </div>

        <button className="save-button" onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar Horários'}
        </button>
      </div>
    </div>
  );
};

export default Settings;