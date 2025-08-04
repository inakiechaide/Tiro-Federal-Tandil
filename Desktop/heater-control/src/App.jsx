import React, { useState, useCallback, useEffect, useRef } from 'react';
import { keyframes } from '@emotion/react';
import { 
  ChakraProvider, 
  Box, 
  Heading, 
  VStack, 
  Text, 
  Button, 
  Icon, 
  useToast,
  useColorModeValue,
  Flex,
  HStack,
  usePrefersReducedMotion,
  Container,
  Badge,
  CircularProgress,
  CircularProgressLabel,
  Spinner,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip
} from '@chakra-ui/react';

// Configurar toast por defecto
const toastConfig = {
  position: 'top',
  duration: 3000,
  isClosable: true,
};
import { 
  FaPowerOff, 
  FaFire, 
  FaTemperatureLow, 
  FaTemperatureHigh, 
  FaWifi, 
  FaBatteryThreeQuarters,
  FaChevronRight,
  FaExclamationTriangle,
  FaSync,
  FaClock
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { WiThermometerExterior, WiThermometer, WiThermometerInternal } from 'react-icons/wi';
import { heaterApi, SIMULATION_MODE } from './services/heaterApi';
import { ScheduleManager } from './components/schedule';

// Definición de los modos de operación para calefacción a gas
const MODES = [
  { 
    id: 'off', 
    label: 'APAGADO', 
    icon: FaPowerOff, 
    color: 'gray',
    gradient: 'linear(to-r, #718096, #4A5568)',
    description: 'Calefacción apagada',
    iconSize: '1.5em',
    temp: '--°C',
    consumption: '0 m³/h',
    flame: 'Apagado'
  },
  { 
    id: 'pilot', 
    label: 'PILOTO', 
    icon: FaFire, 
    color: 'blue',
    gradient: 'linear(to-r, #4299E1, #3182CE)',
    description: 'Llama piloto encendida',
    iconSize: '1.5em',
    temp: '18°C',
    consumption: '0.05 m³/h',
    flame: 'Piloto'
  },
  { 
    id: 'min', 
    label: 'MÍNIMO', 
    icon: FaTemperatureLow, 
    color: 'green',
    gradient: 'linear(to-r, #48BB78, #38A169)',
    description: 'Calefacción mínima',
    iconSize: '1.5em',
    temp: '21°C',
    consumption: '0.5 m³/h',
    flame: 'Baja'
  },
  { 
    id: 'max', 
    label: 'MÁXIMO', 
    icon: FaTemperatureHigh, 
    color: 'red',
    gradient: 'linear(to-r, #F56565, #E53E3E)',
    description: 'Calefacción máxima',
    iconSize: '1.5em',
    temp: '25°C',
    consumption: '1.2 m³/h',
    flame: 'Alta'
  },
];

// Animaciones
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(66, 153, 225, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(66, 153, 225, 0); }
  100% { box-shadow: 0 0 0 0 rgba(66, 153, 225, 0); }
`;

const MotionBox = motion(Box);
const MotionButton = motion(Button);

function App() {
  const [mode, setMode] = useState('off');
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [currentTemp, setCurrentTemp] = useState(0);
  const [targetTemp, setTargetTemp] = useState(18);
  const [showTempTooltip, setShowTempTooltip] = useState(false);
  const [autoTempControl, setAutoTempControl] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState(0);
  const [wifiStrength, setWifiStrength] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(null);
  const toast = useToast(toastConfig);
  const textMuted = useColorModeValue('gray.500', 'gray.400');
  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBg = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)');
  const prefersReducedMotion = usePrefersReducedMotion();
  const updateInterval = useRef();

  // Función para guardar los horarios programados
  const saveSchedules = (newSchedules) => {
    setSchedules(newSchedules);
    localStorage.setItem('heaterSchedules', JSON.stringify(newSchedules));
  };

  // Función para obtener el estado actual del calefactor
  const fetchStatus = useCallback(async () => {
    try {
      const status = await heaterApi.getStatus();
      
      // Actualizar el estado con los datos del servidor
      setMode(status.mode || 'off');
      setCurrentTemp(status.temperature || 0);
      setBatteryLevel(status.battery || 0);
      setWifiStrength(status.wifiStrength || 0);
      setIsConnected(true);
      setLastUpdate(new Date());
      setError(null);
      
      return status;
    } catch (err) {
      console.error('Error al obtener el estado:', err);
      setIsConnected(false);
      
      // Mensaje de error más descriptivo
      const errorMessage = err.message.includes('tiempo de espera') 
        ? 'El calefactor no responde. Verifica la conexión.'
        : 'Error de conexión con el calefactor';
      
      setError(errorMessage);
      
      // Mostrar notificación de error solo si antes estaba conectado o es la primera carga
      if (isConnected || isLoading) {
        toast({
          title: 'Error de conexión',
          description: errorMessage,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
      }
      
      // Establecer valores por defecto cuando hay error
      setMode('off');
      setCurrentTemp(0);
      // No modificar targetTemp aquí para mantener el valor establecido por el usuario
      setBatteryLevel(0);
      setWifiStrength(0);
      setLastUpdate(null);
      setError('Error de conexión con el calefactor');
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, isLoading, toast]);

  // Configurar actualización periódica del estado
  useEffect(() => {
    // Cargar estado inicial
    fetchStatus();
    
    // Configurar actualización cada 5 segundos
    updateInterval.current = setInterval(fetchStatus, 5000);
    
    // Limpiar intervalo al desmontar el componente
    return () => {
      if (updateInterval.current) {
        clearInterval(updateInterval.current);
      }
    };
  }, [fetchStatus]); // Eliminamos 'mode' de las dependencias para evitar reiniciar targetTemp

  // Referencia para el temporizador de control
  const controlTimerRef = useRef(null);
  const lastModeChangeRef = useRef(Date.now());
  
  // Control automático de temperatura
  useEffect(() => {
    // Limpiar temporizador existente
    if (controlTimerRef.current) {
      clearTimeout(controlTimerRef.current);
    }
    
    // Si el control automático está desactivado, no hacer nada
    if (!autoTempControl) {
      console.log('Control automático desactivado');
      return;
    }
    
    const tempDifference = targetTemp - currentTemp;
    const absDifference = Math.abs(tempDifference);
    
    // Solo considerar cambiar el modo si ha pasado suficiente tiempo desde el último cambio
    const timeSinceLastChange = Date.now() - lastModeChangeRef.current;
    const minTimeBetweenChanges = 10000; // 10 segundos entre cambios
    
    if (timeSinceLastChange < minTimeBetweenChanges) {
      console.log(`Esperando ${((minTimeBetweenChanges - timeSinceLastChange) / 1000).toFixed(1)} segundos antes del próximo cambio`);
      return;
    }
    
    // Calcular el nuevo modo deseado
    let newMode = mode;
    const now = new Date();
    
    // Si la temperatura está dentro del rango aceptable, mantener el modo actual
    if (absDifference <= 0.5) {
      console.log(`[${now.toLocaleTimeString()}] Temperatura estable (${currentTemp.toFixed(1)}°C)`);
      return;
    }
    
    // Lógica de control mejorada
    console.log(`[DEBUG] Control: ${currentTemp.toFixed(1)}°C → ${targetTemp}°C (Modo actual: ${mode})`);
    
    if (tempDifference > 0.5) {
      // Necesita calentar (temperatura actual < objetivo - 0.5)
      if (absDifference > 5) {
        // Si está muy lejos del objetivo, usar máximo
        newMode = 'max';
        console.log('[CONTROL] Usando MÁXIMO para calentamiento rápido');
      } else if (absDifference > 2) {
        // Si está a media distancia, usar máximo
        newMode = 'max';
        console.log('[CONTROL] Usando MÁXIMO para calentamiento');
      } else if (absDifference > 0.8) {
        // Si está cerca, usar mínimo
        newMode = 'min';
        console.log('[CONTROL] Usando MÍNIMO para ajuste fino');
      } else {
        // Si está muy cerca, usar piloto
        newMode = 'pilot';
        console.log('[CONTROL] Usando PILOTO para mantener temperatura');
      }
    } else if (tempDifference < -0.5) {
      // Necesita enfriar (temperatura actual > objetivo + 0.5)
      if (currentTemp > targetTemp + 2) {
        // Si está más de 2°C por encima, apagar
        newMode = 'off';
        console.log('[CONTROL] APAGANDO para enfriar');
        
        // Si la temperatura está muy alta, mostrar advertencia
        if (currentTemp > targetTemp + 5) {
          console.log(`[ADVERTENCIA] Temperatura muy alta (${currentTemp}°C)`);
          toast({
            title: 'Temperatura alta detectada',
            description: `La temperatura es de ${currentTemp}°C.`,
            status: 'warning',
            duration: 5000,
            isClosable: true,
          });
        }
      } else {
        // Si está solo un poco por encima, usar piloto
        newMode = 'pilot';
        console.log('[CONTROL] Usando PILOTO para enfriamiento suave');
      }
    } else {
      // Temperatura dentro del rango objetivo ±0.5°C
      newMode = 'pilot';
      console.log('[CONTROL] Temperatura estable, usando PILOTO');
    }
    
    // Si el modo no cambia, no hacer nada
    if (newMode === mode) {
      console.log(`[${now.toLocaleTimeString()}] Modo actual (${mode}) ya es el adecuado para ${currentTemp.toFixed(1)}°C → ${targetTemp}°C`);
      return;
    }
    
    // Programar el cambio de modo con un pequeño retraso
    controlTimerRef.current = setTimeout(() => {
      const now = new Date();
      console.log(`[${now.toLocaleTimeString()}] Cambiando modo de ${mode} a ${newMode} (${currentTemp.toFixed(1)}°C → ${targetTemp}°C)`);
      
      // Actualizar referencia de tiempo del último cambio
      lastModeChangeRef.current = now.getTime();
      
      // Actualizar el estado local
      setMode(newMode);
      
      // En modo simulación, llamar a heaterApi.setMode para obtener logs
      if (SIMULATION_MODE) {
        heaterApi.setMode(newMode).catch(console.error);
        // También actualizar el estado simulado
        if (window.simulatedState) {
          window.simulatedState.mode = newMode;
        }
      } else {
        // En entorno real, llamar a la API
        heaterApi.setMode(newMode).catch(console.error);
      }
      
      // Mostrar notificación del cambio de modo
      toast({
        title: `Modo cambiado a ${newMode}`,
        description: `Temperatura: ${currentTemp.toFixed(1)}°C (Objetivo: ${targetTemp}°C)`,
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      
    }, 1500); // Pequeño retraso para agrupar cambios rápidos
    
    return () => {
      if (controlTimerRef.current) {
        clearTimeout(controlTimerRef.current);
      }
    };
  }, [currentTemp, targetTemp, mode, autoTempControl]);
  
  // Simular cambio de batería y señal
  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryLevel(prev => Math.max(5, Math.min(100, prev + (Math.random() > 0.5 ? -1 : 1))));
      setWifiStrength(Math.floor(Math.random() * 4) + 1);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleModeChange = useCallback(async (newMode) => {
    if (newMode === mode || isLoading) return;
    
    setIsLoading(true);
    console.log('[APP] Iniciando cambio de modo:', { 
      currentMode: mode, 
      newMode, 
      isLoading 
    });
    
    try {
      // Si el modo es 'off', desactivar el control automático
      if (newMode === 'off') {
        setAutoTempControl(false);
        console.log('[APP] Desactivando control automático al cambiar a modo OFF');
      }
      
      // Actualizar el modo
      console.log('[APP] Llamando a heaterApi.setMode:', newMode);
      await heaterApi.setMode(newMode);
      
      console.log('[APP] Actualizando estado local con nuevo modo:', newMode);
      setMode(newMode);
      
      // Solo mostrar notificación del cambio de modo, sin cambiar la temperatura objetivo
      toast({
        title: `Modo ${newMode} activado`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      
      // Actualizar el estado
      console.log('[APP] Actualizando estado completo...');
      await fetchStatus();
    } catch (err) {
      console.error('Error al cambiar el modo:', err);
      toast({
        title: 'Error',
        description: 'No se pudo cambiar el modo del calefactor',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      await fetchStatus();
    } finally {
      setIsLoading(false);
    }
  }, [mode, isLoading, toast, fetchStatus]);

  const handleRefresh = useCallback(() => {
    fetchStatus();
  }, [fetchStatus]);

  return (
    <ChakraProvider>
      <Box 
        minH="100vh" 
        bgGradient="linear(to-br, #0f172a, #1e293b)"
        display="flex"
        flexDirection="column"
        p={4}
        color="white"
        position="relative"
        overflow="hidden"
      >
        {/* Fondo decorativo */}
        <Box
          position="absolute"
          top="-50%"
          right="-50%"
          width="100%"
          height="100%"
          bgGradient="radial(circle, rgba(66, 153, 225, 0.1) 0%, rgba(0,0,0,0) 60%)"
          zIndex={0}
        />
        
        {/* Barra de estado */}
        <Flex justify="space-between" w="100%" mb={6}>
          <HStack spacing={2}>
            <Icon as={FaWifi} color={isConnected ? 'green.400' : 'gray.500'} />
            <Text fontSize="xs" color={isConnected ? textMuted : 'red.400'}>
              {isConnected ? 'Conectado' : 'Sin conexión'}
            </Text>
            {isLoading && <Spinner size="xs" />}
            {!isLoading && (
              <Icon 
                as={FaSync} 
                color="blue.400" 
                cursor="pointer" 
                onClick={handleRefresh}
                _hover={{ transform: 'rotate(180deg)', transition: 'transform 0.3s' }}
              />
            )}
          </HStack>
          <HStack spacing={2}>
            <Icon 
              as={FaBatteryThreeQuarters} 
              color={
                batteryLevel > 70 ? 'green.400' : 
                batteryLevel > 30 ? 'yellow.400' : 'red.400'
              } 
            />
            <Text 
              fontSize="xs" 
              color={
                batteryLevel > 70 ? textMuted : 
                batteryLevel > 30 ? 'yellow.400' : 'red.400'
              }
            >
              {Math.round(batteryLevel)}%
            </Text>
          </HStack>
        </Flex>
        
        {/* Mostrar error de conexión */}
        {error && (
          <Flex 
            bg="red.50" 
            color="red.700" 
            p={3} 
            borderRadius="md" 
            mb={4}
            alignItems="center"
          >
            <Icon as={FaExclamationTriangle} mr={2} />
            <Text fontSize="sm">{error}</Text>
          </Flex>
        )}
        
        {/* Contenido principal */}
        <Flex 
          direction="column" 
          flex="1" 
          maxW="md" 
          w="100%" 
          mx="auto"
          bg="rgba(26, 32, 44, 0.8)"
          borderRadius="2xl"
          p={6}
          boxShadow="dark-lg"
          border="1px solid"
          borderColor="rgba(255, 255, 255, 0.1)"
          backdropFilter="blur(8px)"
          zIndex={1}
          mb={8}
        >
          {/* Tarjeta de temperatura */}
          <MotionBox
            bg="rgba(45, 55, 72, 0.5)"
            backdropFilter="blur(10px)"
            borderRadius="2xl"
            p={6}
            mb={6}
            border="1px solid"
            borderColor="rgba(255, 255, 255, 0.1)"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <VStack spacing={1} textAlign="center">
              <Text fontSize="sm" color={textMuted}>CONTROL DE CALEFACCIÓN A GAS</Text>
              <Badge 
                colorScheme={mode === 'off' ? 'gray' : mode === 'pilot' ? 'blue' : mode === 'min' ? 'green' : 'red'}
                fontSize="0.8em"
                px={2}
                py={1}
                borderRadius="md"
              >
                {MODES.find(m => m.id === mode)?.label}
              </Badge>
            </VStack>
            
            <Flex direction="column" align="center" mb={6}>
              <Box position="relative" w="180px" h="180px" mb={4}>
                <CircularProgress
                  value={(currentTemp / 30) * 100}
                  size="180px"
                  thickness="8px"
                  color={mode === 'off' ? 'gray' : mode === 'pilot' ? 'blue.400' : mode === 'min' ? 'green.400' : 'red.400'}
                  capIsRound
                  sx={{
                    '& .chakra-progress__track': {
                      stroke: 'rgba(255, 255, 255, 0.1)'
                    },
                    '& .chakra-progress__indicator': {
                      transition: 'stroke-dasharray 0.6s ease 0s, stroke 0.6s ease'
                    }
                  }}
                >
                <CircularProgressLabel>
                  <VStack spacing={0}>
                    <Text fontSize="4xl" fontWeight="bold">
                      {Math.round(currentTemp)}°C
                    </Text>
                    <Text fontSize="sm" color={textMuted}>
                      Objetivo: {targetTemp}°C
                    </Text>
                  </VStack>
                </CircularProgressLabel>
                </CircularProgress>
              </Box>
              
              <Box width="100%" maxW="300px" px={4}>
                <Flex justify="space-between" align="center" mb={2}>
                  <Text fontSize="sm" color={textMuted}>
                    Control automático
                  </Text>
                  <Box 
                    as="button"
                    onClick={() => setAutoTempControl(!autoTempControl)}
                    bg={autoTempControl ? 'blue.500' : 'gray.600'}
                    w="42px"
                    h="24px"
                    borderRadius="full"
                    position="relative"
                    transition="all 0.3s"
                    _hover={{ opacity: 0.8 }}
                  >
                    <Box
                      position="absolute"
                      top="2px"
                      left={autoTempControl ? '20px' : '2px'}
                      w="20px"
                      h="20px"
                      bg="white"
                      borderRadius="full"
                      transition="all 0.3s"
                      boxShadow="sm"
                    />
                  </Box>
                </Flex>
                <Text mb={2} textAlign="center" fontSize="sm" color={textMuted}>
                  Temperatura objetivo: {targetTemp}°C
                </Text>
                <Slider
                  aria-label="Temperatura objetivo"
                  defaultValue={targetTemp}
                  min={15}
                  max={30}
                  step={0.5}
                  onChange={(val) => setTargetTemp(val)}
                  onMouseEnter={() => setShowTempTooltip(true)}
                  onMouseLeave={() => setShowTempTooltip(false)}
                >
                  <SliderTrack bg="rgba(255, 255, 255, 0.1)">
                    <SliderFilledTrack bg="blue.400" />
                  </SliderTrack>
                  <Tooltip
                    hasArrow
                    bg="blue.500"
                    color="white"
                    placement="top"
                    isOpen={showTempTooltip}
                    label={`${targetTemp}°C`}
                  >
                    <SliderThumb boxSize={5} />
                  </Tooltip>
                </Slider>
                <Flex justify="space-between" mt={1} px={1}>
                  <Text fontSize="xs" color={textMuted}>15°C</Text>
                  <Text fontSize="xs" color={textMuted}>30°C</Text>
                </Flex>
              </Box>
            </Flex>
            
            <Flex justify="space-between" mt={6}>
              <VStack align="flex-start" spacing={0}>
                <Text fontSize="xs" color={textMuted}>CONSUMO DE GAS</Text>
                <Text fontWeight="medium" fontFamily="mono">
                  {mode === 'off' ? '0 m³/h' : MODES.find(m => m.id === mode)?.consumption}
                </Text>
              </VStack>
              <VStack align="flex-end" spacing={0}>
                <Text fontSize="xs" color={textMuted}>LLAMA</Text>
                <Text fontWeight="medium">
                  {MODES.find(m => m.id === mode)?.flame}
                </Text>
              </VStack>
            </Flex>
          </MotionBox>
          
          {/* Controles */}
          <VStack spacing={4} w="100%" mb={6}>
            <Text fontSize="sm" color={textMuted} alignSelf="flex-start">NIVEL DE CALEFACCIÓN</Text>
            
            <AnimatePresence>
              {MODES.map(({ id, label, icon: IconComponent, gradient, description }, index) => (
                <MotionButton
                  key={id}
                  as={motion.button}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  leftIcon={<Icon as={IconComponent} />}
                  rightIcon={<Icon as={FaChevronRight} opacity={0.7} />}
                  bg={mode === id ? gradient : `rgba(255, 255, 255, ${id === 'off' ? '0.02' : id === 'pilot' ? '0.05' : id === 'min' ? '0.08' : '0.1'})`}
                  color={mode === id ? 'white' : ({
                    'off': 'gray.300',
                    'pilot': 'blue.200',
                    'min': 'green.200',
                    'max': 'red.200'
                  }[id] || 'white')}
                  variant={mode === id ? 'solid' : 'ghost'}
                  size="lg"
                  width="100%"
                  height="16"
                  fontSize="lg"
                  onClick={() => handleModeChange(id)}
                  isLoading={isLoading && mode === id}
                  loadingText={`Activando ${label}...`}
                  borderRadius="xl"
                  border="1px solid"
                  borderColor={mode === id ? 'transparent' : ({
                    'off': 'rgba(113, 128, 150, 0.3)',
                    'pilot': 'rgba(66, 153, 225, 0.3)',
                    'min': 'rgba(72, 187, 120, 0.3)',
                    'max': 'rgba(245, 101, 101, 0.3)'
                  }[id] || 'rgba(255, 255, 255, 0.1)')}
                  _hover={{
                    transform: 'translateY(-2px)',
                    bg: mode === id ? undefined : ({
                      'off': 'rgba(113, 128, 150, 0.1)',
                      'pilot': 'rgba(66, 153, 225, 0.15)',
                      'min': 'rgba(72, 187, 120, 0.15)',
                      'max': 'rgba(245, 101, 101, 0.15)'
                    }[id] || 'rgba(255, 255, 255, 0.05)'),
                    boxShadow: 'lg',
                  }}
                  _active={{
                    transform: 'translateY(0)',
                  }}
                  transition="all 0.3s"
                  overflow="hidden"
                  position="relative"
                  zIndex={1}
                >
                  <Flex justify="space-between" align="center" w="100%" pr={2}>
                    <Text>{label}</Text>
                    <Text fontSize="sm" opacity={0.8}>
                      {description}
                    </Text>
                  </Flex>
                </MotionButton>
              ))}
            </AnimatePresence>
          </VStack>
          
          {/* Estado del sistema */}
          <Flex 
            bg={cardBg}
            backdropFilter="blur(10px)"
            borderRadius="xl"
            p={4}
            justify="space-between"
            border="1px solid"
            borderColor="rgba(255, 255, 255, 0.1)"
          >
            <HStack spacing={3}>
              <Box 
                w="10px" 
                h="10px" 
                borderRadius="full" 
                bg={isConnected ? 'green.400' : 'red.400'}
                animation={isConnected ? `${pulse} 2s infinite` : 'none'}
              />
              <VStack align="flex-start" spacing={0}>
                <Text fontSize="sm" color={textMuted}>ESTADO</Text>
                <Text fontWeight="medium">
                  {isConnected ? 'Conectado' : 'Desconectado'}
                </Text>
              </VStack>
            </HStack>
            <VStack align="flex-end" spacing={0}>
              <Text fontSize="xs" color={textMuted}>BATERÍA</Text>
              <Text fontWeight="medium">{Math.round(batteryLevel)}%</Text>
            </VStack>
          </Flex>
        </Flex>
        
        {/* Footer */}
        <Text 
          fontSize="xs" 
          textAlign="center" 
          color={textMuted}
          zIndex={1}
        >
          Control de Calefacción a Gas v1.0.0
        </Text>
        
        {/* Botón de programación */}
        <Button 
          leftIcon={<FaClock />}
          onClick={() => setIsScheduleOpen(true)}
          colorScheme="blue"
          variant="solid"
          position="fixed"
          bottom="20px"
          right="20px"
          zIndex={10}
          boxShadow="lg"
        >
          Programar
        </Button>
        
        {/* Modal de programación */}
        <ScheduleManager
          isOpen={isScheduleOpen}
          onClose={() => setIsScheduleOpen(false)}
          onSave={saveSchedules}
          schedules={schedules}
        />
      </Box>
    </ChakraProvider>
  );
}

export default App;