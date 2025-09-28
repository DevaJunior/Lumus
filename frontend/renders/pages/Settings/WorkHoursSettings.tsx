import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../src/contexts/AuthContext';
import { userService, type DaySchedule, type TimeInterval, type UserProfile, type WorkSchedule } from '../../../src/services/userService';
import { ClockIcon, CopyIcon, TrashIcon } from '../../components/Components/Icons';

const daysOfWeekMap = [
    { label: 'Domingo', value: 0 }, { label: 'Segunda-feira', value: 1 },
    { label: 'Terça-feira', value: 2 }, { label: 'Quarta-feira', value: 3 },
    { label: 'Quinta-feira', value: 4 }, { label: 'Sexta-feira', value: 5 },
    { label: 'Sábado', value: 6 },
];

const createDefaultSchedule = (): WorkSchedule => {
    const schedule: WorkSchedule = {};
    for (let i = 0; i < 7; i++) {
        const isWeekday = i > 0 && i < 6;
        schedule[i] = { isEnabled: isWeekday, intervals: [{ id: `default-${i}`, name: "Horário de Trabalho", startTime: '09:00', endTime: '18:00' }] };
    }
    return schedule;
};

const ToggleSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; }> = ({ checked, onChange }) => (
    <label className="toggle-switch"><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} /><span className="slider"></span></label>
);

const WorkHoursSettings: React.FC = () => {
    const { currentUser, userProfile } = useAuth();
    const [schedule, setSchedule] = useState<WorkSchedule | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [copiedIntervals, setCopiedIntervals] = useState<TimeInterval[] | null>(null);

    useEffect(() => {
        const profile = userProfile as UserProfile;
        const defaultSchedule = createDefaultSchedule();
        if (profile?.workSchedule) {
            const completeSchedule = { ...defaultSchedule, ...profile.workSchedule };
            setSchedule(completeSchedule);
        } else if (profile) {
            setSchedule(defaultSchedule);
        }
    }, [userProfile]);

    const handleScheduleChange = (dayIndex: number, newDaySchedule: Partial<DaySchedule>) => {
        setSchedule(prev => {
            if (!prev) return null;
            const day = { ...prev[dayIndex], ...newDaySchedule };
            if (newDaySchedule.isEnabled && day.intervals.length === 0) {
                day.intervals.push({ id: Date.now().toString(), name: "Horário de Trabalho", startTime: "09:00", endTime: "18:00" });
            }
            return { ...prev, [dayIndex]: day };
        });
    };

    const handleIntervalChange = (dayIndex: number, intervalId: string, newInterval: Partial<TimeInterval>) => {
        setSchedule(prev => {
            if (!prev) return null;
            const newSchedule = { ...prev };
            const day = { ...newSchedule[dayIndex] };
            day.intervals = day.intervals.map(iv =>
                iv.id === intervalId ? { ...iv, ...newInterval } : iv
            );
            newSchedule[dayIndex] = day;
            return newSchedule;
        });
    };

    const addInterval = (dayIndex: number) => {
        setSchedule(prev => {
            if (!prev) return null;
            const newSchedule = { ...prev };
            const day = { ...newSchedule[dayIndex] };
            day.intervals = [...day.intervals, { id: Date.now().toString(), name: "Intervalo", startTime: "12:00", endTime: "13:00" }];
            newSchedule[dayIndex] = day;
            return newSchedule;
        });
    };

    const removeInterval = (dayIndex: number, intervalId: string) => {
        setSchedule(prev => {
            if (!prev) return null;
            const newSchedule = { ...prev };
            const day = { ...newSchedule[dayIndex] };
            day.intervals = day.intervals.filter(iv => iv.id !== intervalId);
            if (day.intervals.length === 0) {
                day.isEnabled = false;
            }
            newSchedule[dayIndex] = day;
            return newSchedule;
        });
    };

    const handleCopy = (intervals: TimeInterval[]) => {
        const intervalsCopy = JSON.parse(JSON.stringify(intervals));
        setCopiedIntervals(intervalsCopy);
        alert('Horários copiados! Use o botão "Aplicar a todos" para colar.');
    };

    const handlePasteToAll = () => {
        if (!copiedIntervals) {
            alert("Primeiro, copie os horários de um dia clicando no ícone de cópia.");
            return;
        }
        if (window.confirm("Isso substituirá os horários de TODOS os outros dias. Deseja continuar?")) {
            setSchedule(prev => {
                if (!prev) return null;
                const newSchedule = { ...prev };
                for (let i = 0; i < 7; i++) {
                    const newIntervals = copiedIntervals.map(iv => ({ ...iv, id: `${i}-${Date.now()}-${Math.random()}` }));
                    newSchedule[i] = { ...newSchedule[i], intervals: newIntervals, isEnabled: newIntervals.length > 0 };
                }
                return newSchedule;
            });
        }
    };

    const handleSave = async () => {
        if (!currentUser || !schedule) return;
        setIsLoading(true);
        try {
            await userService.updateWorkSchedule(currentUser.uid, schedule);
            alert("Horários salvos com sucesso!");
        } catch (error) {
            alert("Erro ao salvar os horários.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!schedule) {
        return (
            <div className="settings-section">
                <div className="section-header"><h3>Meus Horários de Trabalho</h3></div>
                <div className="section-content"><p>Carregando...</p></div>
            </div>
        );
    }

    return (
        <div className="settings-section">
            <div className="section-header">
                <h3>Meus Horários de Trabalho</h3>
                <p>Defina seus horários de atendimento para cada dia da semana.</p>
            </div>
            <div className="section-content work-hours-content">
                <div className="paste-all-container">
                    <button
                        className="paste-all-button"
                        onClick={handlePasteToAll}
                        disabled={!copiedIntervals}
                        title={copiedIntervals ? "Colar horários copiados para todos os dias" : "Copie um horário primeiro"}
                    >
                        <CopyIcon /> Aplicar a todos os dias
                    </button>
                </div>
                {daysOfWeekMap.map(day => {
                    const daySchedule = schedule[day.value];
                    return (
                        <div key={day.value} className={`day-card ${!daySchedule.isEnabled ? 'disabled' : ''}`}>
                            <div className="day-card-header">
                                <div className="day-toggle">
                                    <ToggleSwitch
                                        checked={daySchedule.isEnabled}
                                        onChange={(checked) => handleScheduleChange(day.value, { isEnabled: checked })}
                                    />
                                    <span className="day-label">{day.label}</span>
                                </div>
                                <button className="icon-button copy-button" title="Copiar horários deste dia" disabled={!daySchedule.isEnabled} onClick={() => handleCopy(daySchedule.intervals)}><CopyIcon /></button>
                            </div>
                            {daySchedule.isEnabled && (
                                <div className="intervals-container">
                                    {daySchedule.intervals.map((interval, index) => (
                                        <div key={interval.id} className="interval-row">
                                            <input
                                                type="text"
                                                className="interval-name-input"
                                                value={interval.name}
                                                disabled={index === 0}
                                                placeholder={index === 0 ? "" : "Nome do intervalo"}
                                                onChange={e => handleIntervalChange(day.value, interval.id, { name: e.target.value })}
                                            />
                                            <div className="time-input-wrapper">
                                                <input type="time" value={interval.startTime} onChange={e => handleIntervalChange(day.value, interval.id, { startTime: e.target.value })} />
                                                <ClockIcon className="time-icon" />
                                            </div>
                                            <span className="time-separator">-</span>
                                            <div className="time-input-wrapper">
                                                <input type="time" value={interval.endTime} onChange={e => handleIntervalChange(day.value, interval.id, { endTime: e.target.value })} />
                                                <ClockIcon className="time-icon" />
                                            </div>
                                            <button className="icon-button trash-button" onClick={() => removeInterval(day.value, interval.id)} disabled={daySchedule.intervals.length <= 1}><TrashIcon /></button>
                                        </div>
                                    ))}
                                    <button className="add-interval-button" onClick={() => addInterval(day.value)}>
                                        + Adicionar intervalo
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <div className="section-footer">
                <button className="settings-button secondary" onClick={() => setSchedule(createDefaultSchedule())}>Resetar</button>
                <button className="settings-button" onClick={handleSave} disabled={isLoading}>
                    {isLoading ? 'Salvando...' : 'Salvar Horários'}
                </button>
            </div>
        </div>
    );
};

export default WorkHoursSettings;