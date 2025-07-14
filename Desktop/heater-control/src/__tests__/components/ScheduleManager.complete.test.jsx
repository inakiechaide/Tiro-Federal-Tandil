import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChakraProvider } from '@chakra-ui/react';
import ScheduleManager from '../../components/ScheduleManager';

// Mock de los componentes hijos
jest.mock('../../components/ScheduleForm', () => ({
  __esModule: true,
  default: ({ onAddSchedule }) => (
    <div data-testid="schedule-form">
      <button onClick={() => onAddSchedule({
        days: { monday: true },
        startTime: '08:00',
        endTime: '10:00',
        mode: 'auto',
        temperature: 21
      })}>
        Añadir horario
      </button>
    </div>
  ),
}));

jest.mock('../../components/ScheduleList', () => ({
  __esModule: true,
  default: ({ schedules, onRemoveSchedule }) => (
    <div data-testid="schedule-list">
      {schedules.map((schedule, index) => (
        <div key={index} data-testid={`schedule-item-${index}`}>
          <button onClick={() => onRemoveSchedule(schedule.id)}>Eliminar</button>
        </div>
      ))}
    </div>
  ),
}));

// Mock del hook useScheduleManager
const mockUseScheduleManager = jest.fn();
jest.mock('../../hooks/useScheduleManager', () => ({
  __esModule: true,
  default: (schedules, onSave, onClose) => mockUseScheduleManager(schedules, onSave, onClose)
}));

const renderWithProviders = (ui, { ...renderOptions } = {}) => {
  const Wrapper = ({ children }) => (
    <ChakraProvider>
      {children}
    </ChakraProvider>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

describe('ScheduleManager', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();
  
  const mockSchedules = [
    {
      id: '1',
      days: { monday: true },
      startTime: '08:00',
      endTime: '10:00',
      mode: 'auto',
      temperature: 21
    }
  ];

  beforeEach(() => {
    // Configuración por defecto del mock
    mockUseScheduleManager.mockReturnValue({
      localSchedules: [...mockSchedules],
      selectedMode: 'off',
      isAutoMode: false,
      isSubmitting: false,
      targetTemp: 21,
      startTime: '08:00',
      endTime: '10:00',
      selectedDays: { monday: false },
      setSelectedMode: jest.fn(),
      setIsAutoMode: jest.fn(),
      setTargetTemp: jest.fn(),
      setStartTime: jest.fn(),
      setEndTime: jest.fn(),
      setSelectedDays: jest.fn(),
      handleAddSchedule: jest.fn((schedule) => {
        const newSchedules = [...mockSchedules, { ...schedule, id: Date.now().toString() }];
        mockUseScheduleManager.mockReturnValue({
          ...mockUseScheduleManager(),
          localSchedules: newSchedules
        });
      }),
      handleRemoveSchedule: jest.fn((id) => {
        const newSchedules = mockSchedules.filter(s => s.id !== id);
        mockUseScheduleManager.mockReturnValue({
          ...mockUseScheduleManager(),
          localSchedules: newSchedules
        });
      }),
      handleSaveSchedules: jest.fn().mockResolvedValue(true)
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería renderizar el componente correctamente', () => {
    renderWithProviders(
      <ScheduleManager 
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        schedules={mockSchedules}
      />
    );

    expect(screen.getByText('Gestión de Programación')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /guardar cambios/i })).toBeInTheDocument();
  });

  it('debería llamar a onClose al hacer clic en cancelar', () => {
    renderWithProviders(
      <ScheduleManager 
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        schedules={mockSchedules}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('debería manejar el guardado de horarios', async () => {
    renderWithProviders(
      <ScheduleManager 
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        schedules={mockSchedules}
      />
    );

    const saveButton = screen.getByRole('button', { name: /guardar cambios/i });
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(mockSchedules);
    });
  });

  it('debería manejar la adición de un nuevo horario', () => {
    renderWithProviders(
      <ScheduleManager 
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        schedules={mockSchedules}
      />
    );

    const addButton = screen.getByText('Añadir horario');
    fireEvent.click(addButton);
    
    // Verificar que se llamó a handleAddSchedule con los datos correctos
    expect(mockUseScheduleManager().handleAddSchedule).toHaveBeenCalledWith({
      days: { monday: true },
      startTime: '08:00',
      endTime: '10:00',
      mode: 'auto',
      temperature: 21
    });
  });
});
