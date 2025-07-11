import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  styles: {
    global: (props) => ({
      'html, body': {
        bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: 'white',
        minHeight: '100vh',
        overflowX: 'hidden',
      },
      '::-webkit-scrollbar': {
        width: '8px',
      },
      '::-webkit-scrollbar-track': {
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '4px',
      },
      '::-webkit-scrollbar-thumb': {
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '4px',
        '&:hover': {
          background: 'rgba(255, 255, 255, 0.2)',
        },
      },
    }),
  },
  colors: {
    brand: {
      50: '#f0fdfa',
      100: '#ccfbf1',
      200: '#99f6e4',
      300: '#5eead4',
      400: '#2dd4bf',
      500: '#14b8a6',
      600: '#0d9488',
      700: '#0f766e',
      800: '#115e59',
      900: '#134e4a',
    },
    modes: {
      off: {
        primary: '#4b5563',
        secondary: '#6b7280',
      },
      pilot: {
        primary: '#3b82f6',
        secondary: '#60a5fa',
      },
      min: {
        primary: '#10b981',
        secondary: '#34d399',
      },
      max: {
        primary: '#ef4444',
        secondary: '#f87171',
      },
    },
  },
  fonts: {
    heading: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`,
    body: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`,
  },
  shadows: {
    glow: '0 0 15px 5px',
    'inner-glow': 'inset 0 0 10px 2px',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'medium',
        borderRadius: 'lg',
        _focus: {
          boxShadow: 'none',
        },
      },
    },
  },
});

export default theme;
