// Importa las utilidades de @testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock para window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock para useBreakpointValue de Chakra UI
jest.mock('@chakra-ui/react', () => {
  const originalModule = jest.requireActual('@chakra-ui/react');
  return {
    ...originalModule,
    useBreakpointValue: jest.fn().mockReturnValue('base'),
    useToast: jest.fn(() => jest.fn()),
    // Añadir más mocks según sea necesario
    useDisclosure: jest.fn(() => ({
      isOpen: false,
      onOpen: jest.fn(),
      onClose: jest.fn(),
      onToggle: jest.fn(),
    })),
  };
});

// Mock para react-icons
jest.mock('react-icons/fa', () => ({
  FaPlus: 'FaPlus',
  FaTrash: 'FaTrash',
  FaSave: 'FaSave',
  FaTimes: 'FaTimes',
}));

// Mock para el hook useScheduleManager
jest.mock('../hooks/useScheduleManager', () => ({
  __esModule: true,
  default: jest.fn(),
}));
