/**
 * @module ScheduleManager
 * @description Componente principal para gestionar la programación del calefactor
 */

import React, { useState, useEffect } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalFooter, ModalBody,
  VStack, Button, Card, CardBody, Text, SimpleGrid, Box, Input, Flex,
  Slider, SliderTrack, SliderFilledTrack, SliderThumb, Wrap, WrapItem,
  Checkbox, IconButton, useColorModeValue, RadioGroup, Radio, Stack, Select,
  useToast, Tooltip, Badge, HStack, Divider, useDisclosure, Icon, Heading
} from '@chakra-ui/react';
import { FaPlus, FaTrash, FaPowerOff, FaSnowflake, FaFire, FaMagic, FaLeaf, FaSun, FaSave, FaEdit, FaThermometerHalf } from 'react-icons/fa';

// Definición de tipos para TypeScript
/**
 * Representa un día de la semana en la interfaz
 * @interface WeekDay
 * @property {string} id - Identificador único (ej: 'monday')
 * @property {string} label - Etiqueta corta (ej: 'L' para Lunes)
 * @property {string} fullLabel - Nombre completo (ej: 'Lunes')
 * @property {string} fullLabelShort - Nombre corto (ej: 'Lun')
 */
interface WeekDay {
  id: string;
  label: string;
  fullLabel: string;
  fullLabelShort: string;
}

/**
 * Configuración de un modo de operación del calefactor
 * @interface ModeType
 * @property {string} label - Nombre del modo
 * @property {string} color - Color del tema (ej: 'red', 'blue')
 * @property {React.ReactNode} icon - Componente de ícono
 * @property {string} bgColor - Color de fondo (modo claro)
 * @property {string} hoverBg - Color de hover (modo claro)
 * @property {string} textColor - Color del texto (modo claro)
 * @property {string} darkBg - Color de fondo (modo oscuro)
 * @property {string} darkHover - Color de hover (modo oscuro)
 * @property {string} darkText - Color del texto (modo oscuro)
 * @property {string} borderColor - Color del borde (modo claro)
 * @property {string} darkBorder - Color del borde (modo oscuro)
 */
interface ModeType {
  label: string;
  color: string;
  icon: React.ReactNode;
  bgColor: string;
  hoverBg: string;
  textColor: string;
  darkBg: string;
  darkHover: string;
  darkText: string;
  borderColor: string;
  darkBorder: string;
}

/**
 * Representa una programación del calefactor
 * @interface Schedule
 * @property {number} id - Identificador único
 * @property {string} startTime - Hora de inicio (HH:MM)
 * @property {string} endTime - Hora de fin (HH:MM)
 * @property {string} mode - Modo de operación
 * @property {number} [targetTemp] - Temperatura objetivo (solo modo auto)
 * @property {Record<string, boolean>} days - Días activos
 */
interface Schedule {
  id: number;
  startTime: string;
  endTime: string;
  mode: string;
  targetTemp?: number;
  days: Record<string, boolean>;
}

/**
 * Propiedades del componente ScheduleManager
 * @interface ScheduleManagerProps
 * @property {boolean} isOpen - Si el modal está abierto
 * @property {() => void} onClose - Función para cerrar el modal
 * @property {(schedules: Schedule[]) => Promise<void>} onSave - Función para guardar
 * @property {Schedule[]} [schedules] - Lista de programaciones
 */
interface ScheduleManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (schedules: Schedule[]) => Promise<void>;
  schedules?: Schedule[];
}

/**
 * Lista de días de la semana con sus configuraciones
 * @constant {WeekDay[]} WEEK_DAYS
 */
const WEEK_DAYS: WeekDay[] = [
  { id: 'monday', label: 'L', fullLabel: 'Lunes', fullLabelShort: 'Lun' },
  { id: 'tuesday', label: 'M', fullLabel: 'Martes', fullLabelShort: 'Mar' },
  { id: 'wednesday', label: 'X', fullLabel: 'Miércoles', fullLabelShort: 'Mié' },
  { id: 'thursday', label: 'J', fullLabel: 'Jueves', fullLabelShort: 'Jue' },
  { id: 'friday', label: 'V', fullLabel: 'Viernes', fullLabelShort: 'Vie' },
  { id: 'saturday', label: 'S', fullLabel: 'Sábado', fullLabelShort: 'Sáb' },
  { id: 'sunday', label: 'D', fullLabel: 'Domingo', fullLabelShort: 'Dom' }
];

/**
 * Configuración de los modos de operación disponibles
 * @constant {Record<string, ModeType>} MODES
 */
const MODES: Record<string, ModeType> = {
  off: { 
    label: 'Apagado', 
    color: 'gray', 
    icon: <FaPowerOff />,
    bgColor: 'gray.100',
    hoverBg: 'gray.200',
    textColor: 'gray.800',
    darkBg: 'gray.700',
    darkHover: 'gray.600',
    darkText: 'gray.200',
    borderColor: 'gray.300',
    darkBorder: 'gray.500'
  },
  pilot: {
    label: 'Piloto',
    color: 'cyan',
    icon: <FaSun />,
    bgColor: 'cyan.100',
    hoverBg: 'cyan.200',
    textColor: 'cyan.800',
    darkBg: 'cyan.900',
    darkHover: 'cyan.800',
    darkText: 'cyan.100',
    borderColor: 'cyan.300',
    darkBorder: 'cyan.500'
  },
  min: { 
    label: 'Mínimo', 
    color: 'green', 
    icon: <FaSnowflake />,
    bgColor: 'green.100',
    hoverBg: 'green.200',
    textColor: 'green.800',
    darkBg: 'green.900',
    darkHover: 'green.800',
    darkText: 'green.100',
    borderColor: 'green.300',
    darkBorder: 'green.500'
  },
  max: { 
    label: 'Máximo', 
    color: 'red', 
    icon: <FaFire />,
    bgColor: 'red.100',
    hoverBg: 'red.200',
    textColor: 'red.800',
    darkBg: 'red.900',
    darkHover: 'red.800',
    darkText: 'red.100',
    borderColor: 'red.300',
    darkBorder: 'red.500'
  },
  auto: {
    label: 'Automático',
    color: 'purple',
    icon: <FaMagic />,
    bgColor: 'purple.100',
    hoverBg: 'purple.200',
    textColor: 'purple.800',
    darkBg: 'purple.900',
    darkHover: 'purple.800',
    darkText: 'purple.100',
    borderColor: 'purple.300',
    darkBorder: 'purple.500'
  }
};

/**
 * Componente principal para gestionar la programación del calefactor
 * @component
 * @param {ScheduleManagerProps} props - Propiedades del componente
 * @returns {JSX.Element} Componente ScheduleManager
 * 
 * @example
 * <ScheduleManager
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onSave={handleSave}
 *   schedules={schedules}
 * />
 */
const ScheduleManager: React.FC<ScheduleManagerProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  schedules = [] 
}) => {
  // Estados del componente
  /** @type {[Schedule[], React.Dispatch<React.SetStateAction<Schedule[]>>]} Lista local de programaciones */
  const [localSchedules, setLocalSchedules] = useState<Schedule[]>(schedules);
  
  /** @type {[string, React.Dispatch<React.SetStateAction<string>>]} Hora de inicio seleccionada (HH:MM) */
  const [startTime, setStartTime] = useState('08:00');
  
  /** @type {[string, React.Dispatch<React.SetStateAction<string>>]} Hora de fin seleccionada (HH:MM) */
  const [endTime, setEndTime] = useState('09:00');
  
  /** @type {[string, React.Dispatch<React.SetStateAction<string>>]} Modo de operación seleccionado */
  const [selectedOption, setSelectedOption] = useState('off');
  
  /** @type {[number, React.Dispatch<React.SetStateAction<number>>]} Temperatura objetivo para modo automático */
  const [targetTemp, setTargetTemp] = useState(21);
  
  /** @type {[Record<string, boolean>, React.Dispatch<React.SetStateAction<Record<string, boolean>>>]} Días seleccionados */
  const [selectedDays, setSelectedDays] = useState<Record<string, boolean>>(
    WEEK_DAYS.reduce((acc, day) => ({
      ...acc,
      [day.id]: false
    }), {})
  );
  
  /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} Estado de envío del formulario */
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  /** @type {[number | null, React.Dispatch<React.SetStateAction<number | null>>]} ID de la programación en edición */
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Hooks de Chakra UI
  /**
   * Hook para mostrar notificaciones
   * @type {ReturnType<typeof useToast>}
   */
  const toast = useToast();
  
  /**
   * Color de fondo principal
   * @type {string}
   */
  const bgColor = useColorModeValue('white', 'gray.800');
  
  /**
   * Color del borde
   * @type {string}
   */
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Color scheme to match main page
  const colors = {
    // Backgrounds
    background: 'gray.800',
    surface: 'gray.700',
    surfaceElevated: 'gray.700',
    header: 'gray.800',
    
    // Text
    textPrimary: 'white',
    textSecondary: 'gray.300',
    textTertiary: 'gray.400',
    
    // Borders & Dividers
    border: 'gray.600',
    borderHover: 'blue.400',
    
    // Interactive Elements
    primary: 'blue.500',
    primaryHover: 'blue.600',
    primaryActive: 'blue.700',
    
    // Status Colors
    success: 'green.500',
    danger: 'red.500',
    warning: 'yellow.500',
    
    // Inputs
    inputBg: 'gray.700',
    inputBorder: 'gray.600',
    inputHover: 'gray.600',
    
    // Cards & Surfaces
    cardBg: 'gray.700',
    cardHover: 'gray.600',
    
    // Day Picker
    daySelected: 'blue.500',
    daySelectedText: 'white',
    dayHover: 'gray.600'
  };
  
  // Destructure for easier access
  const {
    background,
    surface,
    surfaceElevated,
    headerBg,
    textPrimary,
    textSecondary,
    textTertiary,
    border,
    borderHover,
    primary: buttonPrimary,
    primaryHover: buttonHover,
    primaryActive: buttonActive,
    success: successColor,
    danger: dangerColor,
    dangerHover,
    warning,
    inputBg: inputBgColor,
    inputBorder: inputBorderColor,
    inputHover,
    cardBg,
    cardHover,
    daySelected,
    daySelectedText,
    dayHover: dayHoverBg
  } = colors;
  
  // Alias for active background
  const activeBg = buttonHover;

  /**
   * Sincroniza las programaciones locales cuando cambia la prop schedules
   * @effect
   * @listens schedules
   */
  useEffect(() => {
    setLocalSchedules(schedules);
  }, [schedules]);

  /**
   * Maneja el cambio de hora en los inputs de tiempo
   * @param {string} time - Nueva hora en formato HH:MM
   * @param {boolean} [isStart=true] - Indica si es la hora de inicio (true) o fin (false)
   */
  const handleTimeChange = (time: string, isStart: boolean = true) => {
    if (!time || !time.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      return;
    }
    
    if (isStart) {
      setStartTime(time);
      // If start time is after end time, adjust end time
      if (time >= endTime) {
        const [hours, minutes] = time.split(':').map(Number);
        const newEndTime = new Date();
        newEndTime.setHours(hours + 1, minutes);
        
        // Format to HH:MM
        const formattedTime = `${newEndTime.getHours().toString().padStart(2, '0')}:${newEndTime.getMinutes().toString().padStart(2, '0')}`;
        setEndTime(formattedTime);
      }
    } else {
      setEndTime(time);
      // If end time is before start time, adjust start time
      if (time <= startTime) {
        const [hours, minutes] = time.split(':').map(Number);
        const newStartTime = new Date();
        newStartTime.setHours(hours - 1, minutes);
        
        // Format to HH:MM
        const formattedTime = `${newStartTime.getHours().toString().padStart(2, '0')}:${newStartTime.getMinutes().toString().padStart(2, '0')}`;
        setStartTime(formattedTime);
      }
    }
  };

  /**
   * Alterna la selección de un día de la semana
   * @param {string} dayId - Identificador del día (ej: 'monday')
   */
  const toggleDay = (dayId: string) => {
    setSelectedDays(prev => ({
      ...prev,
      [dayId]: !prev[dayId]
    }));
  };

  /**
   * Convierte una hora en formato 'HH:MM' a minutos desde la medianoche
   * @param {string} time - Hora en formato 'HH:MM'
   * @returns {number} Minutos desde la medianoche
   */
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  /**
   * Verifica si hay conflicto entre dos horarios
   * @param {string} start1 - Hora de inicio 1
   * @param {string} end1 - Hora de fin 1
   * @param {string} start2 - Hora de inicio 2
   * @param {string} end2 - Hora de fin 2
   * @returns {boolean} True si hay conflicto
   */
  const hasTimeConflict = (start1: string, end1: string, start2: string, end2: string): boolean => {
    const s1 = timeToMinutes(start1);
    const e1 = timeToMinutes(end1);
    const s2 = timeToMinutes(start2);
    const e2 = timeToMinutes(end2);
    return s1 < e2 && e1 > s2;
  };

  /**
   * Verifica si hay días en común entre dos programaciones
   * @param {Record<string, boolean>} days1 - Días de la primera programación
   * @param {Record<string, boolean>} days2 - Días de la segunda programación
   * @returns {string[]} Array con los IDs de los días en común
   */
  const getCommonDays = (days1: Record<string, boolean>, days2: Record<string, boolean>): string[] => {
    return Object.entries(days1)
      .filter(([day, isSelected]) => isSelected && days2[day])
      .map(([day]) => day);
  };

  /**
   * Agrega una nueva programación o actualiza una existente
   */
  const handleAddSchedule = async () => {
    try {
      setIsSubmitting(true);
      
      // Si no se seleccionó ningún día, usar el día actual
      const daysToUse = { ...selectedDays };
      let isAutoDaySelected = false;
      let autoSelectedDayId = '';
      
      const selectedDayCount = Object.values(daysToUse).filter(Boolean).length;
      
      if (selectedDayCount === 0) {
        // Obtener el día actual (0 = domingo, 1 = lunes, etc.)
        const today = new Date().getDay();
        // Convertir a nuestra convención de días (lunes = 0, domingo = 6)
        const dayIndex = today === 0 ? 6 : today - 1;
        autoSelectedDayId = WEEK_DAYS[dayIndex].id;
        
        // Establecer el día actual como seleccionado
        daysToUse[autoSelectedDayId] = true;
        isAutoDaySelected = true;
        
        // Mostrar notificación informativa
        toast({
          title: 'Día actual seleccionado',
          description: `Se ha programado para hoy (${WEEK_DAYS[dayIndex].fullLabel})`,
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
      }

      const newSchedule: Schedule = {
        id: editingId || Date.now(),
        startTime,
        endTime,
        mode: selectedOption,
        ...(selectedOption === 'auto' && { targetTemp }),
        days: { ...daysToUse }
      };

      // Verificar conflictos con programaciones existentes
      const conflict = localSchedules.some(schedule => {
        // No comparar con la programación que se está editando
        if (editingId && schedule.id === editingId) return false;
        
        // Verificar días en común
        const commonDays = isAutoDaySelected 
          ? [autoSelectedDayId] 
          : getCommonDays(daysToUse, schedule.days);
          
        if (commonDays.length === 0) return false;
        
        // Verificar conflicto de horarios
        return hasTimeConflict(
          startTime,
          endTime,
          schedule.startTime,
          schedule.endTime
        );
      });

      if (conflict) {
        // Obtener los días en conflicto para el mensaje
        const conflictingDays = new Set<string>();
        
        localSchedules.forEach(schedule => {
          const commonDays = isAutoDaySelected 
            ? [autoSelectedDayId]
            : getCommonDays(daysToUse, schedule.days);
            
          if (commonDays.length === 0) return;
          
          if (hasTimeConflict(startTime, endTime, schedule.startTime, schedule.endTime)) {
            commonDays.forEach(day => {
              const dayInfo = WEEK_DAYS.find(d => d.id === day);
              if (dayInfo) {
                conflictingDays.add(dayInfo.fullLabel);
              }
            });
          }
        });
        
        toast({
          title: 'Conflicto de horario',
          description: `Ya existe una programación para el horario ${startTime} - ${endTime} en los días: ${Array.from(conflictingDays).join(', ')}.`,
          status: 'error',
          duration: 6000,
          isClosable: true,
          position: 'top',
        });
        return;
      }

      let updatedSchedules;
      
      if (editingId) {
        // Actualizar programación existente
        updatedSchedules = localSchedules.map(sched => 
          sched.id === editingId ? newSchedule : sched
        );
        setLocalSchedules(updatedSchedules);
        setEditingId(null);
        toast({
          title: 'Programación actualizada',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Agregar nueva programación
        updatedSchedules = [...localSchedules, newSchedule];
        setLocalSchedules(updatedSchedules);
        toast({
          title: 'Programación agregada',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      
      // Guardar automáticamente los cambios
      await onSave(updatedSchedules);
      
      // Reset form
      resetForm();
      
    } catch (error) {
      console.error('Error al guardar la programación:', error);
      toast({
        title: 'Error al guardar',
        description: 'No se pudo guardar la programación. Inténtalo de nuevo.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Elimina una programación existente
   * @param {number} id - ID de la programación a eliminar
   */
  const handleRemoveSchedule = (id: number) => {
    setLocalSchedules(prev => prev.filter(sched => sched.id !== id));
    toast({
      title: 'Programación eliminada',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  /**
   * Prepara el formulario para editar una programación existente
   * @param {Schedule} schedule - Programación a editar
   */
  const handleEditSchedule = (schedule: Schedule) => {
    setStartTime(schedule.startTime);
    setEndTime(schedule.endTime);
    setSelectedOption(schedule.mode);
    setTargetTemp(schedule.targetTemp || 21);
    setSelectedDays({ ...schedule.days });
    setEditingId(schedule.id);
  };

  /**
   * Reinicia el formulario a sus valores por defecto
   */
  const resetForm = () => {
    setStartTime('08:00');
    setEndTime('09:00');
    setSelectedOption('off');
    setTargetTemp(21);
    setSelectedDays(
      WEEK_DAYS.reduce((acc, day) => ({
        ...acc,
        [day.id]: false
      }), {})
    );
    setEditingId(null);
  };

  /**
   * Maneja el guardado automático de las programaciones
   */
  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      await onSave(localSchedules);
      toast({
        title: 'Cambios guardados',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error al guardar las programaciones:', error);
      toast({
        title: 'Error al guardar',
        description: 'No se pudieron guardar los cambios. Inténtalo de nuevo.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      throw error; // Propagar el error para manejarlo en el componente padre
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Maneja el cierre del modal
   */
  const handleClose = () => {
    onClose();
  };

  /**
   * Verifica si hay al menos un día seleccionado
   * @type {boolean}
   */
  // Los días son opcionales, por lo que no necesitamos validar si hay días seleccionados
  const isFormValid = true; // El formulario siempre es válido ya que los días son opcionales

  /**
   * Formatea la hora para mostrarla en la interfaz
   * @param {string} time - Hora en formato HH:MM
   * @returns {string} Hora formateada
   */
  const formatTimeDisplay = (time: string) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  /**
   * Genera una etiqueta descriptiva para los días seleccionados
   * @param {Record<string, boolean>} days - Objeto con los días seleccionados
   * @returns {string} Etiqueta descriptiva
   */
  const getActiveDaysLabel = (days: Record<string, boolean>) => {
    const activeDays = WEEK_DAYS
      .filter(day => days[day.id])
      .map(day => day.fullLabelShort);
    
    if (activeDays.length === 7) return 'Todos los días';
    if (activeDays.length === 5 && 
        !days['saturday'] && 
        !days['sunday']) return 'LUN a VIE';
    if (activeDays.length === 2 && 
        days['saturday'] && 
        days['sunday']) return 'SÁB, DOM';
    
    return activeDays.join(', ');
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      size="xl"
      scrollBehavior="inside"
      closeOnOverlayClick={!isSubmitting}
    >
      <ModalOverlay />
      <ModalContent 
        bg={surface}
        color={textPrimary}
        borderRadius="lg" 
        overflow="hidden"
        border="1px solid"
        borderColor={border}
        boxShadow="xl"
      >
        <ModalHeader 
          bg={headerBg}
          color={textPrimary}
          py={4}
          borderBottom="1px solid"
          borderColor={border}
          fontWeight="600"
          fontSize="xl"
          letterSpacing="-0.5px"
        >
          <VStack align="flex-start" spacing={1}>
            <Heading size="lg">Programador de Calefacción</Heading>
            <Text fontSize="sm" opacity={0.9}>
              Configura los horarios de encendido y apagado
            </Text>
          </VStack>
        </ModalHeader>
        
        <ModalCloseButton 
          color="white" 
          _hover={{ bg: 'rgba(255,255,255,0.2)' }}
          isDisabled={isSubmitting}
        />
        
        <ModalBody p={0}>
          <VStack spacing={4} p={6} align="stretch">
            {/* Schedule Form */}
            <Card 
              variant="outline" 
              bg={cardBg}
              border="1px solid"
              borderColor={border}
              borderRadius="lg"
              boxShadow="sm"
              transition="all 0.2s"
              _hover={{
                borderColor: borderHover,
                boxShadow: 'md'
              }}
            >
              <CardBody p={4}>
                <VStack spacing={4} align="stretch">
                  <Heading size="md" mb={2}>
                    {editingId ? 'Editar Programación' : 'Nueva Programación'}
                  </Heading>
                  
                  {/* Time Range */}
                  <Box>
                    <Text 
                      fontSize="sm" 
                      fontWeight="500" 
                      mb={2}
                      color={textSecondary}
                      letterSpacing="0.5px"
                    >
                      HORARIO
                    </Text>
                    <HStack spacing={4}>
                      <Box flex={1}>
                        <Text 
                          fontSize="xs" 
                          mb={1}
                          color={textTertiary}
                          fontWeight="500"
                        >
                          INICIO
                        </Text>
                        <Input
                          type="time"
                          value={startTime}
                          onChange={(e) => handleTimeChange(e.target.value, true)}
                          size="md"
                          bg={inputBgColor}
                          border="1px solid"
                          borderColor={inputBorderColor}
                          _hover={{ 
                            borderColor: inputHover,
                            bg: 'rgba(255, 255, 255, 0.03)'
                          }}
                          _focus={{
                            borderColor: buttonPrimary,
                            boxShadow: `0 0 0 1px ${buttonPrimary}`,
                            bg: 'rgba(30, 41, 59, 0.9)'
                          }}
                          color={textPrimary}
                          borderRadius="md"
                          fontWeight="500"
                        />
                      </Box>
                      <Box flex={1}>
                        <Text 
                          fontSize="xs" 
                          mb={1}
                          color={textTertiary}
                          fontWeight="500"
                        >
                          FIN
                        </Text>
                        <Input
                          type="time"
                          value={endTime}
                          onChange={(e) => handleTimeChange(e.target.value, false)}
                          size="md"
                          bg={inputBgColor}
                          border="1px solid"
                          borderColor={inputBorderColor}
                          _hover={{ 
                            borderColor: inputHover,
                            bg: 'rgba(255, 255, 255, 0.03)'
                          }}
                          _focus={{
                            borderColor: buttonPrimary,
                            boxShadow: `0 0 0 1px ${buttonPrimary}`,
                            bg: 'rgba(30, 41, 59, 0.9)'
                          }}
                          color={textPrimary}
                          borderRadius="md"
                          fontWeight="500"
                        />
                      </Box>
                    </HStack>
                  </Box>
                  
                  {/* Days Selection */}
                  <Box>
                    <Text 
                      fontSize="sm" 
                      fontWeight="500" 
                      mb={3}
                      color={textSecondary}
                      letterSpacing="0.5px"
                    >
                      DÍAS DE LA SEMANA
                    </Text>
                    <Wrap spacing={2}>
                      {WEEK_DAYS.map((day) => {
                        const isSelected = selectedDays[day.id];
                        return (
                          <WrapItem key={day.id}>
                            <Box
                              as="button"
                              type="button"
                              onClick={() => toggleDay(day.id)}
                              disabled={isSubmitting}
                              px={4}
                              py={2}
                              borderRadius="md"
                              fontSize="sm"
                              fontWeight="500"
                              transition="all 0.2s"
                              bg={isSelected ? daySelected : 'transparent'}
                              color={isSelected ? daySelectedText : textSecondary}
                              border="1px solid"
                              borderColor={isSelected ? 'rgba(59, 130, 246, 0.3)' : border}
                              _hover={{
                                bg: isSelected ? 'rgba(59, 130, 246, 0.3)' : dayHoverBg,
                                borderColor: isSelected ? 'rgba(59, 130, 246, 0.5)' : borderHover,
                                color: isSelected ? 'white' : textPrimary,
                              }}
                              _active={{
                                transform: 'scale(0.98)',
                              }}
                              _disabled={{
                                opacity: 0.5,
                                cursor: 'not-allowed',
                              }}
                            >
                              {day.fullLabelShort}
                            </Box>
                          </WrapItem>
                        );
                      })}
                    </Wrap>
                  </Box>
                  
                  {/* Mode Selection */}
                  <Box>
                    <Text 
                      fontSize="sm" 
                      fontWeight="500" 
                      mb={3}
                      color={textSecondary}
                      letterSpacing="0.5px"
                    >
                      MODO
                    </Text>
                    <HStack spacing={3} wrap="wrap">
                      {Object.entries(MODES).filter(([key]) => key !== 'auto').map(([key, mode]) => {
                        const isActive = selectedOption === key;
                        return (
                          <Button 
                            key={key}
                            leftIcon={mode.icon} 
                            variant={isActive ? 'solid' : 'outline'}
                            onClick={() => setSelectedOption(key as 'off' | 'eco' | 'comfort' | 'auto')}
                            isDisabled={isSubmitting}
                            flex="1"
                            minW="100px"
                            size="sm"
                            bg={isActive ? `${mode.color}.600` : 'transparent'}
                            color={isActive ? 'white' : `${mode.color}.300`}
                            borderColor={isActive ? `${mode.color}.500` : 'rgba(255, 255, 255, 0.1)'}
                            _hover={{
                              bg: isActive ? `${mode.color}.700` : 'rgba(255, 255, 255, 0.05)',
                              borderColor: isActive ? `${mode.color}.400` : 'rgba(255, 255, 255, 0.2)',
                              transform: 'translateY(-1px)',
                              boxShadow: 'sm',
                            }}
                            _active={{
                              transform: 'translateY(0)',
                              bg: isActive ? `${mode.color}.800` : 'rgba(255, 255, 255, 0.1)',
                            }}
                            transition="all 0.2s"
                            fontWeight="500"
                            letterSpacing="0.3px"
                          >
                            {mode.label}
                          </Button>
                        );
                      })}
                    </HStack>
                  </Box>
                  
                  {/* Temperature Slider */}
                  <Box 
                    p={4} 
                    borderRadius="xl" 
                    borderWidth="1px"
                    borderColor={selectedOption === 'auto' ? 'blue.500' : 'gray.200'}
                    bg={useColorModeValue('white', 'gray.800')}
                    opacity={selectedOption === 'auto' ? 1 : 0.7}
                    transition="all 0.3s"
                  >
                    <HStack mb={4} justify="space-between">
                      <HStack>
                        <Icon as={FaThermometerHalf} 
                          boxSize="24px"
                          color={useColorModeValue('gray.600', 'gray.300')}
                        />
                        <Text fontWeight="medium">
                          Temperatura: {targetTemp}°C
                        </Text>
                      </HStack>
                      {selectedOption !== 'auto' && (
                        <Text fontSize="sm" color="blue.500">
                          Desliza para activar modo automático
                        </Text>
                      )}
                    </HStack>
                    <Slider 
                      min={15} 
                      max={30} 
                      step={0.5} 
                      value={targetTemp}
                      onChange={(value) => {
                        setTargetTemp(value);
                        // Cambiar automáticamente al modo automático al deslizar
                        if (selectedOption !== 'auto') {
                          setSelectedOption('auto');
                        }
                      }}
                      colorScheme="blue"
                      isDisabled={isSubmitting}
                    >
                      <SliderTrack>
                        <SliderFilledTrack bg={buttonPrimary} />
                      </SliderTrack>
                      <Tooltip
                        hasArrow
                        bg="blue.500"
                        color="white"
                        placement="top"
                        isOpen={selectedOption === 'auto'}
                        label={`${targetTemp}°C`}
                      >
                        <SliderThumb 
                          boxSize={5}
                          borderWidth="2px"
                          borderColor="white"
                          _focus={{ boxShadow: `0 0 0 3px ${buttonPrimary}33` }}
                        >
                          <Box 
                            as={FaThermometerHalf} 
                            color={textPrimary} 
                            size="12px"
                          />
                        </SliderThumb>
                      </Tooltip>
                    </Slider>
                    <Flex justify="space-between" mt={2}>
                      <Text fontSize="xs" color="gray.500">15°C</Text>
                      <Text fontSize="xs" color="gray.500">30°C</Text>
                    </Flex>
                  </Box>
                  
                  {/* Add/Update Button */}
                  <Button
                    leftIcon={editingId ? <FaEdit /> : <FaPlus />}
                    colorScheme={editingId ? 'blue' : 'green'}
                    onClick={handleAddSchedule}
                    isDisabled={isSubmitting} // Solo deshabilitar si se está enviando
                    mt={2}
                    size="lg"
                    width="100%"
                    bg={buttonPrimary}
                    color="white"
                    _hover={{
                      bg: buttonHover,
                      transform: 'translateY(-1px)',
                      boxShadow: 'md',
                      _disabled: {
                        bg: buttonPrimary,
                        transform: 'none',
                        boxShadow: 'none'
                      }
                    }}
                    _active={{
                      bg: buttonActive,
                      transform: 'translateY(0)',
                    }}
                    _disabled={{
                      opacity: 0.7,
                      cursor: 'not-allowed',
                      _hover: {
                        bg: buttonPrimary,
                        transform: 'none',
                        boxShadow: 'none'
                      }
                    }}
                    fontWeight="500"
                    letterSpacing="0.3px"
                    transition="all 0.2s"
                  >
                    {editingId ? 'ACTUALIZAR' : 'AGREGAR PROGRAMACIÓN'}
                  </Button>
                </VStack>
              </CardBody>
            </Card>
            
            {/* Schedule List */}
            {localSchedules.length > 0 ? (
              <Box>
                <Heading size="md" mb={4}>Programaciones</Heading>
                <VStack spacing={3} align="stretch">
                  {localSchedules.map((schedule) => {
                    const mode = MODES[schedule.mode as keyof typeof MODES];
                    return (
                      <Card key={schedule.id} variant="outline" borderColor={borderColor}>
                        <CardBody>
                          <Flex justify="space-between" align="center">
                            <Box>
                              <HStack spacing={2} mb={1}>
                                <Box color={`${mode.color}.500`}>
                                  {mode.icon}
                                </Box>
                                <Text fontWeight="medium">
                                  {mode.label} {schedule.mode === 'auto' && `(${schedule.targetTemp}°C)`}
                                </Text>
                              </HStack>
                              <Text fontSize="sm" color={textTertiary}>
                                {formatTimeDisplay(schedule.startTime)} - {formatTimeDisplay(schedule.endTime)}
                              </Text>
                              <Text fontSize="sm" color={textTertiary}>
                                {getActiveDaysLabel(schedule.days)}
                              </Text>
                            </Box>
                            <HStack spacing={2}>
                              <IconButton
                                icon={<FaTrash size="14px" />}
                                aria-label="Eliminar programación"
                                onClick={() => handleRemoveSchedule(schedule.id)}
                                variant="ghost"
                                colorScheme="red"
                                isDisabled={isSubmitting}
                                size="sm"
                                borderRadius="md"
                                _hover={{ 
                                  bg: 'rgba(239, 68, 68, 0.1)',
                                  color: 'red.400'
                                }}
                                _active={{
                                  bg: 'rgba(239, 68, 68, 0.15)',
                                }}
                              />
                            </HStack>
                          </Flex>
                        </CardBody>
                      </Card>
                    );
                  })}
                </VStack>
              </Box>
            ) : (
              <Box 
                textAlign="center" 
                p={6} 
                borderWidth="1px" 
                borderStyle="dashed" 
                borderColor={borderColor}
                borderRadius="md"
              >
                <Text color={textTertiary}>
                  No hay programaciones guardadas. Agrega una para comenzar.
                </Text>
              </Box>
            )}
          </VStack>
        </ModalBody>
        
        <ModalFooter borderTopWidth="1px" borderColor={borderColor}>
          <Button 
            variant="outline" 
            mr={3} 
            onClick={handleClose}
            isDisabled={isSubmitting}
          >
            Cancelar
          </Button>
          {/* Botón de guardar eliminado - Los cambios se guardan automáticamente al agregar/modificar */}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export { ScheduleManager };

export default ScheduleManager;
