import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { WEEK_DAYS, MODES } from '../constants';

// Convertir tiempo a minutos para comparación
const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

// Verificar superposición de horarios
const hasTimeOverlap = (start1, end1, start2, end2) => {
  const s1 = timeToMinutes(start1);
  const e1 = timeToMinutes(end1);
  const s2 = timeToMinutes(start2);
  const e2 = timeToMinutes(end2);
  
  return s1 < e2 && e1 > s2;
};

// Validar nueva programación
const validateSchedule = (newSchedule, existingSchedules) => {
  const hasSelectedDays = Object.values(newSchedule.days).some(Boolean);
  const currentDay = new Date().toLocaleDateString('es-ES', { weekday: 'long' }).toLowerCase();

  // Verificar si hay programaciones existentes que coincidan
  return existingSchedules.some(schedule => {
    // Verificar si hay días en común
    let hasCommonDays = false;
    
    if (!hasSelectedDays) {
      // Verificar si la programación existente incluye el día actual
      hasCommonDays = Object.keys(schedule.days).some(dayId => 
        schedule.days[dayId] && dayId === currentDay
      );
    } else {
      // Verificar intersección con los días de la programación existente
      hasCommonDays = WEEK_DAYS.some(day => 
        newSchedule.days[day.id] && schedule.days[day.id]
      );
    }
    
    if (!hasCommonDays) return false;
    
    // Verificar superposición de horarios
    return hasTimeOverlap(
      newSchedule.startTime, 
      newSchedule.endTime, 
      schedule.startTime, 
      schedule.endTime
    );
  });
};

export const useScheduleManager = (schedules = [], onSave, onClose) => {
  const [localSchedules, setLocalSchedules] = useState(schedules);
  const [selectedMode, setSelectedMode] = useState('off');
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [targetTemp, setTargetTemp] = useState(21);
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('09:00');
  const [selectedDays, setSelectedDays] = useState(
    WEEK_DAYS.reduce((acc, day) => ({
      ...acc,
      [day.id]: false
    }), {})
  );
  const toast = useToast();

  // Sincronizar con las props
  useEffect(() => {
    setLocalSchedules(schedules);
  }, [schedules]);

  // Obtener el día actual
  const getCurrentDay = useCallback(() => {
    return new Date().toLocaleDateString('es-ES', { weekday: 'long' }).toLowerCase();
  }, []);

  // Manejar agregar programación
  const handleAddSchedule = useCallback(() => {
    const hasSelectedDays = Object.values(selectedDays).some(Boolean);
    const currentDay = getCurrentDay();
    
    // Crear objeto de días a usar
    const daysToUse = hasSelectedDays 
      ? { ...selectedDays }
      : WEEK_DAYS.reduce((acc, day) => ({
          ...acc,
          [day.id]: day.id === currentDay
        }), {});
    
    // Crear nueva programación
    const newSchedule = {
      id: Date.now(),
      mode: isAutoMode ? 'auto' : selectedMode,
      targetTemp: isAutoMode ? targetTemp : null,
      startTime,
      endTime,
      days: daysToUse
    };

    // Validar superposición de horarios
    const hasOverlap = validateSchedule(newSchedule, localSchedules);
    if (hasOverlap) {
      toast({
        title: 'Error',
        description: 'Existe una programación que se superpone con los días y horarios seleccionados',
        status: 'error',
        duration: 4000,
        isClosable: true
      });
      return;
    }

    // Validar que la hora de inicio sea anterior a la hora de fin
    if (timeToMinutes(startTime) >= timeToMinutes(endTime)) {
      toast({
        title: 'Error',
        description: 'La hora de inicio debe ser anterior a la hora de fin',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return;
    }

    // Validar temperatura en modo automático
    if (isAutoMode && (targetTemp < 15 || targetTemp > 30)) {
      toast({
        title: 'Error',
        description: 'La temperatura debe estar entre 15°C y 30°C',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return;
    }

    // Añadir la nueva programación
    const updatedSchedules = [...localSchedules, newSchedule];
    setLocalSchedules(updatedSchedules);
    onSave(updatedSchedules);
    onClose();
  }, [selectedDays, selectedMode, isAutoMode, targetTemp, startTime, endTime, localSchedules, validateSchedule, getCurrentDay, onSave, onClose, toast]);

  // Manejar eliminación de programación
  const handleRemoveSchedule = useCallback((scheduleId) => {
    const updatedSchedules = localSchedules.filter(schedule => schedule.id !== scheduleId);
    setLocalSchedules(updatedSchedules);
    onSave(updatedSchedules);
  }, [localSchedules, onSave]);

  // Guardar todas las programaciones
  const handleSaveSchedules = useCallback(async () => {
    setIsSubmitting(true);
    try {
      if (onSave) {
        await onSave(localSchedules);
      }
      toast({
        title: 'Programaciones guardadas',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      if (onClose) {
        onClose();
      }
    } catch (error) {
      toast({
        title: 'Error al guardar',
        description: 'No se pudieron guardar las programaciones',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [localSchedules, onSave, onClose, toast]);

  return {
    localSchedules,
    selectedMode,
    isAutoMode,
    isSubmitting,
    targetTemp,
    startTime,
    endTime,
    selectedDays,
    weekDays: WEEK_DAYS,
    setSelectedMode,
    setIsAutoMode,
    setTargetTemp,
    setStartTime,
    setEndTime,
    setSelectedDays,
    handleAddSchedule,
    handleRemoveSchedule,
    handleSaveSchedules
  };
};
