import React from 'react';
import { VStack, Text, Input, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Flex, Wrap, WrapItem, Checkbox } from '@chakra-ui/react';
import { FaThermometerHalf, FaThermometerEmpty, FaThermometerFull } from 'react-icons/fa';
import { WEEK_DAYS } from '../../constants';

const ScheduleForm = ({ 
  mode, 
  targetTemp, 
  startTime, 
  endTime, 
  selectedDays, 
  onModeChange, 
  onTempChange, 
  onStartTimeChange, 
  onEndTimeChange, 
  onDayChange 
}) => {
  return (
    <VStack spacing={4} align="stretch">
      {/* Modo Selector */}
      <Text fontSize="lg" fontWeight="bold">Modo</Text>
      <Text>{mode}</Text>

      {/* Temperatura */}
      <VStack spacing={2} align="stretch">
        <Text fontSize="lg" fontWeight="bold">Temperatura</Text>
        <Flex align="center">
          <FaThermometerEmpty />
          <Slider
            value={targetTemp}
            onChange={onTempChange}
            min={15}
            max={30}
            step={1}
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
        <Text textAlign="center">{targetTemp}°C</Text>
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
