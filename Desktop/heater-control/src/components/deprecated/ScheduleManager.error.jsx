import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  Heading,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  Select,
  Input,
  Box,
  useToast,
  Divider,
  SimpleGrid,
  IconButton,
  RadioGroup,
  Radio,
  Stack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Badge,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  useColorModeValue,
  Card,
  CardBody,
  Flex,
  Icon,
  Tooltip,
  Spinner,
  Checkbox, CheckboxGroup, Wrap, WrapItem
} from '@chakra-ui/react';
import { 
  FaPlus, 
  FaTrash, 
  FaClock, 
  FaTemperatureHigh, 
  FaPowerOff, 
  FaFire, 
  FaSlidersH,
  FaThermometerEmpty,
  FaThermometerFull,
  FaThermometerHalf,
  FaArrowRight,
  FaCalendarAlt,
  FaTimes
} from 'react-icons/fa';

const ScheduleManager = ({ isOpen, onClose, onSave, schedules = [] }) => {
  // 1. Primero todos los estados con useState
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('09:00');
  const [scheduleType, setScheduleType] = useState('mode'); // 'mode' o 'temp'
  const [targetMode, setTargetMode] = useState('min');
  const [targetTemp, setTargetTemp] = useState(21);
  const [selectedDays, setSelectedDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false
  });
  const [localSchedules, setLocalSchedules] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Días de la semana para mostrar en la interfaz
  const weekDays = [
    { id: 'monday', label: 'L', fullLabel: 'Lunes', fullLabelShort: 'Lun' },
    { id: 'tuesday', label: 'M', fullLabel: 'Martes', fullLabelShort: 'Mar' },
    { id: 'wednesday', label: 'M', fullLabel: 'Miércoles', fullLabelShort: 'Mié' },
    { id: 'thursday', label: 'J', fullLabel: 'Jueves', fullLabelShort: 'Jue' },
    { id: 'friday', label: 'V', fullLabel: 'Viernes', fullLabelShort: 'Vie' },
    { id: 'saturday', label: 'S', fullLabel: 'Sábado', fullLabelShort: 'Sáb' },
    { id: 'sunday', label: 'D', fullLabel: 'Domingo', fullLabelShort: 'Dom' }
  ];
  
  // 2. Luego todos los hooks de Chakra UI
  // Color mode values
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const primaryColor = useColorModeValue('blue.500', 'blue.300');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
  const headerBg = useColorModeValue('blue.50', 'blue.900');
  const headerTextColor = useColorModeValue('blue.700', 'blue.200');
  const cardBgLight = useColorModeValue('white', 'gray.750');
  const blueBg = useColorModeValue('blue.50', 'blue.900');
  const purpleBg = useColorModeValue('purple.50', 'purple.900');
  const purpleText = useColorModeValue('purple.800', 'purple.200');
  const purpleLightBg = useColorModeValue('purple.100', 'purple.800');
  const purpleMutedText = useColorModeValue('purple.600', 'purple.300');
  const blueGradientFrom = useColorModeValue('blue.500', 'blue.600');
  const blueGradientTo = useColorModeValue('blue.600', 'blue.500');
  const blueFocusShadow = useColorModeValue('blue.200', 'blue.700');
  const grayBg = useColorModeValue('white', 'gray.700');
  const grayText = useColorModeValue('gray.500', 'gray.400');
  const purpleAccent = useColorModeValue('purple.500', 'purple.400');
  
  // Additional color mode values used in the component
  const modeButtonHoverBorder = useColorModeValue('blue.300', 'blue.500');
  const modeButtonFocusShadow = useColorModeValue('0 0 0 3px rgba(66, 153, 225, 0.6)', '0 0 0 3px rgba(66, 153, 225, 0.6)');
  const buttonHoverBorder = useColorModeValue('purple.300', 'purple.500');
  const buttonFocusShadow = useColorModeValue('0 0 0 3px rgba(159, 122, 234, 0.6)', '0 0 0 3px rgba(159, 122, 234, 0.6)');
  const whiteOrPurpleDark = useColorModeValue('white', 'purple.800');
  const purpleOrWhite = useColorModeValue('purple.700', 'white');
  const purpleBorder = useColorModeValue('purple.200', 'purple.600');
  const blueGradient = `linear(to-r, ${useColorModeValue('blue.500', 'blue.600')}, ${useColorModeValue('blue.600', 'blue.500')})`;
  const grayTextColor = useColorModeValue('gray.700', 'gray.300');
  
  // Mode colors for light/dark mode - Consolidated
  const modeColors = {
    min: {
      light: 'green.100',
      dark: 'green.800',
      text: 'green.800',
      border: 'green.200',
      icon: 'green.500',
      bgLight: 'green.50',
      bgDark: 'green.900',
      borderLight: 'green.300',
      borderDark: 'green.600'
    },
    max: {
      light: 'red.100',
      dark: 'red.800',
      text: 'red.800',
      border: 'red.200',
      icon: 'red.500',
      bgLight: 'red.50',
      bgDark: 'red.900',
      borderLight: 'red.300',
      borderDark: 'red.600'
    },
    pilot: {
      light: 'orange.100',
      dark: 'orange.800',
      text: 'orange.800',
      border: 'orange.200',
      icon: 'orange.500',
      bgLight: 'orange.50',
      bgDark: 'orange.900',
      borderLight: 'orange.300',
      borderDark: 'orange.600'
    },
    off: {
      light: 'gray.100',
      dark: 'gray.700',
      text: 'gray.600',
      border: 'gray.200',
      icon: 'gray.500',
      bgLight: 'gray.50',
      bgDark: 'gray.900',
      borderLight: 'gray.300',
      borderDark: 'gray.600'
    },
    temp: {
      light: 'purple.100',
      dark: 'purple.800',
      text: 'purple.800',
      border: 'purple.200',
      icon: 'purple.500',
      bgLight: 'purple.50',
      bgDark: 'purple.900',
      borderLight: 'purple.300',
      borderDark: 'purple.600'
    },
    default: {
      light: 'blue.100',
      dark: 'blue.800',
      text: 'blue.800',
      border: 'blue.200',
      icon: 'blue.500',
      bgLight: 'blue.50',
      bgDark: 'blue.900',
      borderLight: 'blue.300',
      borderDark: 'blue.600'
    }
  };
  
  // 3. Configuración de toast
  const toast = useToast({
    position: 'top-right',
    duration: 3000,
    isClosable: true,
  });

  // 4. Efectos secundarios
  useEffect(() => {
    if (isOpen) {
      setLocalSchedules(schedules);
    }
  }, [isOpen, schedules]);
  
  // Manejar cambio en la selección de días
  const handleDayToggle = (day) => {
    setSelectedDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };
  
  // Verificar si algún día está seleccionado
  const isAnyDaySelected = Object.values(selectedDays).some(day => day);

  // Función para formatear los días seleccionados
  const formatSelectedDays = (days) => {
    if (!days) return 'Sin días seleccionados';
    
    const selectedDaysList = weekDays
      .filter(day => days[day.id])
      .map(day => day.fullLabel);
    
    if (selectedDaysList.length === 0) return 'Sin días seleccionados';
    if (selectedDaysList.length === 7) return 'Todos los días';
    if (selectedDaysList.length > 3) {
      return `${selectedDaysList.length} días`;
    }
    return selectedDaysList.join(', ');
  };

  // Función para formatear la hora en formato legible
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };
  
  // Definir los colores para cada modo (moved to the top of the component)

  // Get the current color mode at the top level
  const isDarkMode = useColorModeValue(false, true);
  
  // Obtener los colores según el modo actual (claro/oscuro)
  const getModeColor = (mode) => {
    const colors = modeColors[mode] || modeColors.default;
    
    return {
      light: isDarkMode ? colors.dark : colors.light,
      dark: isDarkMode ? colors.light : colors.dark,
      text: colors.text,
      border: isDarkMode ? colors.borderDark : colors.borderLight,
      icon: colors.icon,
      bg: isDarkMode ? colors.bgDark : colors.bgLight
    };
  };
  
  const getModeIcon = (mode) => {
    const modeIcons = {
      min: FaThermometerEmpty,
      max: FaThermometerFull,
      pilot: FaFire,
      off: FaPowerOff,
      temp: FaTemperatureHigh
    };
    return modeIcons[mode] || FaPowerOff;
  };

  const getNextOccurrence = () => {
    // Esta función ya no se usa, la mantenemos por si acaso
    return null;
  };

  // Función para manejar la adición de un nuevo horario
  const handleAddSchedule = () => {
    // Si no se selecciona ningún día, usar el día actual
    let daysToUse = { ...selectedDays };
    if (!isAnyDaySelected) {
      const today = new Date().toLocaleString('es-ES', { weekday: 'long' }).toLowerCase();
      const dayMap = {
        'lunes': 'monday',
        'martes': 'tuesday',
        'miércoles': 'wednesday',
        'jueves': 'thursday',
        'viernes': 'friday',
        'sábado': 'saturday',
        'domingo': 'sunday'
      };
      
      const todayKey = dayMap[today] || 'monday';
      daysToUse = { ...daysToUse, [todayKey]: true };
      
      // Mostrar notificación informativa
      toast({
        title: 'Día actual seleccionado',
        description: `Se ha seleccionado ${today.charAt(0).toUpperCase() + today.slice(1)} por defecto`,
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    }

    // Validar que la hora de inicio sea anterior a la de fin
    if (startTime >= endTime) {
      toast({
        title: 'Error en el horario',
        description: 'La hora de inicio debe ser anterior a la hora de fin',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Validar que el rango de tiempo sea de al menos 15 minutos
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const startTotal = startH * 60 + startM;
    const endTotal = endH * 60 + endM;
    
    if (endTotal - startTotal < 15) {
      toast({
        title: 'Rango de tiempo muy corto',
        description: 'El tiempo mínimo de programación es de 15 minutos',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Usar los días seleccionados (o el día actual si no hay selección)
    // daysToUse ya está definido más arriba

    // Verificar superposición con horarios existentes para los días seleccionados
    const hasOverlap = localSchedules.some(schedule => {
      // Si hay algún día en común entre los horarios
      const hasDayOverlap = Object.keys(selectedDays).some(day => 
        selectedDays[day] && schedule.days && schedule.days[day]
      );
      
      if (!hasDayOverlap) return false;
      
      // Verificar superposición de horarios
      return (
        (startTime >= schedule.startTime && startTime < schedule.endTime) ||
        (endTime > schedule.startTime && endTime <= schedule.endTime) ||
        (startTime <= schedule.startTime && endTime >= schedule.endTime)
      );
    });

    if (hasOverlap) {
      toast({
        title: 'Error',
        description: 'El horario se superpone con una programación existente para alguno de los días seleccionados',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Crear un nuevo horario con los días seleccionados
    const newSchedule = {
      id: Date.now().toString(),
      startTime,
      endTime,
      type: scheduleType,
      [scheduleType === 'mode' ? 'mode' : 'temperature']: scheduleType === 'mode' ? targetMode : targetTemp,
      days: { ...daysToUse }
    };

    // Actualizar el estado con el nuevo horario
    setLocalSchedules(prevSchedules => {
      const updated = [...prevSchedules, newSchedule].sort((a, b) => 
        a.startTime.localeCompare(b.startTime)
      );
      return updated;
    });
    
    // Resetear el formulario
    setStartTime('08:00');
    setEndTime('09:00');
    setTargetMode('min');
    setTargetTemp(21);
    setSelectedDays({
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false
    });
    
    // Mostrar notificación de éxito
    toast({
      title: '¡Programación agregada!',
      description: 'La nueva programación ha sido agregada correctamente',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const removeSchedule = (id) => {
    const scheduleToRemove = localSchedules.find(s => s.id === id);
    
    if (!scheduleToRemove) {
      console.error('No se encontró el horario a eliminar con ID:', id);
      toast({
        title: 'Error',
        description: 'No se pudo encontrar el horario a eliminar',
        status: 'error',
        duration: 3000,
      });
      return;
    }
    
    if (window.confirm(`¿Estás seguro de eliminar la franja horaria de ${scheduleToRemove.startTime} a ${scheduleToRemove.endTime}?`)) {
      setLocalSchedules(prevSchedules => prevSchedules.filter(s => s.id !== id));
      toast({
        title: 'Horario eliminado',
        description: 'La franja horaria ha sido eliminada correctamente',
        status: 'info',
        duration: 3000,
      });
    }
  };

  // Alias for removeSchedule to fix the error
  const handleRemoveSchedule = removeSchedule;

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      await onSave(localSchedules);
      toast({
        title: '¡Guardado!',
        description: 'Los horarios se han guardado correctamente',
        status: 'success',
      });
      onClose();
    } catch (error) {
      console.error('Error al guardar horarios:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron guardar los horarios. Por favor, inténtalo de nuevo.',
        status: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getModeLabel = (schedule) => {
    if (schedule.type === 'mode') {
      const modeLabels = {
        min: 'Mínimo',
        max: 'Máximo',
        pilot: 'Piloto',
        off: 'Apagado',
        auto: 'Automático'
      };
      return modeLabels[schedule.mode] || 'Modo Desconocido';
    } else {
      return `Temperatura: ${schedule.temperature}°C`;
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size={['full', 'md', 'xl']} 
      scrollBehavior="inside"
      closeOnOverlayClick={!isSubmitting}
      motionPreset="slideInBottom"
      isCentered
    >
      <ModalOverlay 
        bg="blackAlpha.600" 
        backdropFilter="blur(4px)" 
      />
      <ModalContent 
        bg={cardBg}
        borderWidth="1px"
        borderColor={borderColor}
        boxShadow={['none', 'xl']}
        borderRadius={['none', 'xl']}
        m={0}
        maxH={['100vh', '90vh']}
        minH={['100vh', 'auto']}
        overflowY="auto"
        position="relative"
      >
        {isSubmitting && (
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="blackAlpha.200"
            zIndex={1}
            display="flex"
            alignItems="center"
            justifyContent="center"
            backdropFilter="blur(2px)"
          >
            <Spinner size="xl" color="blue.500" thickness="4px" />
          </Box>
        )}
        
        <ModalHeader 
          borderBottomWidth="1px" 
          borderColor={borderColor}
          position="sticky"
          top="0"
          bg={cardBg}
          zIndex="sticky"
          pt={[6, 4]}
          pb={4}
        >
          <Flex align="center" justify="space-between">
            <Flex align="center">
              <Icon as={FaClock} color={primaryColor} mr={3} />
              <Heading size={['md', 'lg']} color={textColor}>Programar horario</Heading>
            </Flex>
            <IconButton
              icon={<FaTimes />}
              onClick={onClose}
              size="sm"
              variant="ghost"
              aria-label="Cerrar"
              position={['absolute', 'static']}
              right={2}
              top={2}
            />
          </Flex>
        </ModalHeader>
        <ModalCloseButton top={4} right={4} isDisabled={isSubmitting} />
        
        <ModalBody p={0} position="relative" zIndex={2}>
          <VStack spacing={0} align="stretch">
            {/* Contenido principal del formulario */}
            <VStack spacing={6} p={6} align="stretch">
              {/* Tarjeta de configuración */}
              <Card 
                variant="outline" 
                borderColor={borderColor}
                borderRadius="lg"
                overflow="hidden"
                boxShadow="sm"
                bg={cardBgLight}
              >
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    {/* Sección de franja horaria */}
                    <Box>
                      <Flex align="center" mb={3}>
                        <Icon as={FaClock} color={primaryColor} mr={2} />
                        <Text fontWeight="semibold" color={textColor}>
                          Franja horaria
                        </Text>
                      </Flex>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} width="100%">
                        <Box>
                          <Text 
                            fontSize="sm" 
                            color={mutedTextColor} 
                            mb={2}
                            display="flex"
                            alignItems="center"
                          >
                            <Box as="span" w="6" textAlign="center" mr={2}>🕒</Box>
                            Hora de inicio
                          </Text>
                          <Input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            size="md"
                            borderRadius="md"
                            borderColor={borderColor}
                            _hover={{ borderColor: 'blue.300' }}
                            _focus={{ 
                              borderColor: primaryColor,
                              boxShadow: `0 0 0 1px ${primaryColor}`,
                              borderWidth: '2px'
                            }}
                            bg={cardBg}
                            fontWeight="medium"
                          />
                        </Box>
                        <Box>
                          <Text 
                            fontSize="sm" 
                            color={mutedTextColor} 
                            mb={2}
                            display="flex"
                            alignItems="center"
                          >
                            <Box as="span" w="6" textAlign="center" mr={2}>⏱️</Box>
                            Hora de fin
                          </Text>
                          <Input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            min={startTime}
                            size="md"
                            borderRadius="md"
                            borderColor={borderColor}
                            _hover={{ borderColor: 'blue.300' }}
                            _focus={{ 
                              borderColor: primaryColor,
                              boxShadow: `0 0 0 1px ${primaryColor}`,
                              borderWidth: '2px'
                            }}
                            bg={cardBg}
                            fontWeight="medium"
                          />
                        </Box>
                      </SimpleGrid>
                      <Text mt={2} fontSize="xs" color={mutedTextColor} fontStyle="italic">
                        Selecciona el rango horario para esta programación
                      </Text>
                      
                      {/* Selector de días */}
                      <Box mt={4}>
                        <Flex align="center" mb={2}>
                          <Icon as={FaCalendarAlt} color={primaryColor} mr={2} />
                          <Text fontWeight="semibold" color={textColor}>
                            Días de la semana:
                          </Text>
                        </Flex>
                        <Flex justify="space-between" width="100%" pb={2}>
                          {weekDays.map((day) => (
                            <Checkbox
                              key={day.id}
                              isChecked={selectedDays[day.id]}
                              onChange={() => handleDayToggle(day.id)}
                              colorScheme="blue"
                              size="sm"
                              flex="1"
                              minW="auto"
                              maxW="100%"
                              height="36px"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              borderRadius="md"
                              borderWidth="1px"
                              borderColor={selectedDays[day.id] ? primaryColor : borderColor}
                              mx="1px"
                              bg={selectedDays[day.id] ? blueBg : 'transparent'}
                              _hover={{
                                bg: selectedDays[day.id] ? blueBg : 'blackAlpha.50',
                                _dark: {
                                  bg: selectedDays[day.id] ? 'blue.800' : 'whiteAlpha.100',
                                }
                              }}
                              _checked={{
                                bg: blueBg,
                                borderColor: primaryColor,
                              }}
                              sx={{
                                '.chakra-checkbox__label': {
                                  fontSize: '0.75rem',
                                  fontWeight: 'bold',
                                  padding: '0',
                                  width: '100%',
                                  textAlign: 'center',
                                  display: 'inline-block',
                                  lineHeight: '1.2',
                                  flex: 1
                                },
                                '.chakra-checkbox__control': {
                                  display: 'none'
                                }
                              }}
                            >
                              {day.label}
                            </Checkbox>
                          ))}
                        </Flex>
                        {!isAnyDaySelected && (
                          <Text fontSize="xs" color="orange.500" fontStyle="italic" mt={1}>
                            Se usará solo hoy
                          </Text>
                        )}
                      </Box>
                    </Box>

                    {/* Sección de tipo de programación */}
                    <Box>
                      <Flex align="center" mb={4}>
                        <Icon as={FaSlidersH} color={primaryColor} mr={2} />
                        <Text fontWeight="semibold" color={textColor}>
                          Tipo de programación
                        </Text>
                      </Flex>
                      <RadioGroup 
                        onChange={(value) => setScheduleType(value)}
                        value={scheduleType}
                        mb={4}
                      >
                        <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                          <Box
                            as="label"
                            flex="1"
                            p={4}
                            borderRadius="md"
                            borderWidth="1px"
                            borderColor={scheduleType === 'mode' ? primaryColor : borderColor}
                            bg={scheduleType === 'mode' ? blueBg : cardBg}
                            _hover={{ borderColor: scheduleType === 'mode' ? primaryColor : 'gray.300' }}
                            cursor="pointer"
                            transition="all 0.2s"
                          >
                            <Radio
                              value="mode"
                              colorScheme="blue"
                              isChecked={scheduleType === 'mode'}
                              display="none"
                            />
                            <Flex direction="column" align="center">
                              <Icon as={FaSlidersH} color={scheduleType === 'mode' ? primaryColor : mutedTextColor} boxSize={6} mb={2} />
                              <Text fontWeight="medium" color={scheduleType === 'mode' ? primaryColor : textColor}>
                                Modo de operación
                              </Text>
                              <Text fontSize="sm" color={mutedTextColor} textAlign="center" mt={1}>
                                Selecciona un modo predefinido
                              </Text>
                            </Flex>
                          </Box>
                          <Box
                            as="label"
                            flex="1"
                            p={4}
                            borderRadius="md"
                            borderWidth="1px"
                            borderColor={scheduleType === 'temp' ? 'purple.500' : borderColor}
                            bg={scheduleType === 'temp' ? purpleBg : cardBg}
                            _hover={{ borderColor: scheduleType === 'temp' ? 'purple.500' : 'gray.300' }}
                            cursor="pointer"
                            transition="all 0.2s"
                          >
                            <Radio
                              value="temp"
                              colorScheme="purple"
                              isChecked={scheduleType === 'temp'}
                              display="none"
                            />
                            <Flex direction="column" align="center">
                              <Icon as={FaTemperatureHigh} color={scheduleType === 'temp' ? 'purple.500' : mutedTextColor} boxSize={6} mb={2} />
                              <Text fontWeight="medium" color={scheduleType === 'temp' ? 'purple.500' : textColor}>
                                Temperatura específica
                              </Text>
                              <Text fontSize="sm" color={mutedTextColor} textAlign="center" mt={1}>
                                Establece una temperatura exacta
                              </Text>
                            </Flex>
                          </Box>
                        </Stack>
                      </RadioGroup>

                      {scheduleType === 'mode' ? (
                        <Tabs variant="unstyled" width="100%" mt={4}>
                          <TabList mb={4} borderBottom="1px" borderColor="gray.200" pb={1}>
                            <Tab 
                              _selected={{ color: primaryColor, borderBottom: '2px solid', borderColor: primaryColor }}
                              color={mutedTextColor}
                              fontWeight="medium"
                              px={4}
                              py={2}
                              mr={4}
                            >
                              Modo de operación
                            </Tab>
                          </TabList>

                          <TabPanels>
                            <TabPanel p={0}>
                              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3}>
                                {[
                                  { value: 'min', label: 'Mínimo', icon: FaThermometerEmpty, color: 'min' },
                                  { value: 'max', label: 'Máximo', icon: FaThermometerFull, color: 'max' },
                                  { value: 'pilot', label: 'Piloto', icon: FaFire, color: 'pilot' },
                                  { value: 'off', label: 'Apagado', icon: FaPowerOff, color: 'off' }
                                ].map((mode) => {
                                  const modeColor = getModeColor(mode.color);
                                  return (
                                    <Box
                                      key={mode.value}
                                      as="button"
                                      type="button"
                                      onClick={() => setTargetMode(mode.value)}
                                      borderWidth="1px"
                                      borderRadius="lg"
                                      p={3}
                                      bg={targetMode === mode.value ? modeColor.light : grayBg}
                                      borderColor={targetMode === mode.value ? modeColor.border : borderColor}
                                      _hover={{
                                        borderColor: modeColor.border,
                                        transform: 'translateY(-2px)',
                                        boxShadow: 'sm'
                                      }}
                                      transition="all 0.2s"
                                    >
                                      <VStack spacing={2}>
                                        <Box
                                          p={2}
                                          borderRadius="full"
                                          bg={modeColor.light}
                                          color={modeColor.icon}
                                        >
                                          <Icon as={mode.icon} boxSize={5} />
                                        </Box>
                                        <Text 
                                          fontSize="sm" 
                                          fontWeight="medium"
                                          color={modeColor.text}
                                        >
                                          {mode.label}
                                        </Text>
                                      </VStack>
                                    </Box>
                                  );
                                })}
                              </SimpleGrid>
                            </TabPanel>
                          </TabPanels>
                        </Tabs>
                      ) : (
                        <Box width="100%" mt={4}>
                          <Flex align="center" mb={3}>
                            <Icon as={FaTemperatureHigh} color="purple.500" mr={2} />
                            <Text fontWeight="semibold" color={textColor}>
                              Temperatura objetivo
                            </Text>
                          </Flex>
                          <Box 
                            p={4} 
                            borderRadius="lg" 
                            bg={purpleBg}
                            borderWidth="1px"
                            borderColor={purpleBorder}
                          >
                            <Flex justify="space-between" mb={2} align="center">
                              <Text fontSize="sm" color={purpleText} fontWeight="medium">
                                Temperatura seleccionada:
                              </Text>
                              <Badge 
                                colorScheme="purple" 
                                fontSize="0.9em" 
                                px={3} 
                                py={1} 
                                borderRadius="full"
                                bg={whiteOrPurpleDark}
                                color={purpleOrWhite}
                                borderColor={purpleBorder}
                              >
                                {targetTemp}°C
                              </Badge>
                            </Flex>
                            <Box px={2} mb={2}>
                              <Slider
                                aria-label='Temperatura objetivo'
                                value={targetTemp}
                                min={15}
                                max={30}
                                step={0.5}
                                onChange={(val) => setTargetTemp(val)}
                                onMouseEnter={() => setShowTooltip(true)}
                                onMouseLeave={() => setShowTooltip(false)}
                                focusThumbOnChange={false}
                              >
                                <SliderTrack 
                                  bg={purpleLightBg}
                                  height="8px"
                                  borderRadius="full"
                                >
                                  <SliderFilledTrack bg="purple.500" />
                                </SliderTrack>
                                <Tooltip
                                  hasArrow
                                  bg='purple.500'
                                  color='white'
                                  placement='top'
                                  isOpen={showTooltip}
                                  label={`${targetTemp}°C`}
                                  fontSize="md"
                                  fontWeight="bold"
                                  px={3}
                                  py={1}
                                  borderRadius="md"
                                >
                                  <SliderThumb 
                                    boxSize={6}
                                    borderWidth="2px"
                                    borderColor="white"
                                    _focus={{ boxShadow: '0 0 0 3px var(--chakra-colors-purple-200)' }}
                                  >
                                    <Box 
                                      color='purple.500' 
                                      as={FaTemperatureHigh} 
                                      boxSize={4}
                                      transition="transform 0.2s"
                                      _hover={{ transform: 'scale(1.2)' }}
                                    />
                                  </SliderThumb>
                                </Tooltip>
                              </Slider>
                              <Flex justify="space-between" mt={2} px={1}>
                                <Text fontSize="xs" color={purpleMutedText} fontWeight="medium">
                                  15°C
                                </Text>
                                <Text fontSize="xs" color={purpleMutedText} fontWeight="medium">
                                  30°C
                                </Text>
                              </Flex>
                            </Box>
                            <Text fontSize="xs" color={purpleMutedText} mt={2} textAlign="center">
                              Arrastra el control deslizante para ajustar la temperatura
                            </Text>
                          </Box>
                        </Box>
                      )}
                    </Box>

                    <Button
                      leftIcon={<FaPlus />}
                      rightIcon={<FaArrowRight />}
                      colorScheme="blue"
                      width="100%"
                      onClick={handleAddSchedule}
                      isDisabled={!startTime || !endTime}
                      size="lg"
                      height="56px"
                      borderRadius="lg"
                      bgGradient={`linear(to-r, ${blueGradientFrom}, ${blueGradientTo})`}
                      color="white"
                      _hover={{
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(49, 130, 206, 0.3)'
                      }}
                      _disabled={{
                        bgGradient: blueGradient,
                        transform: 'none',
                        boxShadow: 'none',
                        opacity: 0.7,
                        cursor: 'not-allowed'
                      }}
                      _active={{
                        transform: 'translateY(0)',
                        boxShadow: '0 2px 4px rgba(49, 130, 206, 0.2)',
                      }}
                      _focus={{
                        boxShadow: `0 0 0 3px ${blueFocusShadow}`,
                      }}
                      transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
                      fontWeight="semibold"
                      letterSpacing="wide"
                    >
                      Agregar programación
                    </Button>
                  </VStack>
                </CardBody>
              </Card>

              {/* Lista de horarios programados */}
              <Card 
                variant="outline" 
                borderColor={borderColor}
                borderRadius="lg"
                overflow="hidden"
                boxShadow="sm"
                mt={6}
              >
                <CardBody>
                  <Text 
                    fontSize="lg" 
                    fontWeight="bold" 
                    mb={4}
                    color={grayTextColor}
                  >
                    Horarios programados
                  </Text>
                  {localSchedules.length === 0 ? (
                    <Box textAlign="center" py={4}>
                      <Text color="gray.500" width="100%" mb={2}>
                        No hay horarios programados
                      </Text>
                      <Text fontSize="sm" color={grayText}>
                        Añade tu primera programación usando el formulario superior
                      </Text>
                    </Box>
                  ) : (
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                      {localSchedules.map((schedule, index) => {
                        const isTempMode = schedule.type === 'temp';
                        const colorScheme = isTempMode ? 'purple' : 'blue';
                        const icon = isTempMode ? FaTemperatureHigh : getModeIcon(schedule.targetMode);
                        
                        return (
                          <Box
                            key={index}
                            p={4}
                            bg={grayBg}
                            borderRadius="lg"
                            borderWidth="1px"
                            borderColor={borderColor}
                            position="relative"
                            overflow="hidden"
                            _before={{
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '4px',
                              height: '100%',
                              bg: isTempMode 
                                ? purpleAccent
                                : getModeColor(schedule.targetMode),
                            }}
                            _hover={{
                              transform: 'translateY(-2px)',
                              boxShadow: 'lg',
                              '& .schedule-actions': {
                                opacity: 1,
                                transform: 'translateX(0)'
                              }
                            }}
                            transition="all 0.2s"
                          >
                            <Flex justify="space-between" align="flex-start">
                              <Flex align="center">
                                <Box
                                  p={2}
                                  mr={3}
                                  borderRadius="lg"
                                  bg={getModeColor(isTempMode ? 'temp' : (schedule.targetMode || schedule.mode)).light}
                                  color={getModeColor(isTempMode ? 'temp' : (schedule.targetMode || schedule.mode)).icon}
                                >
                                  <Icon as={icon} boxSize={5} />
                                </Box>
                                <Box>
                                  <Flex direction="column">
                                    <Flex justify="space-between" align="center" mb={1}>
                                      <Text fontWeight="semibold" color={textColor} fontSize="md">
                                        {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                                      </Text>
                                      <Box 
                                        display="inline-flex"
                                        alignItems="center"
                                        px={2}
                                        py={0.5}
                                        borderRadius="md"
                                        bg={getModeColor(isTempMode ? 'temp' : (schedule.targetMode || schedule.mode)).light}
                                        borderWidth="1px"
                                        borderColor={getModeColor(isTempMode ? 'temp' : (schedule.targetMode || schedule.mode)).border}
                                        color={getModeColor(isTempMode ? 'temp' : (schedule.targetMode || schedule.mode)).text}
                                      >
                                        {isTempMode ? (
                                          <>
                                            <Icon as={FaThermometerHalf} mr={1} />
                                            <Text fontSize="sm">
                                              {schedule.temperature}°C
                                            </Text>
                                          </>
                                        ) : (
                                          <>
                                            <Icon 
                                              as={getModeIcon(schedule.targetMode || schedule.mode)} 
                                              mr={1}
                                            />
                                            <Text fontSize="sm">
                                              {getModeLabel(schedule)}
                                            </Text>
                                          </>
                                        )}
                                      </Box>
                                    </Flex>
                                  </Flex>
                                
                                  {/* Días seleccionados */}
                                  <Flex mt={2} align="center">
                                    <Text 
                                      color={isDarkMode ? 'gray.400' : 'gray.600'} 
                                      mr={2} 
                                      fontWeight="semibold"
                                      letterSpacing="wide"
                                      textTransform="uppercase"
                                      fontSize="0.7rem"
                                    >
                                      Días:
                                    </Text>
                                    <Flex wrap="wrap" gap={1}>
                                      {(() => {
                                        const days = schedule.days || selectedDays;
                                        const selectedDayCount = Object.values(days).filter(Boolean).length;
                                        
                                        if (selectedDayCount === 7) {
                                          return (
                                            <Text fontSize="xs" color={mutedTextColor}>
                                              Todos los días
                                            </Text>
                                          );
                                        }
                                       
                                        // Obtener los días seleccionados con sus nombres completos (sin duplicados)
                                        const selectedDaysList = [];
                                        const addedDays = new Set();
                                        
                                        weekDays.forEach(day => {
                                          if (days[day.id] && !addedDays.has(day.fullLabel)) {
                                            selectedDaysList.push({
                                              id: day.id,
                                              name: day.fullLabel.charAt(0).toUpperCase() + day.fullLabel.slice(1)
                                            });
                                            addedDays.add(day.fullLabel);
                                          }
                                        });
                                        
                                        // Mostrar los días únicos
                                        return (
                                          <Text fontSize="xs" color={mutedTextColor}>
                                            {selectedDaysList.map((day, index) => (
                                              <React.Fragment key={day.id}>
                                                <span style={{ textTransform: 'capitalize' }}>{day.name}</span>
                                                {index < selectedDaysList.length - 1 ? ', ' : ''}
                                              </React.Fragment>
                                            ))}
                                          </Text>
                                        );
                                      })()}
                                    </Flex>
                                  </Flex>
                                </Box>
                              </Flex>
                              
                              <Box 
                                className="schedule-actions"
                                opacity={{ base: 1, md: 0 }}
                                transform={{ base: 'none', md: 'translateX(10px)' }}
                                transition="all 0.2s"
                              >
                                <Tooltip label="Eliminar programación" placement="top" hasArrow>
                                  <IconButton
                                    icon={<FaTrash />}
                                    aria-label="Eliminar programación"
                                    colorScheme="red"
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveSchedule(schedule.id);
                                    }}
                                  />
                                </Tooltip>
                              </Box>
                            </Flex>
                            
                            <Flex 
                              mt={2} 
                              fontSize="xs" 
                              color={grayText}
                              justify="space-between"
                              align="center"
                              flexWrap="wrap"
                              gap={1}
                            >
                              <Text>
                                {getNextOccurrence(schedule.startTime, schedule.endTime)}
                              </Text>
                            </Flex>
                          </Box>
                        );
                      })}
                    </SimpleGrid>
                  ) : (
                    <Box width="100%" pt={2}>
                      <Flex align="center" mb={4}>
                        <Icon as={FaTemperatureHigh} color="purple.500" mr={2} />
                        <Text fontWeight="semibold" color={textColor}>
                          Temperatura objetivo
                        </Text>
                      </Flex>
                      <Box 
                        p={4} 
                        borderRadius="lg" 
                        bg={purpleBg}
                        borderWidth="1px"
                        borderColor={purpleBorder}
                      >
                      <Flex justify="space-between" mb={2} align="center">
                        <Text fontSize="sm" color={purpleText} fontWeight="medium">
                          Temperatura seleccionada:
                        </Text>
                        <Badge 
                          colorScheme="purple" 
                          fontSize="0.9em" 
                          px={3} 
                          py={1} 
                          borderRadius="full"
                          bg={whiteOrPurpleDark}
                          color={purpleOrWhite}
                          borderColor={purpleBorder}
                        >
                          {targetTemp}°C
                        </Badge>
                      </Flex>
                      <Box px={2} mb={2}>
                        <Slider
                          aria-label='Temperatura objetivo'
                          value={targetTemp}
                          min={15}
                          max={30}
                          step={0.5}
                          onChange={(val) => setTargetTemp(val)}
                          onMouseEnter={() => setShowTooltip(true)}
                          onMouseLeave={() => setShowTooltip(false)}
                          focusThumbOnChange={false}
                        >
                          <SliderTrack 
                            bg={purpleLightBg}
                            height="8px"
                            borderRadius="full"
                          >
                            <SliderFilledTrack bg="purple.500" />
                          </SliderTrack>
                          <Tooltip
                            hasArrow
                            bg='purple.500'
                            color='white'
                            placement='top'
                            isOpen={showTooltip}
                            label={`${targetTemp}°C`}
                            fontSize="md"
                            fontWeight="bold"
                            px={3}
                            py={1}
                            borderRadius="md"
                          >
                            <SliderThumb 
                              boxSize={6}
                              borderWidth="2px"
                              borderColor="white"
                              _focus={{ boxShadow: '0 0 0 3px var(--chakra-colors-purple-200)' }}
                            >
                              <Box 
                                color='purple.500' 
                                as={FaTemperatureHigh} 
                                boxSize={4}
                                transition="transform 0.2s"
                                _hover={{ transform: 'scale(1.2)' }}
                              />
                            </SliderThumb>
                          </Tooltip>
                        </Slider>
                        <Flex justify="space-between" mt={2} px={1}>
                          <Text fontSize="xs" color={purpleMutedText} fontWeight="medium">
                            15°C
                          </Text>
                          <Text fontSize="xs" color={purpleMutedText} fontWeight="medium">
                            30°C
                          </Text>
                        </Flex>
                      </Box>
                      <Text fontSize="xs" color={purpleMutedText} mt={2} textAlign="center">
                        Arrastra el control deslizante para ajustar la temperatura
                      </Text>
                      </Box>
                    </Box>
                  )}

                <Button
                  leftIcon={<FaPlus />}
                  rightIcon={<FaArrowRight />}
                  colorScheme="blue"
                  width="100%"
                  onClick={handleAddSchedule}
                  isDisabled={!startTime || !endTime}
                  size="lg"
                  height="56px"
                  borderRadius="lg"
                  bgGradient={`linear(to-r, ${blueGradientFrom}, ${blueGradientTo})`}
                  color="white"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(49, 130, 206, 0.3)'
                  }}
                  _disabled={{
                    bgGradient: blueGradient,
                    transform: 'none',
                    boxShadow: 'none',
                    opacity: 0.7,
                    cursor: 'not-allowed'
                  }}
                  _active={{
                    transform: 'translateY(0)',
                    boxShadow: '0 2px 4px rgba(49, 130, 206, 0.2)',
                  }}
                  _focus={{
                    boxShadow: `0 0 0 3px ${blueFocusShadow}`,
                  }}
                  transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
                  fontWeight="semibold"
                  letterSpacing="wide"
                >
                  Agregar programación
                </Button>
              </VStack>
            </CardBody>
          </Card>

          {/* Lista de horarios programados */}
          <Card 
            variant="outline" 
            borderColor={borderColor}
            borderRadius="lg"
            overflow="hidden"
            boxShadow="sm"
          >
            <CardBody>
              <Text 
                fontSize="lg" 
                fontWeight="bold" 
                mb={4}
                color={grayTextColor}
              >
                Horarios programados
              </Text>
              {localSchedules.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <Text color="gray.500" width="100%" mb={2}>
                    No hay horarios programados
                  </Text>
                  <Text fontSize="sm" color={grayText}>
                    Añade tu primera programación usando el formulario superior
                  </Text>
                </Box>
              ) : (
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                  {localSchedules.map((schedule, index) => {
                    const isTempMode = schedule.type === 'temp';
                    const icon = isTempMode ? FaTemperatureHigh : getModeIcon(schedule.targetMode);
                    
                    return (
                      <Box
                        key={schedule.id || index}
                        p={4}
                        bg={grayBg}
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor={borderColor}
                        position="relative"
                        overflow="hidden"
                        _before={{
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '4px',
                          height: '100%',
                          bg: isTempMode ? purpleAccent : getModeColor(schedule.targetMode).icon
                        }}
                        _hover={{
                          transform: 'translateY(-2px)',
                          boxShadow: 'lg',
                          '& .schedule-actions': {
                            opacity: 1,
                            transform: 'translateX(0)'
                          }
                        }}
                        transition="all 0.2s"
                      >
                        <Flex justify="space-between" align="flex-start">
                          <Flex align="center">
                            <Box
                              p={2}
                              mr={3}
                              borderRadius="lg"
                              bg={getModeColor(isTempMode ? 'temp' : (schedule.targetMode || schedule.mode)).light}
                              color={getModeColor(isTempMode ? 'temp' : (schedule.targetMode || schedule.mode)).icon}
                            >
                              <Icon as={icon} boxSize={5} />
                            </Box>
                            <Box>
                              <Flex direction="column">
                                <Flex justify="space-between" align="center" mb={1}>
                                  <Text fontWeight="semibold" color={textColor} fontSize="md">
                                    {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                                  </Text>
                                  <Box 
                                    display="inline-flex"
                                    alignItems="center"
                                    px={2}
                                    py={0.5}
                                    borderRadius="md"
                                    bg={getModeColor(isTempMode ? 'temp' : (schedule.targetMode || schedule.mode)).light}
                                    borderWidth="1px"
                                    borderColor={getModeColor(isTempMode ? 'temp' : (schedule.targetMode || schedule.mode)).border}
                                    color={getModeColor(isTempMode ? 'temp' : (schedule.targetMode || schedule.mode)).text}
                                  >
                                    {isTempMode ? (
                                      <>
                                        <Icon as={FaThermometerHalf} mr={1} />
                                        <Text fontSize="sm">
                                          {schedule.temperature}°C
                                        </Text>
                                      </>
                                    ) : (
                                      <>
                                        <Icon 
                                          as={getModeIcon(schedule.targetMode || schedule.mode)} 
                                          mr={1}
                                        />
                                        <Text fontSize="sm">
                                          {getModeLabel(schedule)}
                                        </Text>
                                      </>
                                    )}
                                  </Box>
                                </Flex>
                              </Box>
                              {/* Días seleccionados */}
                              <Flex mt={2} align="center">
                                <Text 
                                  color={isDarkMode ? 'gray.400' : 'gray.600'} 
                                  mr={2} 
                                  fontWeight="semibold"
                                  letterSpacing="wide"
                                  textTransform="uppercase"
                                  fontSize="0.7rem"
                                >
                                  Días:
                                </Text>
                                <Flex wrap="wrap" gap={1}>
                                  {(() => {
                                    const days = schedule.days || selectedDays;
                                    const selectedDayCount = Object.values(days).filter(Boolean).length;
                                    
                                    if (selectedDayCount === 7) {
                                      return (
                                        <Text fontSize="xs" color={mutedTextColor}>
                                          Todos los días
                                        </Text>
                                      );
                                    }
                                    
                                    // Obtener los días seleccionados con sus nombres completos (sin duplicados)
                                    const selectedDaysList = [];
                                    const addedDays = new Set();
                                    
                                    weekDays.forEach(day => {
                                      if (days[day.id] && !addedDays.has(day.fullLabel)) {
                                        selectedDaysList.push({
                                          id: day.id,
                                          name: day.fullLabel.charAt(0).toUpperCase() + day.fullLabel.slice(1)
                                        });
                                        addedDays.add(day.fullLabel);
                                      }
                                    });
                                    
                                    // Mostrar los días únicos
                                    return (
                                      <Text fontSize="xs" color={mutedTextColor}>
                                        {selectedDaysList.map((day, index) => (
                                          <React.Fragment key={day.id}>
                                            <span style={{ textTransform: 'capitalize' }}>{day.name}</span>
                                            {index < selectedDaysList.length - 1 ? ', ' : ''}
                                          </React.Fragment>
                                        ))}
                                      </Text>
                                    );
                                  })()}
                                </Flex>
                              </Flex>
                            </Box>
                          </Flex>
                          <Box 
                            className="schedule-actions"
                            opacity={{ base: 1, md: 0 }}
                            transform={{ base: 'none', md: 'translateX(10px)' }}
                            transition="all 0.2s"
                          >
                            <Tooltip label="Eliminar programación" placement="top" hasArrow>
                              <IconButton
                                icon={<FaTrash />}
                                aria-label="Eliminar programación"
                                colorScheme="red"
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveSchedule(schedule.id);
                                }}
                              />
                            </Tooltip>
                          </Box>
                        </Flex>
                        <Flex 
                          mt={2} 
                          fontSize="xs" 
                          color={grayText}
                          justify="space-between"
                          align="center"
                          flexWrap="wrap"
                          gap={1}
                        >
                          <Text>
                            {getNextOccurrence(schedule.startTime, schedule.endTime)}
                          </Text>
                        </Flex>
                      </Box>
                    );
                  })}
                </SimpleGrid>
              )}
            </CardBody>
          </Card>
        </VStack>
      </ModalBody>
      
      <ModalFooter 
        borderTopWidth="1px" 
        borderColor={borderColor}
        position="sticky"
        bottom="0"
        bg={cardBg}
        zIndex="sticky"
        boxShadow="0 -4px 12px rgba(0, 0, 0, 0.05)"
        _dark={{
          bg: 'gray.800',
          borderColor: 'gray.700',
          boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.3)'
        }}
        px={6}
        py={4}
        display="flex"
        flexDirection={{ base: 'column', sm: 'row' }}
        gap={3}
      >
        <Button 
          variant="outline" 
          onClick={onClose}
          isDisabled={isSubmitting}
          size="sm"
          flex="1"
          mr={3}
        >
          Cancelar
        </Button>
        <Button 
          colorScheme="blue" 
          onClick={handleSave}
          isDisabled={localSchedules.length === 0 || isSubmitting}
          isLoading={isSubmitting}
          loadingText="Guardando..."
          size="sm"
          flex="1"
        >
          Guardar cambios
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
  );
};

export default ScheduleManager;