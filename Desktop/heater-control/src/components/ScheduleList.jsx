import React from 'react';
import {
  VStack, HStack, Text, Box, Divider, Badge, IconButton,
  Tooltip, useColorModeValue, useDisclosure, Collapse
} from '@chakra-ui/react';
import { FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const ScheduleList = ({
  schedules = [],
  weekDays,
  onRemove,
  useColorModeValue
}) => {
  const { isOpen: isListExpanded, onToggle: toggleList } = useDisclosure({ defaultIsOpen: true });
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400');
  const bgColor = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  // Estilos para los modos
  const getModeStyle = (mode) => {
    const baseStyles = {
      auto: {
        bg: useColorModeValue('purple.50', 'purple.900'),
        color: useColorModeValue('purple.600', 'purple.200'),
        borderColor: useColorModeValue('purple.200', 'purple.700'),
        icon: null,
        label: 'Automático'
      },
      off: {
        bg: useColorModeValue('gray.100', 'gray.700'),
        color: useColorModeValue('gray.600', 'gray.200'),
        borderColor: useColorModeValue('gray.300', 'gray.600'),
        icon: null,
        label: 'Apagado'
      },
      pilot: {
        bg: useColorModeValue('blue.50', 'blue.900'),
        color: useColorModeValue('blue.600', 'blue.200'),
        borderColor: useColorModeValue('blue.200', 'blue.700'),
        icon: null,
        label: 'Piloto'
      },
      min: {
        bg: useColorModeValue('green.50', 'green.900'),
        color: useColorModeValue('green.600', 'green.200'),
        borderColor: useColorModeValue('green.200', 'green.700'),
        icon: null,
        label: 'Mínimo'
      },
      max: {
        bg: useColorModeValue('red.50', 'red.900'),
        color: useColorModeValue('red.600', 'red.200'),
        borderColor: useColorModeValue('red.200', 'red.700'),
        icon: null,
        label: 'Máximo'
      }
    };
    
    return baseStyles[mode] || baseStyles.off;
  };

  // Formatear la hora
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    return `${hours}:${minutes}`;
  };

  // Obtener etiqueta de días
  const getDaysLabel = (days) => {
    const selectedDays = weekDays.filter(day => days[day.id]);
    
    if (selectedDays.length === 7) {
      return 'Todos los días';
    }
    
    if (selectedDays.length === 0) {
      return 'Ningún día';
    }
    
    return selectedDays.map(day => day.fullLabelShort).join(', ');
  };

  if (schedules.length === 0) {
    return (
      <Box 
        p={4} 
        borderRadius="md" 
        bg={useColorModeValue('gray.50', 'gray.700')}
        textAlign="center"
        mt={4}
      >
        <Text color={mutedTextColor} fontSize="sm">
          No hay programaciones guardadas. Agrega una para comenzar.
        </Text>
      </Box>
    );
  }

  return (
    <Box w="100%" mt={6}>
      <HStack 
        justify="space-between" 
        cursor="pointer" 
        onClick={toggleList}
        mb={2}
      >
        <Text fontWeight="medium">Programaciones guardadas</Text>
        <Box>
          {isListExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </Box>
      </HStack>
      
      <Collapse in={isListExpanded} animateOpacity>
        <VStack spacing={3} align="stretch">
          {schedules.map((schedule) => {
            const modeStyle = getModeStyle(schedule.mode);
            const daysLabel = getDaysLabel(schedule.days);
            
            return (
              <Box
                key={schedule.id}
                p={3}
                borderWidth="1px"
                borderRadius="md"
                borderColor={schedule.mode === 'auto' ? 'purple.200' : borderColor}
                bg={schedule.mode === 'auto' ? 'purple.50' : bgColor}
                _hover={{ bg: hoverBg }}
                transition="all 0.2s"
              >
                <Flex justify="space-between" align="center">
                  <Box>
                    <Flex align="center" mb={1}>
                      <Text fontWeight="medium" mr={2}>
                        {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                      </Text>
                      <Badge 
                        colorScheme={schedule.mode === 'auto' ? 'purple' : 'gray'}
                        variant="subtle"
                        fontSize="xs"
                      >
                        {schedule.mode === 'auto' 
                          ? `Automático (${schedule.temperature}°C)` 
                          : modeStyle.label}
                      </Badge>
                    </Flex>
                    
                    <Tooltip 
                      label={weekDays
                        .filter(day => schedule.days[day.id])
                        .map(day => day.fullLabel)
                        .join(', ')
                      }
                      isDisabled={!Object.values(schedule.days).some(Boolean)}
                    >
                      <Text 
                        fontSize="xs" 
                        color={mutedTextColor}
                        noOfLines={1}
                      >
                        {daysLabel}
                      </Text>
                    </Tooltip>
                  </Box>
                  
                  <IconButton
                    icon={<FaTrash />}
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    aria-label="Eliminar programación"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(schedule.id);
                    }}
                  />
                </Flex>
              </Box>
            );
          })}
        </VStack>
      </Collapse>
    </Box>
  );
};

export default ScheduleList;
