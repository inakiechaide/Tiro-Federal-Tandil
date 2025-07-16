export interface WeekDay {
  id: string;
  fullLabel: string;
  fullLabelShort: string;
}

export const WEEK_DAYS: WeekDay[] = [
  {
    id: 'lunes',
    fullLabel: 'Lunes',
    fullLabelShort: 'Lun'
  },
  {
    id: 'martes',
    fullLabel: 'Martes',
    fullLabelShort: 'Mar'
  },
  {
    id: 'miercoles',
    fullLabel: 'Miércoles',
    fullLabelShort: 'Mié'
  },
  {
    id: 'jueves',
    fullLabel: 'Jueves',
    fullLabelShort: 'Jue'
  },
  {
    id: 'viernes',
    fullLabel: 'Viernes',
    fullLabelShort: 'Vie'
  },
  {
    id: 'sabado',
    fullLabel: 'Sábado',
    fullLabelShort: 'Sáb'
  },
  {
    id: 'domingo',
    fullLabel: 'Domingo',
    fullLabelShort: 'Dom'
  }
];

export const MODES = ['off', 'auto', 'on'] as const;

export const DEFAULT_SCHEDULE = {
  startTime: '08:00',
  endTime: '09:00',
  selectedMode: 'off' as Mode,
  targetTemp: 21,
  selectedDays: WEEK_DAYS.reduce((acc, day) => ({
    ...acc,
    [day.id]: false
  }), {} as WeekDays)
};
