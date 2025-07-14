import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChakraProvider } from '@chakra-ui/react';
import ScheduleManager from '../../components/ScheduleManager';

// Simple mock for the component to test basic rendering
const MockScheduleManager = (props) => {
  return (
    <ChakraProvider>
      <ScheduleManager {...props} />
    </ChakraProvider>
  );
};

describe('ScheduleManager - Basic Rendering', () => {
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

  it('renders the modal with title', () => {
    render(
      <MockScheduleManager 
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        schedules={mockSchedules}
      />
    );
    
    expect(screen.getByText('Gestión de Programación')).toBeInTheDocument();
  });

  it('has cancel and save buttons', () => {
    render(
      <MockScheduleManager 
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        schedules={mockSchedules}
      />
    );
    
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /guardar cambios/i })).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    render(
      <MockScheduleManager 
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
});
