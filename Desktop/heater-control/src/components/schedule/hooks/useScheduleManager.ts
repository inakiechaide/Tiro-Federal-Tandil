import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { Schedule, WeekDays, Mode } from '../types';
import { DEFAULT_SCHEDULE, WEEK_DAYS, MODES, TOAST_DURATION } from '../constants';

interface UseScheduleManagerProps {
  initialSchedules?: Schedule[];
  onSave?: (schedules: Schedule[]) => Promise<void>;
  onClose?: () => void;
  toast?: any;
}

export const useScheduleManager = ({ 
  initialSchedules = [],
  onSave,
  onClose,
  toast
}: UseScheduleManagerProps = {}) => {
  const [startTime, setStartTime] = useState<string>(DEFAULT_SCHEDULE.startTime);
  const [endTime, setEndTime] = useState<string>(DEFAULT_SCHEDULE.endTime);
  const [mode, setMode] = useState<Mode>(DEFAULT_SCHEDULE.selectedMode);
  const [temp, setTemp] = useState<number>(DEFAULT_SCHEDULE.targetTemp);
  const [selectedDays, setSelectedDays] = useState<WeekDays>(() => ({
    ...DEFAULT_SCHEDULE.selectedDays
  }));
  const [localSchedules, setLocalSchedules] = useState<Schedule[]>(initialSchedules);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // Usar el toast que viene como prop o crear uno nuevo
  const toastInstance = toast || useToast();

  // Sync with props
  useEffect(() => {
    setLocalSchedules(initialSchedules);
  }, [initialSchedules]);

  // Handle time change with validation
  const handleTimeChange = useCallback((time: string, setTime: (time: string) => void, isStartTime: boolean = true) => {
    // Basic validation to prevent invalid times
    if (!time || !time.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      return;
    }
    
    setTime(time);
    
    // If this is a start time change and the new start time is after or equal to end time, adjust end time
    if (isStartTime && time >= endTime) {
      const [hours, minutes] = time.split(':').map(Number);
      const newEndTime = new Date();
      newEndTime.setHours(hours + 1, minutes);
      
      const formattedEndTime = `${newEndTime.getHours().toString().padStart(2, '0')}:${newEndTime.getMinutes().toString().padStart(2, '0')}`;
      setEndTime(formattedEndTime);
      
      toastInstance({
        title: 'Ajuste automático',
        description: 'La hora de fin se ha ajustado para ser 1 hora después de la hora de inicio',
        status: 'info',
        duration: TOAST_DURATION,
        isClosable: true,
      });
    }
  }, [endTime, setEndTime, toast]);

  // Check for time overlaps between schedules
  const hasTimeOverlap = useCallback((schedule1: Schedule, schedule2: Schedule) => {
    if (schedule1.id === schedule2.id) return false;

    const daysOverlap = Object.entries(schedule1.days).some(
      ([day, isSelected]) => isSelected && schedule2.days[day as keyof WeekDays]
    );

    if (!daysOverlap) return false;

    const start1 = convertToMinutes(schedule1.startTime);
    const end1 = convertToMinutes(schedule1.endTime);
    const start2 = convertToMinutes(schedule2.startTime);
    const end2 = convertToMinutes(schedule2.endTime);

    return start1 < end2 && end1 > start2;
  }, []);

  // Convert time to minutes
  const convertToMinutes = useCallback((time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }, []);

  // Get current day as WeekDays object
  const getCurrentDay = useCallback((): WeekDays => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = days[new Date().getDay()];
    
    return Object.fromEntries(
      Object.entries(selectedDays).map(([day]) => [day, day === today])
    ) as WeekDays;
  }, [selectedDays]);

  // Toggle day selection
  const handleDayToggle = useCallback((dayId: keyof WeekDays) => {
    setSelectedDays(prev => ({
      ...prev,
      [dayId]: !prev[dayId]
    }));
  }, [setSelectedDays]);

  // Handle mode selection
  const handleModeSelect = useCallback((newMode: Mode) => {
    setMode(newMode);
    // Reset temperature if mode is not auto
    if (newMode !== 'auto') {
      setTemp(DEFAULT_SCHEDULE.targetTemp);
    }
  }, [setMode, setTemp]);

  // Reset form to default values
  const resetForm = useCallback(() => {
    setStartTime(DEFAULT_SCHEDULE.startTime);
    setEndTime(DEFAULT_SCHEDULE.endTime);
    setMode(DEFAULT_SCHEDULE.selectedMode);
    setTemp(DEFAULT_SCHEDULE.targetTemp);
    setSelectedDays({
      ...DEFAULT_SCHEDULE.selectedDays
    });
  }, [setStartTime, setEndTime, setMode, setTemp, setSelectedDays]);

  // Handle adding a new schedule
  const handleAddSchedule = useCallback(() => {
    // Validar que haya un modo seleccionado
    if (!mode || mode === 'off') {
      if (toast) {
        toastInstance({
          title: 'Error',
          description: 'Por favor, selecciona un modo de operación',
          status: 'error',
          duration: TOAST_DURATION,
          isClosable: true
        });
      }
      return;
    }

    // Crear el nuevo schedule con los días seleccionados
    // Si no hay días seleccionados, se guarda con un objeto vacío
    const newSchedule: Schedule = {
      id: Date.now(),
      mode: mode,
      targetTemp: temp,
      temperature: mode === 'auto' ? temp : undefined,
      type: mode === 'auto' ? 'temp' : 'mode',
      startTime: startTime,
      endTime: endTime,
      days: { ...selectedDays } // Puede estar vacío si no hay días seleccionados
    };

    // Verificar conflictos
    const hasConflict = localSchedules.some(schedule => 
      hasTimeOverlap(schedule, newSchedule)
    );

    if (hasConflict) {
      toastInstance({
        title: 'Conflicto de horario',
        description: 'Ya existe una programación en ese horario',
        status: 'error',
        duration: TOAST_DURATION,
        isClosable: true,
      });
      return;
    }

    setLocalSchedules(prev => [...prev, newSchedule]);
    
    // Reset form
    setStartTime(DEFAULT_SCHEDULE.startTime);
    setEndTime(DEFAULT_SCHEDULE.endTime);
    setMode('off'); // Valor por defecto
    setTemp(DEFAULT_SCHEDULE.targetTemp);
    setSelectedDays(WEEK_DAYS.reduce((acc, day) => ({ ...acc, [day.id]: false }), {}));

    toastInstance({
      title: 'Programación agregada',
      status: 'success',
      duration: TOAST_DURATION,
      isClosable: true,
    });
  }, [startTime, endTime, mode, temp, selectedDays, localSchedules, toast]);

  // Remove a schedule
  const handleRemoveSchedule = useCallback((id: number) => {
    setLocalSchedules(prev => {
      const updated = prev.filter(schedule => schedule.id !== id);
      if (updated.length === 0) {
        // Resetear el formulario si no hay programaciones
        setStartTime(DEFAULT_SCHEDULE.startTime);
        setEndTime(DEFAULT_SCHEDULE.endTime);
        setMode('off');
        setTemp(DEFAULT_SCHEDULE.targetTemp);
        setSelectedDays(WEEK_DAYS.reduce((acc, day) => ({ ...acc, [day.id]: false }), {}));
      }
      return updated;
    });
  }, [WEEK_DAYS]);

  // Save all schedules
  const handleSaveSchedules = async () => {
    try {
      if (localSchedules.length === 0) {
        toastInstance({
          title: 'Error',
          description: 'No hay programaciones para guardar',
          status: 'error',
          duration: TOAST_DURATION,
          isClosable: true,
        });
        return;
      }
      
      setIsSubmitting(true);
      // The actual save implementation should be provided by the parent component
      // through the onSave prop
      if (onSave) {
        await onSave(localSchedules);
      }
      
      toastInstance({
        title: 'Programación guardada',
        status: 'success',
        duration: TOAST_DURATION,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error saving schedules:', error);
      toastInstance({
        title: 'Error al guardar',
        description: 'No se pudieron guardar las programaciones',
        status: 'error',
        duration: TOAST_DURATION,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    startTime,
    endTime,
    mode,
    targetTemp: temp,
    selectedDays,
    localSchedules,
    isSubmitting,
    handleTimeChange: (time: string, setTime: (time: string) => void, isStartTime = true) => 
      handleTimeChange(time, setTime, isStartTime),
    handleDayToggle,
    handleAddSchedule,
    handleRemoveSchedule,
    handleSaveSchedules,
    setMode,
    setTargetTemp: setTemp,
    setStartTime,
    setEndTime,
    resetForm
  };
};
