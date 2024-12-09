import React from 'react';
import { Box } from '../ui/box';
import BottomBar from './BottomBar';

interface TemplateProps {
  children: React.ReactNode;
  backgroundColor: string;
  iconColor: string;
}

const Template: React.FC<TemplateProps> = ({
  children,
  backgroundColor,
  iconColor,
}) => {
  return (
    <Box className="flex-1">
      <Box className="flex-1">{children}</Box>
      <BottomBar backgroundColor={backgroundColor} iconColor={iconColor} />
    </Box>
  );
};

export default Template;
