import React from 'react';
import {
  VStack, HStack, Text, Input, Box, SimpleGrid,
  Slider, SliderTrack, SliderFilledTrack, SliderThumb,
  Tooltip, useDisclosure, Icon, Button, Checkbox, Wrap, WrapItem
} from '@chakra-ui/react';
import { FaFire, FaThermometerEmpty, FaThermometerHalf, FaThermometerFull, FaPlus } from 'react-icons/fa';

// Estilos para los modos
const getModeStyles = (useColorModeValue) => ({
  auto: {
    bg: useColorModeValue('purple.50', 'purple.900'),
    hoverBg: useColorModeValue('purple.100', 'purple.800'),
    activeBg: useColorModeValue('purple.200', 'purple.700'),
    color: useColorModeValue('purple.600', 'purple.200'),
    borderColor: useColorModeValue('purple.200', 'purple.700'),
    icon: FaThermometerHalf,
    label: 'Automático'
  },
  off: {
    bg: useColorModeValue('gray.100', 'gray.700'),
    hoverBg: useColorModeValue('gray.200', 'gray.600'),
    activeBg: useColorModeValue('gray.300', 'gray.500'),
    color: useColorModeValue('gray.600', 'gray.200'),
    borderColor: useColorModeValue('gray.300', 'gray.600'),
    icon: FaPlus,
    label: 'Apagado'
  },
  pilot: {
    bg: useColorModeValue('blue.50', 'blue.900'),
    hoverBg: useColorModeValue('blue.100', 'blue.800'),
    activeBg: useColorModeValue('blue.200', 'blue.700'),
    color: useColorModeValue('blue.600', 'blue.200'),
    borderColor: useColorModeValue('blue.200', 'blue.700'),
    icon: FaFire,
    label: 'Piloto'
  },
  min: {
    bg: useColorModeValue('green.50', 'green.900'),
    hoverBg: useColorModeValue('green.100', 'green.800'),
    activeBg: useColorModeValue('green.200', 'green.700'),
    color: useColorModeValue('green.600', 'green.200'),
    borderColor: useColorModeValue('green.200', 'green.700'),
    icon: FaThermometerEmpty,
    label: 'Mínimo'
  },
  max: {
    bg: useColorModeValue('red.50', 'red.900'),
    hoverBg: useColorModeValue('red.100', 'red.800'),
    activeBg: useColorModeValue('red.200', 'red.700'),
    color: useColorModeValue('red.600', 'red.200'),
    borderColor: useColorModeValue('red.200', 'red.700'),
    icon: FaThermometerFull,
    label: 'Máximo'
  }
});

const ScheduleForm = ({
  selectedMode,
  isAutoMode,
  targetTemp,
  startTime,
  endTime,
  selectedDays,
  weekDays,
  onModeChange,
  onTempChange,
  onTimeChange,
  onDayToggle,
  onSubmit,
  useColorModeValue
}) => {
  const [showTooltip, setShowTooltip] = React.useState(false);
  const modeStyles = getModeStyles(useColorModeValue);
  const { isOpen: isTimeTooltipOpen, onOpen: onTimeTooltipOpen, onClose: onTimeTooltipClose } = useDisclosure();

  return (
    <VStack spacing={4} w="100%">
      <Box w="100%">
        <Text mb={3} fontWeight="medium">Horario</Text>
        <SimpleGrid columns={2} spacing={4}>
          <Box>
            <Text mb={2}>Hora de inicio</Text>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => onTimeChange('start', e.target.value)}
              onFocus={onTimeTooltipOpen}
              onBlur={onTimeTooltipClose}
            />
          </Box>
          <Box>
            <Text mb={2}>Hora de fin</Text>
            <Input
              type="time"
              value={endTime}
              onChange={(e) => onTimeChange('end', e.target.value)}
              onFocus={onTimeTooltipOpen}
              onBlur={onTimeTooltipClose}
            />
          </Box>
        </SimpleGrid>
      </Box>

      <Box w="100%">
        <Text mb={3} fontWeight="medium">Modo de calefacción</Text>
        <Text fontSize="sm" color="gray.500" mb={2}>
          {isAutoMode 
            ? `Control Automático (${targetTemp}°C)`
            : `Modo: ${modeStyles[selectedMode]?.label || ''}`}
        </Text>
        {isAutoMode && (
          <Text fontSize="xs" color="purple.600" mb={2}>
            Modo automático activado - El calefactor mantendrá {targetTemp}°C
          </Text>
        )}
        
        <SimpleGrid columns={2} spacing={3} mb={4}>
          {Object.entries(modeStyles)
            .filter(([mode]) => mode !== 'auto')
            .map(([mode, style]) => {
              const IconComponent = style.icon;
              return (
                <Box
                  key={mode}
                  as="button"
                  type="button"
                  p={3}
                  borderRadius="md"
                  borderWidth="1px"
                  bg={selectedMode === mode ? style.activeBg : style.bg}
                  borderColor={selectedMode === mode ? style.borderColor : 'transparent'}
                  color={style.color}
                  _hover={{
                    bg: style.hoverBg,
                    transform: 'translateY(-2px)',
                    boxShadow: 'md'
                  }}
                  _active={{
                    bg: style.activeBg,
                    transform: 'translateY(0)'
                  }}
                  transition="all 0.2s"
                  onClick={() => {
                    onModeChange(mode);
                  }}
                >
                  <VStack spacing={2}>
                    <Icon as={IconComponent} boxSize={5} />
                    <Text fontSize="sm" fontWeight="medium">{style.label}</Text>
                  </VStack>
                </Box>
              );
            })}
        </SimpleGrid>

        <Box mt={4}>
          <Text fontWeight="medium" mb={2}>Temperatura objetivo</Text>
          <Slider
            value={targetTemp}
            min={15}
            max={30}
            step={0.5}
            onChange={(value) => {
              onTempChange(value);
            }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <SliderTrack>
              <SliderFilledTrack bg={isAutoMode ? 'purple.500' : 'gray.300'} />
            </SliderTrack>
            <Tooltip
              hasArrow
              bg="purple.500"
              color="white"
              placement="top"
              isOpen={showTooltip}
              label={`${targetTemp}°C`}
            >
              <SliderThumb _focus={{ boxShadow: 'none' }} />
            </Tooltip>
          </Slider>
          <Flex justify="space-between" mt={1}>
            <Text fontSize="sm" color="gray.500">15°C</Text>
            <Text fontSize="sm" color="gray.500">30°C</Text>
          </Flex>
          <Text fontSize="xs" color="gray.500" mt={2}>
            {isAutoMode 
              ? `Temperatura establecida: ${targetTemp}°C`
              : 'Desliza para activar el control automático de temperatura'}
          </Text>
        </Box>
      </Box>

      <Box w="100%">
        <Text mb={2}>Días</Text>
        <Wrap spacing={4}>
          {weekDays.map((day) => (
            <WrapItem key={day.id}>
              <Checkbox
                isChecked={selectedDays[day.id]}
                onChange={() => onDayToggle(day.id)}
              >
                {day.fullLabel}
              </Checkbox>
            </WrapItem>
          ))}
        </Wrap>
        {!Object.values(selectedDays).some(Boolean) && (
          <Text fontSize="sm" color="blue.500" mt={2}>
            Si no selecciona ningún día, se usará el día actual
          </Text>
        )}
      </Box>

      <Button
        leftIcon={<FaPlus />}
        colorScheme="blue"
        w="100%"
        onClick={onSubmit}
        mt={4}
      >
        Agregar programación
      </Button>
    </VStack>
  );
};

export default ScheduleForm;
