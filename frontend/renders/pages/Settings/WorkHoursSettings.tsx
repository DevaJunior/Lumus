import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../src/contexts/AuthContext';
import { userService, type UserProfile, type WorkHour } from '../../../src/services/userService';
const daysOfWeek = [
  { label: 'Dom', value: 0 }, { label: 'Seg', value: 1 },
  { label: 'Ter', value: 2 }, { label: 'Qua', value: 3 },
  { label: 'Qui', value: 4 }, { label: 'Sex', value: 5 },
  { label: 'Sáb', value: 6 },
];

const WorkHoursSettings: React.FC = () => {
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
    const currentWorkHours = workHours[0] ? { ...workHours[0] } : { daysOfWeek: [], startTime: '09:00', endTime: '18:00' };
    const dayIndex = currentWorkHours.daysOfWeek.indexOf(dayValue);
    if (dayIndex > -1) {
      currentWorkHours.daysOfWeek.splice(dayIndex, 1);
    } else {
      currentWorkHours.daysOfWeek.push(dayValue);
      currentWorkHours.daysOfWeek.sort();
    }
    setWorkHours([currentWorkHours]);
  };

  const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    const newWorkHours = workHours[0] ? { ...workHours[0] } : { daysOfWeek: [], startTime: '09:00', endTime: '18:00' };
    newWorkHours[field] = value;
    setWorkHours([newWorkHours]);
  };
  
  const handleSaveWorkHours = async () => {
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
    <div className="settings-section">
      <div className="section-header">
        <h3>Meus Horários de Trabalho</h3>
        <p>Selecione os dias e horários em que você está disponível para consultas.</p>
      </div>
      <div className="section-content">
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
        <button className="settings-button" onClick={handleSaveWorkHours} disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar Horários'}
        </button>
      </div>
    </div>
  );
};

export default WorkHoursSettings;