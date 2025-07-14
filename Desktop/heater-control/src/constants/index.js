export const WEEK_DAYS = [
  { id: 'monday', label: 'L', fullLabel: 'Lunes', fullLabelShort: 'Lun' },
  { id: 'tuesday', label: 'M', fullLabel: 'Martes', fullLabelShort: 'Mar' },
  { id: 'wednesday', label: 'M', fullLabel: 'Miércoles', fullLabelShort: 'Mié' },
  { id: 'thursday', label: 'J', fullLabel: 'Jueves', fullLabelShort: 'Jue' },
  { id: 'friday', label: 'V', fullLabel: 'Viernes', fullLabelShort: 'Vie' },
  { id: 'saturday', label: 'S', fullLabel: 'Sábado', fullLabelShort: 'Sáb' },
  { id: 'sunday', label: 'D', fullLabel: 'Domingo', fullLabelShort: 'Dom' }
];

export const MODES = {
  OFF: {
    id: 'off',
    label: 'Apagado',
    icon: 'FaPowerOff',
    color: 'gray'
  },
  PILOT: {
    id: 'pilot',
    label: 'Piloto',
    icon: 'FaFire',
    color: 'blue'
  },
  MIN: {
    id: 'min',
    label: 'Mínimo',
    icon: 'FaThermometerEmpty',
    color: 'yellow'
  },
  MAX: {
    id: 'max',
    label: 'Máximo',
    icon: 'FaThermometerFull',
    color: 'red'
  }
};

export const DEFAULT_TEMPERATURE = 21;
export const MIN_TEMPERATURE = 15;
export const MAX_TEMPERATURE = 30;

export const DEFAULT_START_TIME = '08:00';
export const DEFAULT_END_TIME = '09:00';
