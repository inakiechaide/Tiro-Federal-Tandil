import React, { useCallback } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, VStack, useDisclosure, Text } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import { FaSave } from 'react-icons/fa';
import { WEEK_DAYS, MODES, MODAL_STYLES } from './constants';
import { ScheduleManagerProps, ScheduleFormProps, Schedule } from './types';
import { useScheduleManager } from './hooks/useScheduleManager';
import ScheduleForm from './components/ScheduleForm';
import { ScheduleList } from './components/ScheduleList';

export const ScheduleManager: React.FC<ScheduleManagerProps> = ({
  isOpen,
  onClose,
  onSave,
  schedules = []
}: ScheduleManagerProps) => {
  const { isOpen: isConfirmOpen, onOpen: onOpenConfirm, onClose: onCloseConfirm } = useDisclosure();
  const toast = useToast();
  
  const {
    localSchedules,
    mode,
    isSubmitting,
    targetTemp: temp,
    startTime,
    endTime,
    selectedDays,
    handleTimeChange,
    handleDayToggle,
    handleAddSchedule,
    handleRemoveSchedule,
    handleSaveSchedules,
    setMode,
    setTargetTemp: setTemp,
    setStartTime,
    setEndTime
  } = useScheduleManager({
    initialSchedules: schedules,
    onSave,
    onClose,
    toast
  });

  const handleSave = async () => {
    await handleSaveSchedules();
    onClose();
  };

  const handleClose = () => {
    if (localSchedules.length > 0) {
      onOpenConfirm();
    } else {
      onClose();
    }
  };

  const handleConfirmClose = useCallback(() => {
    onCloseConfirm();
    onClose();
  }, [onCloseConfirm, onClose]);

  // Wrapper function to handle time changes from ScheduleForm
  const handleFormTimeChange = useCallback((time: string, type: 'start' | 'end') => {
    if (type === 'start') {
      setStartTime(time);
    } else {
      setEndTime(time);
    }
  }, [setStartTime, setEndTime]);

  return (
    <>
      <Modal 
        isOpen={isOpen} 
        onClose={handleClose} 
        size="xl" 
        scrollBehavior="inside"
        closeOnOverlayClick={!isSubmitting}
      >
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <ModalContent {...MODAL_STYLES.content}>
          <ModalHeader {...MODAL_STYLES.header}>
            <VStack align="flex-start" spacing={1}>
              <Text>Programador de Calefacción</Text>
              <Text fontSize="sm" opacity={0.8} fontWeight="normal">
                Configura los horarios de encendido y apagado
              </Text>
            </VStack>
          </ModalHeader>
          
          <ModalCloseButton {...MODAL_STYLES.closeButton} isDisabled={isSubmitting} />
          
          <ModalBody p={6}>
            <VStack spacing={8} align="stretch">
              <ScheduleForm
                startTime={startTime}
                endTime={endTime}
                selectedMode={mode}
                targetTemp={temp}
                selectedDays={selectedDays}
                onTimeChange={handleFormTimeChange}
                onDayToggle={handleDayToggle}
                onModeSelect={setMode}
                onTempChange={setTemp}
                onAddSchedule={handleAddSchedule}
              />
              
              <ScheduleList 
                schedules={localSchedules}
                onRemove={handleRemoveSchedule}
              />
            </VStack>
          </ModalBody>
          
          <ModalFooter {...MODAL_STYLES.footer}>
            <Button 
              variant="outline" 
              mr={3} 
              onClick={handleClose}
              isDisabled={isSubmitting}
              borderColor="gray.200"
              _hover={{
                borderColor: 'blue.500',
                color: 'blue.500',
                bg: 'transparent'
              }}
            >
              Cancelar
            </Button>
            <Button 
              colorScheme="blue"
              onClick={handleSave}
              isLoading={isSubmitting}
              loadingText="Guardando..."
              leftIcon={<FaSave />}
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'md',
              }}
              _active={{
                transform: 'translateY(0)',
              }}
              transition="all 0.2s"
              isDisabled={localSchedules.length === 0}
            >
              Guardar cambios
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Confirmation Dialog */}
      <Modal isOpen={isConfirmOpen} onClose={onCloseConfirm} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>¿Descartar cambios?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Tienes programaciones sin guardar. ¿Estás seguro de que quieres salir sin guardar los cambios?
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onCloseConfirm}>
              Cancelar
            </Button>
            <Button colorScheme="red" onClick={handleConfirmClose}>
              Descartar cambios
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
