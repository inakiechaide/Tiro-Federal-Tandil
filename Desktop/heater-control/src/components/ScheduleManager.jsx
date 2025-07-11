import React, { useState, useEffect } from 'react';
import {
  Modal, ModalOverlay, ModalContent, Heading, ModalHeader,
  ModalFooter, ModalBody, ModalCloseButton, Button, VStack,
  HStack, Text, Select, Input, Box, useToast, Divider,
  SimpleGrid, IconButton, RadioGroup, Radio, Stack, NumberInput,
  NumberInputField, NumberInputStepper, NumberIncrementStepper,
  NumberDecrementStepper, Badge, Slider, SliderTrack,
  SliderFilledTrack, SliderThumb, SliderMark, useColorModeValue,
  Card, CardBody, Flex, Icon, Tooltip, Spinner, Checkbox,
  CheckboxGroup, Wrap, WrapItem
} from '@chakra-ui/react';
import { 
  FaPlus, FaTrash, FaClock, FaTemperatureHigh, 
  FaPowerOff, FaFire, FaSlidersH, FaThermometerEmpty,
  FaThermometerFull, FaThermometerHalf, FaArrowRight,
  FaCalendarAlt, FaTimes
} from 'react-icons/fa';

// Componente principal
const ScheduleManager = ({ isOpen, onClose, onSave, schedules = [] }) => {
  // Estados básicos
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('09:00');
  const [scheduleType, setScheduleType] = useState('mode');
  const [targetMode, setTargetMode] = useState('min');
  const [targetTemp, setTargetTemp] = useState(21);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Días de la semana
  const weekDays = [
    { id: 'monday', label: 'L', fullLabel: 'Lunes', fullLabelShort: 'Lun' },
    { id: 'tuesday', label: 'M', fullLabel: 'Martes', fullLabelShort: 'Mar' },
    { id: 'wednesday', label: 'M', fullLabel: 'Miércoles', fullLabelShort: 'Mié' },
    { id: 'thursday', label: 'J', fullLabel: 'Jueves', fullLabelShort: 'Jue' },
    { id: 'friday', label: 'V', fullLabel: 'Viernes', fullLabelShort: 'Vie' },
    { id: 'saturday', label: 'S', fullLabel: 'Sábado', fullLabelShort: 'Sáb' },
    { id: 'sunday', label: 'D', fullLabel: 'Domingo', fullLabelShort: 'Dom' }
  ];
  
  const [selectedDays, setSelectedDays] = useState(
    weekDays.reduce((acc, day) => ({
      ...acc,
      [day.id]: false
    }), {})
  );
  
  const [localSchedules, setLocalSchedules] = useState(schedules);
  
  // Efecto para sincronizar las programaciones
  useEffect(() => {
    setLocalSchedules(schedules);
  }, [schedules]);
  
  // Colores y estilos
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  
  // Funciones de utilidad
  const formatTime = (time) => {
    if (!time) return '';
    return time;
  };
  
  const getNextOccurrence = (start, end) => {
    return `Próximo: Hoy ${start} - ${end}`;
  };
  
  // Manejadores de eventos
  const handleAddSchedule = () => {
    // Implementar lógica para agregar programación
  };
  
  const handleRemoveSchedule = (id) => {
    // Implementar lógica para eliminar programación
  };
  
  const handleSaveSchedules = () => {
    // Implementar lógica para guardar
  };
  
  // Render
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Gestión de Programación</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            {/* Formulario de nueva programación */}
            <Card w="100%">
              <CardBody>
                <VStack spacing={4}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="100%">
                    <Box>
                      <Text mb={2}>Hora de inicio</Text>
                      <Input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </Box>
                    <Box>
                      <Text mb={2}>Hora de fin</Text>
                      <Input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                      />
                    </Box>
                  </SimpleGrid>
                  
                  <Box w="100%">
                    <Text mb={2}>Tipo de programación</Text>
                    <RadioGroup 
                      value={scheduleType} 
                      onChange={setScheduleType}
                    >
                      <Stack direction="row">
                        <Radio value="mode">Modo</Radio>
                        <Radio value="temp">Temperatura</Radio>
                      </Stack>
                    </RadioGroup>
                  </Box>
                  
                  {scheduleType === 'temp' ? (
                    <Box w="100%" pt={2}>
                      <Text mb={2}>Temperatura objetivo: {targetTemp}°C</Text>
                      <Slider
                        value={targetTemp}
                        min={15}
                        max={30}
                        step={0.5}
                        onChange={setTargetTemp}
                      >
                        <SliderTrack>
                          <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                      </Slider>
                    </Box>
                  ) : (
                    <Box w="100%">
                      <Text mb={2}>Modo</Text>
                      <Select
                        value={targetMode}
                        onChange={(e) => setTargetMode(e.target.value)}
                      >
                        <option value="min">Mínimo</option>
                        <option value="max">Máximo</option>
                        <option value="off">Apagado</option>
                      </Select>
                    </Box>
                  )}
                  
                  <Box w="100%">
                    <Text mb={2}>Días</Text>
                    <Wrap spacing={2}>
                      {weekDays.map((day) => (
                        <WrapItem key={day.id}>
                          <Checkbox
                            isChecked={selectedDays[day.id]}
                            onChange={(e) =>
                              setSelectedDays({
                                ...selectedDays,
                                [day.id]: e.target.checked
                              })
                            }
                          >
                            {day.fullLabelShort}
                          </Checkbox>
                        </WrapItem>
                      ))}
                    </Wrap>
                  </Box>
                  
                  <Button
                    leftIcon={<FaPlus />}
                    colorScheme="blue"
                    w="100%"
                    onClick={handleAddSchedule}
                  >
                    Agregar programación
                  </Button>
                </VStack>
              </CardBody>
            </Card>
            
            {/* Lista de programaciones */}
            <Card w="100%">
              <CardBody>
                <Text fontSize="lg" fontWeight="bold" mb={4}>
                  Programaciones
                </Text>
                {localSchedules.length === 0 ? (
                  <Text>No hay programaciones guardadas</Text>
                ) : (
                  <VStack spacing={3} align="stretch">
                    {localSchedules.map((schedule, index) => (
                      <Box
                        key={index}
                        p={3}
                        borderWidth="1px"
                        borderRadius="md"
                        borderColor={borderColor}
                      >
                        <Flex justify="space-between" align="center">
                          <Box>
                            <Text fontWeight="medium">
                              {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                            </Text>
                            <Text fontSize="sm">
                              {schedule.type === 'temp' 
                                ? `${schedule.temperature}°C` 
                                : `Modo: ${schedule.mode}`}
                            </Text>
                            <Text fontSize="xs" color={mutedTextColor}>
                              {getNextOccurrence(schedule.startTime, schedule.endTime)}
                            </Text>
                          </Box>
                          <IconButton
                            icon={<FaTrash />}
                            aria-label="Eliminar"
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            onClick={() => handleRemoveSchedule(schedule.id)}
                          />
                        </Flex>
                      </Box>
                    ))}
                  </VStack>
                )}
              </CardBody>
            </Card>
          </VStack>
        </ModalBody>
        
        <ModalFooter borderTopWidth="1px" borderColor={borderColor}>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            colorScheme="blue" 
            onClick={handleSaveSchedules}
            isDisabled={localSchedules.length === 0}
          >
            Guardar cambios
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ScheduleManager;
