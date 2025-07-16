import { FaPowerOff, FaFan, FaThermometerHalf } from 'react-icons/fa';
import { BsThermometerLow, BsThermometerHigh } from 'react-icons/bs';
import { Mode, ModeConfig } from './types';

export const WEEK_DAYS = [
  { id: 'monday', label: 'L', fullLabel: 'Lunes', fullLabelShort: 'Lun' },
  { id: 'tuesday', label: 'M', fullLabel: 'Martes', fullLabelShort: 'Mar' },
  { id: 'wednesday', label: 'X', fullLabel: 'Miércoles', fullLabelShort: 'Mié' },
  { id: 'thursday', label: 'J', fullLabel: 'Jueves', fullLabelShort: 'Jue' },
  { id: 'friday', label: 'V', fullLabel: 'Viernes', fullLabelShort: 'Vie' },
  { id: 'saturday', label: 'S', fullLabel: 'Sábado', fullLabelShort: 'Sáb' },
  { id: 'sunday', label: 'D', fullLabel: 'Domingo', fullLabelShort: 'Dom' }
] as const;

export const MODES: Record<Mode, ModeConfig> = {
  off: { label: 'Apagado', color: 'gray', icon: FaPowerOff },
  min: { label: 'Mínimo', color: 'blue', icon: BsThermometerLow },
  max: { label: 'Máximo', color: 'red', icon: BsThermometerHigh },
  temp: { label: 'Temperatura', color: 'orange', icon: FaThermometerHalf },
  pilot: { label: 'Piloto', color: 'green', icon: FaFan }
} as const;

export const DEFAULT_SCHEDULE = {
  startTime: '08:00',
  endTime: '09:00',
  selectedOption: 'off',
  targetTemp: 21,
  selectedDays: WEEK_DAYS.reduce((acc, day) => ({ ...acc, [day.id]: false }), {})
} as const;

export const TOAST_DURATION = 4000;

export const MODAL_STYLES = {
  content: {
    borderRadius: 'xl',
    boxShadow: 'dark-lg',
    borderWidth: '1px',
    overflow: 'hidden',
    maxW: { base: '90vw', md: '800px' }
  },
  header: {
    bgGradient: 'linear(to-r, brand.500, brand.700)',
    color: 'white',
    borderTopRadius: 'xl',
    py: 4,
    px: 6,
    fontSize: 'xl',
    fontWeight: 'semibold'
  },
  closeButton: {
    color: 'white',
    _hover: { bg: 'blackAlpha.200' },
    top: 3,
    right: 4
  },
  footer: {
    bg: 'gray.50',
    _dark: { bg: 'gray.800' },
    borderBottomRadius: 'xl',
    p: 4
  }
} as const;
