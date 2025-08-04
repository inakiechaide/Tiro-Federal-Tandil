import React, { useState, useEffect } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalFooter, ModalBody,
  VStack, Button, Card, CardBody, Text, SimpleGrid, Box, Input, Flex,
  Slider, SliderTrack, SliderFilledTrack, SliderThumb, Wrap, WrapItem,
  Checkbox, IconButton, useColorModeValue, RadioGroup, Radio, Stack, Select,
  useToast
} from '@chakra-ui/react';
import { FaPlus, FaTrash, FaPowerOff, FaSnowflake, FaFire, FaMagic, FaLeaf, FaSun } from 'react-icons/fa';

const WEEK_DAYS = [
  { id: 'monday', label: 'L', fullLabel: 'Lunes', fullLabelShort: 'Lun' },
  { id: 'tuesday', label: 'M', fullLabel: 'Martes', fullLabelShort: 'Mar' },
  { id: 'wednesday', label: 'X', fullLabel: 'Miércoles', fullLabelShort: 'Mié' },
  { id: 'thursday', label: 'J', fullLabel: 'Jueves', fullLabelShort: 'Jue' },
  { id: 'friday', label: 'V', fullLabel: 'Viernes', fullLabelShort: 'Vie' },
  { id: 'saturday', label: 'S', fullLabel: 'Sábado', fullLabelShort: 'Sáb' },
  { id: 'sunday', label: 'D', fullLabel: 'Domingo', fullLabelShort: 'Dom' }
];



const MODES = {
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
  }
};

const AUTO_MODE = { 
  label: 'Automático', 
  color: 'purple',
  bgColor: 'white',
  hoverBg: 'purple.50',
  textColor: 'purple.800',
  darkBg: 'gray.800',
  darkHover: 'purple.900',
  darkText: 'purple.100',
  borderColor: 'purple.200',
  darkBorder: 'purple.600'
};

const ScheduleManager = ({ isOpen, onClose, onSave, schedules = [] }) => {
  // State for form
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('09:00');
  const [selectedOption, setSelectedOption] = useState('off'); // 'off', 'pilot', 'min', 'max', 'temp'
  const [targetTemp, setTargetTemp] = useState(21);
  const [selectedDays, setSelectedDays] = useState(
    WEEK_DAYS.reduce((acc, day) => ({
      ...acc,
      [day.id]: false
    }), {})
  );
  const [localSchedules, setLocalSchedules] = useState(schedules);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Theme colors
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.300');
  const primaryColor = useColorModeValue('blue.500', 'blue.300');
  const hoverBg = useColorModeValue('blue.50', 'blue.900');
  const headerBg = useColorModeValue('blue.600', 'blue.700');
  const headerTextColor = 'white';
  const buttonPrimary = useColorModeValue('blue.500', 'blue.400');
  const buttonHover = useColorModeValue('blue.600', 'blue.300');
  const buttonActive = useColorModeValue('blue.700', 'blue.200');
  const dangerColor = useColorModeValue('red.500', 'red.400');
  const dangerHover = useColorModeValue('red.600', 'red.300');
  const successColor = useColorModeValue('green.500', 'green.400');
  const inputBg = useColorModeValue('white', 'gray.700');
  const inputBorder = useColorModeValue('gray.300', 'gray.500');
  const daySelectedBg = useColorModeValue('blue.100', 'blue.700');
  const daySelectedColor = useColorModeValue('blue.700', 'blue.100');
  const dayHoverBg = useColorModeValue('blue.50', 'blue.800');
  const activeBg = useColorModeValue('blue.100', 'blue.800');

  // Sync with props
  useEffect(() => {
    setLocalSchedules(schedules);
  }, [schedules]);

  // Handle time change with validation
  const handleTimeChange = (time, setTime, isStartTime = true) => {
    // Basic validation to prevent invalid times
    if (!time || !time.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      return;
    }
    
    setTime(time);
    
    // If the user is setting the start time and it's after the end time, adjust end time
    if (isStartTime && time >= endTime) {
      const [hours, minutes] = time.split(':').map(Number);
      const newEndTime = new Date();
      newEndTime.setHours(hours + 1, minutes);
      
      // Format to HH:MM
      const formattedEndTime = `${newEndTime.getHours().toString().padStart(2, '0')}:${newEndTime.getMinutes().toString().padStart(2, '0')}`;
      setEndTime(formattedEndTime);
      
      toast({
        title: 'Ajuste automático',
        description: 'La hora de fin se ha ajustado para ser 1 hora después de la hora de inicio',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getNextOccurrence = (start, end) => {
    return `Próximo: Hoy ${start} - ${end}`;
  };

  // Event handlers
  const hasTimeOverlap = (schedule1, schedule2) => {
    // Si los horarios no se superponen
    if (schedule1.endTime <= schedule2.startTime || schedule1.startTime >= schedule2.endTime) {
      return false;
    }
    
    // Verificar si hay al menos un día en común
    // Si no hay días seleccionados en la nueva programación, se aplica a todos los días
    const schedule1Days = Object.entries(schedule1.days).filter(([_, selected]) => selected).map(([day]) => day);
    const schedule2Days = Object.entries(schedule2.days).filter(([_, selected]) => selected).map(([day]) => day);
    
    // Si no hay días seleccionados en ninguna de las dos, se aplica a todos los días
    if (schedule1Days.length === 0 && schedule2Days.length === 0) {
      return true;
    }
    
    // Si no hay días seleccionados en la nueva programación, verificar contra todos los días de la otra
    if (schedule1Days.length === 0) {
      return schedule2Days.some(day => !schedule1.days || schedule1.days[day] !== false);
    }
    
    // Si no hay días seleccionados en la programación existente, verificar contra todos los días de la nueva
    if (schedule2Days.length === 0) {
      return schedule1Days.some(day => !schedule2.days || schedule2.days[day] !== false);
    }
    
    // Verificar si hay al menos un día en común
    return schedule1Days.some(day => schedule2Days.includes(day));
  };

  const handleDayToggle = (dayId) => {
    setSelectedDays(prev => ({
      ...prev,
      [dayId]: !prev[dayId]
    }));
  };

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
  };

  const handleAddSchedule = () => {
    // Validar rango de tiempo
    if (startTime >= endTime) {
      toast({
        title: 'Error',
        description: 'La hora de inicio debe ser anterior a la hora de fin',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    
    // Si hay temperatura, forzar modo automático
    if (targetTemp !== 21) {
      setSelectedOption('auto');
    }
    
    // Obtener el día actual (0=Domingo, 1=Lunes, ..., 6=Sábado)
    const today = new Date().getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const todayName = dayNames[today];
    
    // Si no hay días seleccionados, usar solo el día actual
    const daysToUse = Object.values(selectedDays).some(day => day) 
      ? { ...selectedDays }
      : { [todayName]: true };
    
    // Crear la nueva programación
    const newSchedule = {
      id: Date.now(),
      startTime,
      endTime,
      type: selectedOption === 'temp' ? 'temp' : 'mode',
      temperature: selectedOption === 'temp' ? targetTemp : null,
      mode: selectedOption === 'temp' ? null : selectedOption,
      days: daysToUse
    };
    
    // Verificar conflictos con programaciones existentes
    const hasConflict = localSchedules.some(existingSchedule => {
      return hasTimeOverlap(newSchedule, existingSchedule);
    });
    
    if (hasConflict) {
      toast({
        title: 'Conflicto de horario',
        description: 'Ya existe una programación activa en ese horario para los días seleccionados',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    setLocalSchedules([...localSchedules, newSchedule]);
    
    // Reset form
    resetForm();
  };

  const handleRemoveSchedule = (id) => {
    setLocalSchedules(prev => {
      const updated = prev.filter(schedule => schedule.id !== id);
      
      // If this was the last schedule, reset the form
      if (updated.length === 0) {
        resetForm();
      }
      
      return updated;
    });
  };

  const handleSaveSchedules = async () => {
    try {
      // Validate there are schedules to save
      if (localSchedules.length === 0) {
        toast({
          title: 'Error',
          description: 'No hay programaciones para guardar',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
        return;
      }
      
      setIsSubmitting(true);
      await onSave(localSchedules);
      onClose();
    } catch (error) {
      toast({
        title: 'Error al guardar',
        description: 'No se pudieron guardar las programaciones',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <ModalContent 
        bg="white"
        borderWidth="1px"
        borderColor="gray.200"
        boxShadow="xl"
        borderRadius="xl"
        overflow="hidden"
      >
        <ModalHeader 
          bg="blue.500" 
          color="white"
          borderBottomWidth="1px"
          borderColor="gray.200"
          py={4}
        >
          Programar Calefacción
        </ModalHeader>
        <ModalCloseButton color="white" _hover={{ bg: 'blackAlpha.200' }} />
        <ModalBody p={6}>
          <VStack spacing={6} align="stretch">
            {/* Formulario de nueva programación */}
            <Card w="100%" bg="white">
              <CardBody>
                <VStack spacing={4}>
                  <Box>
                    <Text mb={3} fontSize="lg" fontWeight="semibold" color="gray.600">
                      Horario
                    </Text>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <Box>
                        <Text mb={1} color="gray.400" fontSize="sm">Hora de inicio</Text>
                        <Input
                          type="time"
                          value={startTime}
                          onChange={(e) => handleTimeChange(e.target.value, setStartTime, true)}
                          borderColor="gray.200"
                          _hover={{ borderColor: 'blue.500' }}
                          _focus={{ borderColor: 'blue.500', boxShadow: `0 0 0 1px blue.500` }}
                        />
                      </Box>
                      <Box>
                        <Text mb={1} color="gray.400" fontSize="sm">Hora de fin</Text>
                        <Input
                          type="time"
                          value={endTime}
                          onChange={(e) => handleTimeChange(e.target.value, setEndTime, false)}
                          borderColor="gray.200"
                          _hover={{ borderColor: 'blue.500' }}
                          _focus={{ borderColor: 'blue.500', boxShadow: `0 0 0 1px blue.500` }}
                        />
                      </Box>
                    </SimpleGrid>
                  </Box>
                  
                  <Box w="100%" mb={6}>
                    <Text mb={4} fontSize="lg" fontWeight="semibold" color="gray.600">
                      Modo de operación
                    </Text>
                    <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3} w="100%">
                      {Object.entries(MODES).map(([key, mode]) => (
                        <Box 
                          key={key}
                          as="button"
                          p={3}
                          borderWidth="1px"
                          borderRadius="md"
                          textAlign="center"
                          bg={selectedOption === key ? mode.bgColor : mode.bgColor}
                          borderColor={mode.borderColor}
                          color={selectedOption === key ? mode.textColor : mode.textColor}
                          _dark={{
                            bg: selectedOption === key ? mode.darkBg : mode.darkBg,
                            borderColor: mode.darkBorder,
                            color: selectedOption === key ? mode.darkText : mode.darkText
                          }}
                          onClick={() => setSelectedOption(key)}
                          _hover={{
                            bg: selectedOption === key ? mode.bgColor : mode.hoverBg,
                            _dark: { 
                              bg: selectedOption === key ? mode.darkBg : mode.darkHover,
                              color: mode.darkText
                            },
                            transform: 'translateY(-2px)',
                            boxShadow: 'md'
                          }}
                          _active={{
                            transform: 'translateY(0)'
                          }}
                          transition="all 0.2s"
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                          gap={2}
                        >
                          <Box fontSize="xl">
                            {mode.icon}
                          </Box>
                          <Text fontSize="sm" fontWeight="medium">
                            {mode.label}
                          </Text>
                        </Box>
                      ))}
                    </SimpleGrid>
                  </Box>
                  
                  <Box 
                    w="100%" 
                    mt={6} 
                    pt={4} 
                    borderTopWidth="1px" 
                    borderRadius="md"
                    p={4}
                    onClick={() => setSelectedOption('auto')}
                    cursor="pointer"
                    transition="all 0.2s"
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'md',
                      bg: 'purple.50'
                    }}
                    borderColor={selectedOption === 'auto' ? 'purple.300' : 'gray.200'}
                    bg={selectedOption === 'auto' ? 'purple.50' : 'transparent'}
                    _dark={{
                      borderColor: selectedOption === 'auto' ? 'purple.500' : 'gray.600',
                      bg: selectedOption === 'auto' ? 'purple.900' : 'transparent'
                    }}
                  >
                    <Text mb={4} fontSize="lg" fontWeight="semibold" color={selectedOption === 'auto' ? 'purple.800' : 'gray.600'} _dark={{ color: selectedOption === 'auto' ? 'purple.100' : 'gray.300' }}>
                      Automático: {targetTemp}°C
                    </Text>
                    <Box px={2}>
                      <Slider
                        value={targetTemp}
                        min={15}
                        max={30}
                        step={0.5}
                        onChange={(value) => {
                          setSelectedOption('auto');
                          setTargetTemp(value);
                        }}
                        onFocus={() => setSelectedOption('auto')}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOption('auto');
                        }}
                        focusThumbOnChange={false}
                      >
                        <SliderTrack 
                          bg="gray.200"
                          h="8px"
                          borderRadius="full"
                          _dark={{ bg: 'gray.600' }}
                        >
                          <SliderFilledTrack 
                            bg="purple.500"
                            _dark={{ bg: 'purple.400' }}
                          />
                        </SliderTrack>
                        <SliderThumb 
                          boxSize={5}
                          borderWidth="2px"
                          borderColor="purple.500"
                          _dark={{ borderColor: 'purple.300' }}
                          _focus={{ boxShadow: 'none' }}
                          _active={{ transform: 'scale(1.1)' }}
                        />
                      </Slider>
                      <Flex justify="space-between" mt={2} color="gray.400" fontSize="sm">
                        <Text>15°C</Text>
                        <Text>30°C</Text>
                      </Flex>
                    </Box>
                  </Box>
                  
                  <Box w="100%">
                    <Box mb={6}>
                      <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.600">
                        Días de la semana
                      </Text>
                      <Wrap spacing={2}>
                        {WEEK_DAYS.map(day => {
                          const isSelected = selectedDays[day.id];
                          return (
                            <WrapItem key={day.id}>
                              <Button
                                size="sm"
                                variant={isSelected ? 'solid' : 'outline'}
                                colorScheme={isSelected ? 'blue' : 'gray'}
                                onClick={() => handleDayToggle(day.id)}
                                borderRadius="md"
                                fontWeight="medium"
                                minW="2.5rem"
                                px={3}
                                _hover={{
                                  bg: isSelected ? 'blue.600' : 'gray.100',
                                  transform: 'translateY(-1px)',
                                  boxShadow: 'sm'
                                }}
                                _active={{
                                  transform: 'translateY(0)'
                                }}
                                transition="all 0.2s"
                              >
                                {day.label}
                              </Button>
                            </WrapItem>
                          );
                        })}
                      </Wrap>
                    </Box>
                    <Text mt={2} fontSize="sm" color="gray.400" fontStyle="italic">
                      {Object.values(selectedDays).some(day => day) 
                        ? 'Selecciona los días para esta programación' 
                        : 'Si no seleccionas ningún día, se aplicará solo al día actual'}
                    </Text>
                  </Box>
                  
                  <Button
                    leftIcon={<FaPlus />}
                    colorScheme="blue"
                    onClick={handleAddSchedule}
                    width="100%"
                    size="lg"
                    bg="blue.500"
                    _hover={{ bg: 'blue.600', transform: 'translateY(-2px)' }}
                    _active={{ bg: 'blue.700', transform: 'translateY(0)' }}
                    boxShadow="md"
                    transition="all 0.2s"
                  >
                    Agregar Programación
                  </Button>
                </VStack>
              </CardBody>
            </Card>
            
            {/* Lista de programaciones */}
            {localSchedules.length > 0 && (
              <Box mt={6}>
                <Text mb={3} fontSize="lg" fontWeight="semibold" color="gray.600">
                  Programaciones ({localSchedules.length})
                </Text>
                <VStack spacing={3} align="stretch">
                  {localSchedules.map((schedule) => (
                    <Card 
                      key={schedule.id} 
                      variant="outline" 
                      borderColor="gray.200"
                      _hover={{
                        borderColor: 'blue.500',
                        boxShadow: 'sm',
                        transform: 'translateY(-2px)'
                      }}
                      transition="all 0.2s"
                    >
                      <CardBody p={4}>
                        <Flex justify="space-between" align="center">
                          <Box>
                            <Flex align="center" mb={1}>
                              <Box 
                                w="12px" 
                                h="12px" 
                                bg="blue.500" 
                                borderRadius="full" 
                                mr={2}
                              />
                              <Text fontWeight="bold" fontSize="lg">
                                {schedule.startTime} - {schedule.endTime}
                              </Text>
                            </Flex>
                            
                            <Box 
                              display="inline-block" 
                              bg={schedule.type === 'temp' ? 'blue.50' : 
                                 schedule.mode === 'on' ? 'red.50' : 
                                 schedule.mode === 'off' ? 'gray.50' : 'purple.50'}
                              _dark={{
                                bg: schedule.type === 'temp' ? 'blue.900' : 
                                   schedule.mode === 'on' ? 'red.900' : 
                                   schedule.mode === 'off' ? 'gray.800' : 'purple.900'
                              }}
                              px={2} 
                              py={1} 
                              borderRadius="md"
                              mb={2}
                            >
                              <Flex align="center" gap={1}>
                                <Box fontSize="md">
                                  {schedule.type === 'temp' ? '🌡️' : 
                                   schedule.mode === 'on' ? '🔥' : 
                                   schedule.mode === 'off' ? '❄️' : '⚙️'}
                                </Box>
                                <Text 
                                  fontSize="sm" 
                                  color={schedule.type === 'temp' ? 'blue.600' : 
                                         schedule.mode === 'on' ? 'red.600' : 
                                         schedule.mode === 'off' ? 'gray.600' : 'purple.600'}
                                  _dark={{
                                    color: schedule.type === 'temp' ? 'blue.200' : 
                                           schedule.mode === 'on' ? 'red.200' : 
                                           schedule.mode === 'off' ? 'gray.200' : 'purple.200'
                                  }}
                                  fontWeight="medium"
                                >
                                  {schedule.type === 'temp' 
                                    ? `Auto (${schedule.temperature}°C)`
                                    : `${schedule.mode.charAt(0).toUpperCase() + schedule.mode.slice(1)}`}
                                </Text>
                              </Flex>
                            </Box>
                            
                            <Flex wrap="wrap" gap={1} mt={2}>
                              {Object.entries(schedule.days || {})
                                .filter(([_, selected]) => selected)
                                .map(([day]) => {
                                  const dayObj = WEEK_DAYS.find(d => d.id === day);
                                  return dayObj ? (
                                    <Box
                                      key={day}
                                      bg="blue.50"
                                      color="blue.600"
                                      px={2}
                                      py={0.5}
                                      borderRadius="md"
                                      fontSize="xs"
                                      fontWeight="medium"
                                    >
                                      {dayObj.label}
                                    </Box>
                                  ) : null;
                                })}
                            </Flex>
                          </Box>
                          <IconButton
                            icon={<FaTrash />}
                            aria-label="Eliminar programación"
                            size="sm"
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => handleRemoveSchedule(schedule.id)}
                            _hover={{ bg: 'red.50', color: 'red.500' }}
                          />
                        </Flex>
                      </CardBody>
                    </Card>
                  ))}
                </VStack>
              </Box>
            )}
          </VStack>
        </ModalBody>
        
        <ModalFooter bg="gray.50" _dark={{ bg: 'gray.800' }} borderBottomRadius="xl" p={4}>
          <Button 
            variant="outline" 
            mr={3} 
            isLoading={isSubmitting}
            loadingText="Guardando..."
            transition="all 0.2s"
            boxShadow="md"
          >
            Guardar cambios
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ScheduleManager;