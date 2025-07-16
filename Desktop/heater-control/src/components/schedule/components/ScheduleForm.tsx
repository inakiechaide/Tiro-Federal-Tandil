/**
 * @module ScheduleForm
 * @description 
 * Componente que muestra un formulario para crear o editar una programación de temperatura.
 * Permite configurar horarios, días de la semana, modo de operación y temperatura objetivo.
 * 
 * @example
 * ```tsx
 * <ScheduleForm
 *   startTime="08:00"
 *   endTime="17:00"
 *   selectedMode="auto"
 *   targetTemp={21}
 *   selectedDays={{ monday: true, tuesday: true }}
 *   onTimeChange={(time, type) => {}}
 *   onDayToggle={(day) => {}}
 *   onModeSelect={(mode) => {}}
 *   onTempChange={(temp) => {}}
 *   onAddSchedule={() => {}}
 * />
 * ```
 */

import React from 'react';
import { 
  VStack, 
  HStack, 
  Text, 
  Input, 
  Slider, 
  SliderTrack, 
  SliderFilledTrack, 
  SliderThumb, 
  Box, 
  useColorModeValue,
  Icon,
  Tooltip,
  SimpleGrid,
  Flex,
  Button,
} from '@chakra-ui/react';
import { 
  FaTemperatureHigh, 
  FaPlus,
} from 'react-icons/fa';
import { ScheduleFormProps } from '../types';
import { MODES, WEEK_DAYS } from '../constants';

/**
 * Componente de formulario para crear o editar programaciones de temperatura.
 * 
 * @param {ScheduleFormProps} props - Propiedades del componente
 * @param {string} props.startTime - Hora de inicio en formato HH:MM
 * @param {string} props.endTime - Hora de fin en formato HH:MM
 * @param {string} props.selectedOption - Modo de operación seleccionado
 * @param {number} props.targetTemp - Temperatura objetivo en grados Celsius
 * @param {Object} [props.selectedDays={}] - Objeto con los días seleccionados
 * @param {Function} props.onTimeChange - Manejador de cambio de hora
 * @param {Function} [props.onDayToggle=()=>{}] - Manejador de selección de días
 * @param {Function} props.onModeSelect - Manejador de selección de modo
 * @param {Function} [props.onTempChange=()=>{}] - Manejador de cambio de temperatura
 * @param {Function} [props.onAddSchedule=()=>{}] - Manejador para agregar programación
 * @returns {React.ReactElement} Componente de formulario de programación
 */
export const ScheduleForm: React.FC<ScheduleFormProps> = ({
  startTime,
  endTime,
  selectedOption,
  targetTemp,
  selectedDays = {},
  onTimeChange,
  onDayToggle = () => {},
  onModeSelect,
  onTempChange = () => {},
  onAddSchedule = () => {},
}) => {
  /** 
   * Estado que indica si el control deslizante de temperatura está siendo arrastrado
   * @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
   */
  const [isDragging, setIsDragging] = React.useState(false);

  /**
   * Maneja el cambio de temperatura, forzando el modo automático si es necesario
   * @param {number} value - Nuevo valor de temperatura
   */
  const handleTempChange = (value: number) => {
    onTempChange(value);
    // Si se está estableciendo una temperatura, forzar modo automático
    if (value !== DEFAULT_SCHEDULE.targetTemp) {
      onModeSelect('automático');
      // Esperar un pequeño tiempo para que el estado se actualice
      setTimeout(() => {
        if (!isDragging) {
          onAddSchedule();
        }
      }, 100);
    } else {
      // Si no hay temperatura, no agregar programación
      if (!isDragging) {
        onAddSchedule();
      }
    }
  };

  /**
   * Maneja el inicio del arrastre del control de temperatura
   */
  const handleTempDragStart = () => {
    setIsDragging(true);
  };

  /**
   * Maneja el final del arrastre del control de temperatura
   */
  const handleTempDragEnd = () => {
    setIsDragging(false);
    // Agregar programación cuando se suelte el control
    onAddSchedule();
  };
  // Colores y estilos responsivos
  /** @type {string} Color de fondo de la tarjeta */
  const cardBg = useColorModeValue('white', 'gray.800');
  
  /** @type {string} Color del borde */
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  /** @type {string} Color del texto principal */
  const textColor = useColorModeValue('gray.800', 'white');
  
  /** @type {string} Color del texto secundario */
  const mutedTextColor = useColorModeValue('gray.500', 'gray.400');

  /**
   * Maneja la selección/deselección de un día de la semana
   * @param {string} dayId - Identificador del día (ej: 'monday')
   */
  const handleDayToggle = (dayId: string) => {
    onDayToggle(dayId);
  };

  /**
   * Maneja el cambio de hora (inicio o fin)
   * @param {string} time - Nueva hora en formato HH:MM
   * @param {'start' | 'end'} type - Tipo de hora a cambiar
   */
  const handleTimeChange = (time: string, type: 'start' | 'end') => {
    const setTime = type === 'start' ? 
      (t: string) => onTimeChange(t, () => {}, true) : 
      (t: string) => onTimeChange(t, () => {}, false);
    onTimeChange(time, setTime, type === 'start');
  };

  /**
   * Obtiene el nombre del día actual en formato compatible con WEEK_DAYS
   * @returns {string} ID del día actual (ej: 'monday', 'tuesday', etc.)
   */
  const getCurrentDayId = (): string => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date().getDay(); // 0 = domingo, 1 = lunes, etc.
    return days[today];
  };

  /**
   * Dispara el evento para agregar una nueva programación.
   * Los días son opcionales, si no se selecciona ninguno, se guarda sin días específicos.
   */
  const handleAddSchedule = () => {
    onAddSchedule();
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Time Selection */}
      <HStack spacing={4}>
        <Box flex={1}>
          <Text mb={2} fontSize="sm" fontWeight="medium" color={textColor}>
            Hora de inicio
          </Text>
          <Input
            type="time"
            value={startTime}
            onChange={(e) => handleTimeChange(e.target.value, 'start')}
            size="lg"
          />
        </Box>
        <Box flex={1}>
          <Text mb={2} fontSize="sm" fontWeight="medium" color={textColor}>
            Hora de fin
          </Text>
          <Input
            type="time"
            value={endTime}
            onChange={(e) => handleTimeChange(e.target.value, 'end')}
            size="lg"
            min={startTime}
          />
        </Box>
      </HStack>

      {/* Mode Selection */}
      <Box>
        <Text mb={3} fontSize="sm" fontWeight="medium" color={textColor}>
          Modo de operación
        </Text>
        <SimpleGrid columns={2} spacing={4}>
          {Object.entries(MODES).filter(([key]) => key !== 'auto').map(([key, mode]) => (
            <Box 
              key={key}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              borderColor={selectedOption === key ? 'blue.500' : 'gray.200'}
              bg={selectedOption === key ? 'blue.50' : 'white'}
              _dark={{
                borderColor: selectedOption === key ? 'blue.300' : 'gray.600',
                bg: selectedOption === key ? 'blue.900' : 'gray.800',
              }}
              cursor="pointer"
              onClick={() => onModeSelect(key as any)}
              _hover={{
                borderColor: 'blue.300',
                transform: 'translateY(-2px)',
                boxShadow: 'md',
              }}
              transition="all 0.2s"
            >
              <Text fontWeight="medium" color={textColor} textAlign="center">
                {mode.label}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      {/* Temperature control - Siempre visible pero inactivo hasta que el usuario deslice */}
      <Box 
        p={5} 
        borderRadius="xl" 
        borderWidth="1px"
        borderColor={selectedOption === 'auto' ? 'blue.500' : borderColor}
        bg={cardBg}
        width="full"
        opacity={selectedOption === 'auto' ? 1 : 0.7}
        transition="all 0.3s"
      >
        <HStack mb={4} justify="space-between">
          <HStack>
            <Icon as={FaTemperatureHigh} 
              boxSize="24px"
              color={useColorModeValue('gray.600', 'gray.300')}
            />
            <Text fontWeight="medium" color={textColor}>
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
            handleTempChange(value);
            // Cambiar automáticamente al modo automático al deslizar
            if (selectedOption !== 'auto') {
              onModeSelect('auto');
            }
          }}
          onDragStart={handleTempDragStart}
          onDragEnd={handleTempDragEnd}
          colorScheme="blue"
          isDisabled={false}
          focusThumbOnChange={false}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <Tooltip
            hasArrow
            bg="blue.500"
            color="white"
            placement="top"
            isOpen={selectedOption === 'auto'}
            label={`${targetTemp}°C`}
          >
            <SliderThumb />
          </Tooltip>
        </Slider>
        <Flex justify="space-between" mt={2}>
          <Text fontSize="sm" color={mutedTextColor}>15°C</Text>
          <Text fontSize="sm" color={mutedTextColor}>30°C</Text>
        </Flex>
      </Box>

      {/* Day Selection */}
      <Box>
        <Text mb={3} fontSize="sm" fontWeight="medium" color={textColor}>
          Días de la semana
        </Text>
        <HStack spacing={2} wrap="wrap">
          {WEEK_DAYS.map((day) => (
            <Button
              key={day.id}
              size="sm"
              variant={selectedDays[day.id] ? 'solid' : 'outline'}
              colorScheme={selectedDays[day.id] ? 'blue' : 'gray'}
              onClick={() => handleDayToggle(day.id)}
            >
              {day.fullLabelShort}
            </Button>
          ))}
        </HStack>
      </Box>

      {/* Add Schedule Button */}
      <Button
        leftIcon={<FaPlus />}
        colorScheme="blue"
        size="lg"
        onClick={handleAddSchedule}
        _hover={{
          transform: 'translateY(-2px)',
          boxShadow: 'md',
        }}
        _active={{
          transform: 'translateY(0)',
        }}
      >
        Add Schedule
      </Button>
    </VStack>
  );
};

export default ScheduleForm;
