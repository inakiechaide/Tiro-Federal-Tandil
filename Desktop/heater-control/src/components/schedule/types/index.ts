export type WeekDays = {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
};

export type Mode = 'off' | 'min' | 'max' | 'pilot' | 'temp';

export interface Day {
  id: keyof WeekDays;
  label: string;
  fullLabel: string;
  fullLabelShort: string;
}

export interface ModeConfig {
  label: string;
  color: string;
  icon: React.ComponentType;
}

export interface Schedule {
  id: string;
  startTime: string;
  endTime: string;
  mode: Mode | null;
  temperature?: number;
  days: WeekDays;
}

export interface ScheduleManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (schedules: Schedule[]) => Promise<void>;
  schedules?: Schedule[];
}

export interface TimeRange {
  start: string;
  end: string;
}

export interface ScheduleFormProps {
  startTime: string;
  endTime: string;
  selectedOption: string;
  targetTemp: number;
  selectedDays: Record<string, boolean>;
  onTimeChange: (time: string, setTime: (time: string) => void, isStartTime?: boolean) => void;
  onDayToggle: (dayId: string) => void;
  onModeSelect: (mode: string) => void;
  onTempChange: (temp: number) => void;
  onAddSchedule: () => void;
}

export interface ScheduleListProps {
  schedules: Schedule[];
  onRemove: (id: string) => void;
}

export interface UseScheduleManagerReturn {
  startTime: string;
  endTime: string;
  selectedOption: string;
  targetTemp: number;
  selectedDays: Record<string, boolean>;
  localSchedules: Schedule[];
  isSubmitting: boolean;
  handleTimeChange: (time: string, setTime: (time: string) => void, isStartTime?: boolean) => void;
  handleDayToggle: (dayId: string) => void;
  handleAddSchedule: () => void;
  handleRemoveSchedule: (id: string) => void;
  handleSaveSchedules: () => Promise<void>;
  resetForm: () => void;
  setSelectedOption: (option: string) => void;
  setTargetTemp: (temp: number) => void;
}
