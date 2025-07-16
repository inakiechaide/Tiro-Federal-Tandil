import React from 'react';
import { VStack, HStack, Text, Box, Badge, IconButton, useColorModeValue } from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';
import { Schedule } from '../types';
import { MODES, WEEK_DAYS } from '../constants';

interface ScheduleListProps {
  schedules: Schedule[];
  onRemove: (id: number) => void;
}

export const ScheduleList: React.FC<ScheduleListProps> = ({ schedules, onRemove }) => {
  const textColor = useColorModeValue('gray.700', 'gray.100');
  const mutedTextColor = useColorModeValue('gray.500', 'gray.300');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const cardBg = useColorModeValue('white', 'gray.800');

  if (schedules.length === 0) {
    return (
      <Box 
        textAlign="center" 
        py={10}
        bg={cardBg}
        borderRadius="xl"
        borderWidth="1px"
        borderColor={borderColor}
        mt={8}
      >
        <Text fontSize="lg" fontWeight="medium" color={textColor} mb={2}>
          No hay programaciones
        </Text>
        <Text color={mutedTextColor} maxW="md" mx="auto">
          Agrega una nueva programación haciendo clic en el botón "Agregar Programación"
        </Text>
      </Box>
    );
  }

  return (
    <VStack spacing={4} align="stretch" mt={8}>
      <HStack spacing={2} mb={4}>
        <Text fontSize="lg" fontWeight="semibold" color={textColor}>
          Programaciones existentes
        </Text>
        <Badge 
          colorScheme="blue" 
          variant="solid" 
          borderRadius="full"
          px={2.5}
          py={0.5}
          fontSize="sm"
        >
          {schedules.length}
        </Badge>
      </HStack>

      <VStack spacing={3} align="stretch">
        {schedules.map((schedule) => (
          <ScheduleItem 
            key={schedule.id} 
            schedule={schedule} 
            onRemove={onRemove} 
          />
        ))}
      </VStack>
    </VStack>
  );
};

const ScheduleItem: React.FC<{ schedule: Schedule; onRemove: (id: number) => void }> = ({ 
  schedule, 
  onRemove 
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.300');

  const mode = schedule.mode ? MODES[schedule.mode as keyof typeof MODES] : null;
  const days = Object.entries(schedule.days || {})
    .filter(([_, isSelected]) => isSelected)
    .map(([dayId]) => {
      const day = WEEK_DAYS.find(d => d.id === dayId);
      return day?.fullLabelShort || '';
    })
    .filter(Boolean);

  return (
    <Box
      p={4}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      bg={bgColor}
      position="relative"
      _hover={{
        boxShadow: 'md',
        transform: 'translateY(-2px)',
      }}
      transition="all 0.2s"
    >
      <HStack justify="space-between" align="flex-start">
        <Box>
          <HStack spacing={4} mb={2}>
            <Text fontSize="lg" fontWeight="semibold" color={textColor}>
              {schedule.startTime} - {schedule.endTime}
            </Text>
            
            {schedule.temperature !== undefined ? (
              <Badge 
                colorScheme="blue" 
                variant="subtle"
                borderRadius="full"
                px={3}
                py={0.5}
                fontSize="sm"
                display="flex"
                alignItems="center"
                gap={1}
              >
                <Box>🌡️</Box>
                <Box>Auto ({schedule.temperature}°C)</Box>
              </Badge>
            ) : mode ? (
              <Badge 
                colorScheme={mode.color} 
                variant="subtle"
                borderRadius="full"
                px={3}
                py={0.5}
                fontSize="sm"
                display="flex"
                alignItems="center"
                gap={1}
              >
                <Box>{mode.icon || '⚙️'}</Box>
                <Box>{mode.label}</Box>
              </Badge>
            ) : null}
          </HStack>
          
          {days.length > 0 ? (
            <HStack spacing={2} flexWrap="wrap">
              {days.map((day, index) => (
                <Badge 
                  key={index} 
                  colorScheme="blue" 
                  variant="outline"
                  borderRadius="md"
                  px={2}
                  py={0.5}
                  fontSize="xs"
                >
                  {day}
                </Badge>
              ))}
            </HStack>
          ) : (
            <Text fontSize="sm" color={mutedTextColor} fontStyle="italic">
              Solo hoy
            </Text>
          )}
        </Box>
        
        <IconButton
          icon={<FaTrash />}
          aria-label="Eliminar programación"
          size="sm"
          variant="ghost"
          colorScheme="red"
          onClick={() => onRemove(schedule.id)}
          _hover={{
            bg: 'red.50',
            color: 'red.600',
          }}
        />
      </HStack>
    </Box>
  );
};
