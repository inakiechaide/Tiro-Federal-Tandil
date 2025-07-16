import { WEEK_DAYS } from './constants';

export interface Schedule {
  id: number;
  mode: string;
  targetTemp: number;
  temperature?: number; // Temperatura cuando está en modo automático
  startTime: string;
  endTime: string;
  days: { [key: string]: boolean };
  type?: 'temp' | 'mode'; // Para identificar si es una programación de temperatura o modo
}

export type Mode = 'off' | 'auto' | 'on';
export type WeekDays = { [key: string]: boolean };

export interface ScheduleManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (schedules: Schedule[]) => Promise<void>;
  schedules?: Schedule[];
}

export interface ScheduleFormProps {
  startTime: string;
  endTime: string;
  selectedMode: Mode;
  targetTemp: number;
  selectedDays: WeekDays;
  onTimeChange: (time: string, type: 'start' | 'end') => void;
  onDayToggle: (day: string) => void;
  onModeSelect: (mode: Mode) => void;
  onTempChange: (temp: number) => void;
  onAddSchedule: () => void;
}
