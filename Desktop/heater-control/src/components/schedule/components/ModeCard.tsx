import React from 'react';
import { Box, Text, useColorModeValue } from '@chakra-ui/react';
import { Mode } from '../types';

interface ModeCardProps {
  mode: Mode;
  isSelected: boolean;
  onClick: () => void;
}

export const ModeCard: React.FC<ModeCardProps> = ({ 
  mode, 
  isSelected, 
  onClick 
}) => {
  const { label, color, icon: Icon } = mode;
  
  const selectedBg = useColorModeValue(`${color}.50`, `${color}.900`);
  const selectedBorder = useColorModeValue(`${color}.400`, `${color}.400`);
  const selectedText = useColorModeValue(`${color}.700`, `${color}.200`);
  const hoverBg = useColorModeValue(`${color}.100`, `${color}.800`);
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const iconColor = useColorModeValue(
    isSelected ? `${color}.500` : 'gray.400',
    isSelected ? `${color}.300` : 'gray.500'
  );

  return (
    <Box
      as="button"
      p={4}
      borderRadius="lg"
      borderWidth="2px"
      borderColor={isSelected ? selectedBorder : borderColor}
      bg={isSelected ? selectedBg : 'transparent'}
      _dark={{
        bg: isSelected ? `${color}.900` : 'gray.800',
        borderColor: isSelected ? selectedBorder : 'gray.600'
      }}
      _hover={{
        borderColor: selectedBorder,
        bg: isSelected ? hoverBg : 'gray.50',
        _dark: {
          bg: isSelected ? hoverBg : 'gray.700'
        },
        transform: 'translateY(-2px)',
        boxShadow: 'md'
      }}
      _active={{
        transform: 'translateY(0)'
      }}
      transition="all 0.2s"
      onClick={onClick}
      textAlign="center"
      height="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        p={3}
        borderRadius="lg"
        bg={isSelected ? `${color}.100` : 'gray.100'}
        _dark={{
          bg: isSelected ? `${color}.800` : 'gray.700'
        }}
        mb={3}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Icon size={24} color={iconColor} />
      </Box>
      <Text 
        fontSize="sm" 
        fontWeight="medium"
        color={isSelected ? selectedText : textColor}
      >
        {label}
      </Text>
    </Box>
  );
};
