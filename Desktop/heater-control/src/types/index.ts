export interface WeekDay {
  id: string;
  label: string;
  fullLabel: string;
  fullLabelShort: string;
}

export interface Mode {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export interface Schedule {
  id: number;
  mode: string;
  targetTemp?: number;
  startTime: string;
  endTime: string;
  days: Record<string, boolean>;
}

export interface ScheduleManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (schedules: Schedule[]) => void;
  schedules?: Schedule[];
}

export interface ScheduleFormProps {
  mode: string;
  targetTemp: number;
  startTime: string;
  endTime: string;
  selectedDays: Record<string, boolean>;
  onModeChange: (mode: string) => void;
  onTempChange: (temp: number) => void;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  onDayChange: (dayId: string, checked: boolean) => void;
}

export interface ScheduleListProps {
  schedules: Schedule[];
  onRemove: (scheduleId: number) => void;
}
