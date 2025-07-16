import React from 'react';
import { VStack, Text, Input, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Flex, Wrap, WrapItem, Checkbox, Select } from '@chakra-ui/react';
import { FaThermometerHalf, FaThermometerEmpty, FaThermometerFull } from 'react-icons/fa';
import { WEEK_DAYS, MODES } from '../../constants';

const ScheduleForm = ({ 
  selectedMode: mode,
  targetTemp: temp,
  startTime,
  endTime,
  selectedDays,
  onModeSelect,
  onTempChange,
  onTimeChange,
  onDayToggle,
  onAddSchedule
}: {
  mode: string;
  temp: number;
  startTime: string;
  endTime: string;
  selectedDays: { [key: string]: boolean };
  onModeSelect: (mode: string) => void;
  onTempChange: (temp: number) => void;
  onTimeChange: (time: string, type: 'start' | 'end') => void;
  onDayToggle: (day: string) => void;
  onAddSchedule: () => void;
}) => {
  // Estado local para el slider
  const [localTemp, setLocalTemp] = useState(() => temp);
  const [localMode, setLocalMode] = useState(() => mode);

  // Manejar cambios en el modo
  const handleModeChange = useCallback((e) => {
    const newMode = e.target.value;
    setLocalMode(newMode);
    onModeSelect(newMode);
  }, [onModeSelect]);

  // Manejar cambios en el slider
  const handleTempChange = useCallback((value) => {
    const newTemp = Math.round(value);
    
    // Solo forzar modo automático si:
    // 1. No hay modo seleccionado
    // 2. O si el modo seleccionado es 'off'
    if ((!localMode || localMode === 'off') && newTemp !== 21) {
      setLocalMode('auto');
      onModeSelect('auto');
    }
    
    setLocalTemp(newTemp);
    onTempChange(newTemp);
  }, [localMode, onModeSelect, onTempChange]);

  // Actualizar estados locales cuando cambian las props
  useEffect(() => {
    // Solo actualizar el estado local si no estamos en medio de un cambio
    if (localMode === mode && localTemp === temp) {
      setLocalTemp(temp);
      setLocalMode(mode);
    }
  }, [temp, mode, setLocalTemp, setLocalMode]);

  return (
    <VStack spacing={4} align="stretch">
      {/* Modo Selector */}
      <VStack spacing={2} align="stretch">
        <Text fontSize="lg" fontWeight="bold">Modo</Text>
        <Select
          value={localMode}
          onChange={handleModeChange}
          placeholder="Selecciona un modo"
        >
          {MODES.map((mode) => (
            <option key={mode} value={mode}>
              {mode}
            </option>
          ))}
        </Select>
      </VStack>

      {/* Temperatura */}
      <VStack spacing={2} align="stretch">
        <Text fontSize="lg" fontWeight="bold">Temperatura</Text>
        <Flex align="center">
          <FaThermometerEmpty />
          <Slider
            value={localTemp}
            onChange={handleTempChange}
            onChangeEnd={() => {
              // Forzar actualización del estado local cuando se suelta el slider
              setLocalTemp(temp);
            }}
            min={15}
            max={30}
            step={1}
            aria-label="Temperatura"
            isDisabled={mode !== 'auto'}
            _disabled={{
              opacity: 0.6,
              cursor: 'not-allowed'
            }}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb boxSize={6}>
              <FaThermometerHalf />
            </SliderThumb>
          </Slider>
          <FaThermometerFull />
        </Flex>
        <Text textAlign="center">{localTemp}°C</Text>
      </VStack>

      {/* Horarios */}
      <VStack spacing={2} align="stretch">
        <Text fontSize="lg" fontWeight="bold">Horarios</Text>
        <Input 
          value={startTime || ''}
          onChange={(e) => onStartTimeChange(e.target.value)}
          placeholder="Hora de inicio"
          type="time"
        />
        <Input 
          value={endTime || ''}
          onChange={(e) => onEndTimeChange(e.target.value)}
          placeholder="Hora de fin"
          type="time"
        />
      </VStack>

      {/* Días de la semana */}
      <VStack spacing={2} align="stretch">
        <Text fontSize="lg" fontWeight="bold">Días</Text>
        <Wrap spacing={2}>
          {WEEK_DAYS.map(day => (
            <WrapItem key={day.id}>
              <Checkbox
                isChecked={selectedDays[day.id]}
                onChange={(e) => onDayChange(day.id, e.target.checked)}
              >
                {day.fullLabelShort}
              </Checkbox>
            </WrapItem>
          ))}
        </Wrap>
      </VStack>
    </VStack>
  );
};

export default ScheduleForm;
