import React from 'react';
import { 
  VStack, Text, SimpleGrid, Card, CardBody, 
  Box, useColorModeValue, IconButton, Tooltip, 
  Badge, Flex, Icon, useColorMode
} from '@chakra-ui/react';
import { 
  FaTrash, FaPowerOff, FaThermometerEmpty, 
  FaThermometerHalf, FaThermometerFull 
} from 'react-icons/fa';
import { WEEK_DAYS } from '../../constants';

// Mapeo de modos a estilos
const modeStyles = {
  off: { 
    label: 'Apagado', 
    icon: FaPowerOff, 
    color: 'gray',
    bg: 'gray.50',
    activeBg: 'gray.100',
    hoverBg: 'gray.50',
    borderColor: 'gray.200'
  },
  min: { 
    label: 'Mínimo', 
    icon: FaThermometerEmpty, 
    color: 'blue',
    bg: 'blue.50',
    activeBg: 'blue.100',
    hoverBg: 'blue.50',
    borderColor: 'blue.200'
  },
  max: { 
    label: 'Máximo', 
    icon: FaThermometerFull, 
    color: 'red',
    bg: 'red.50',
    activeBg: 'red.100',
    hoverBg: 'red.50',
    borderColor: 'red.200'
  },
  auto: { 
    label: 'Automático', 
    icon: FaThermometerHalf, 
    color: 'purple',
    bg: 'purple.50',
    activeBg: 'purple.100',
    hoverBg: 'purple.50',
    borderColor: 'purple.200'
  }
};

const ScheduleList = ({ schedules = [], onRemove, borderColor }) => {
  const { colorMode } = useColorMode();
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const mutedTextColor = useColorModeValue('gray.500', 'gray.400');
  
  if (!schedules || schedules.length === 0) {
    return (
      <Text color={mutedTextColor} textAlign="center" py={4}>
        No hay programaciones configuradas
      </Text>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      <Text fontSize="lg" fontWeight="bold" color={textColor}>
        Programaciones Activas
      </Text>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {schedules.map((schedule) => {
          const modeStyle = modeStyles[schedule.mode] || modeStyles.off;
          const ModeIcon = modeStyle.icon;
          const isAutoMode = schedule.mode === 'auto';
          
          return (
            <Card 
              key={schedule.id} 
              bg={isAutoMode ? 'purple.50' : modeStyle.bg}
              borderWidth="1px"
              borderColor={isAutoMode ? 'purple.200' : borderColor}
              boxShadow={isAutoMode ? '0 0 0 1px var(--chakra-colors-purple-200)' : 'none'}
              _dark={{
                bg: isAutoMode ? 'purple.900' : 'gray.700',
                borderColor: isAutoMode ? 'purple.700' : 'gray.600',
              }}
            >
              <CardBody>
                <VStack align="stretch" spacing={3}>
                  <Flex justify="space-between" align="center">
                    <Box>
                      <Flex align="center" mb={1}>
                        <Icon as={ModeIcon} color={modeStyle.color} mr={2} />
                        <Text fontWeight="medium" color={isAutoMode ? 'purple.600' : modeStyle.color}>
                          {schedule.startTime} - {schedule.endTime}
                        </Text>
                      </Flex>
                      <Text 
                        fontSize="sm" 
                        color={isAutoMode ? 'purple.600' : modeStyle.color}
                        fontWeight="medium"
                      >
                        {isAutoMode 
                          ? `Automático (${schedule.temperature}°C)`
                          : modeStyle.label}
                      </Text>
                      <Box mt={2}>
                        <Flex flexWrap="wrap" gap={1}>
                          {WEEK_DAYS
                            .filter(day => schedule.days[day.id])
                            .map(day => (
                              <Tooltip key={day.id} label={day.fullLabel} placement="top" hasArrow>
                                <Badge 
                                  colorScheme={
                                    schedule.mode === 'off' ? 'gray' : 
                                    schedule.mode === 'min' ? 'blue' : 
                                    schedule.mode === 'max' ? 'red' : 'purple'
                                  }
                                  variant="subtle"
                                  fontSize="xs"
                                  mr={1}
                                  mb={1}
                                  px={2}
                                  _dark={{
                                    bg: schedule.mode === 'auto' ? 'purple.800' : undefined,
                                  }}
                                >
                                  {day.fullLabelShort}
                                </Badge>
                              </Tooltip>
                            ))}
                        </Flex>
                      </Box>
                    </Box>
                    <IconButton
                      icon={<FaTrash />}
                      aria-label="Eliminar programación"
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => onRemove(schedule.id)}
                      ml="auto"
                    />
                  </Flex>
                </VStack>
              </CardBody>
            </Card>
          );
        })}
      </SimpleGrid>
    </VStack>
  );
};

export default ScheduleList;
