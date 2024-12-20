import React from 'react';
import { Box } from '../ui/box';
import BottomBar from './BottomBar';

interface TemplateProps {
  children: React.ReactNode;
}

const Template: React.FC<TemplateProps> = ({ children }) => {
  return (
    <Box className="flex-1 bg-background-0">
      <Box className="flex-1">{children}</Box>
      <BottomBar />
    </Box>
  );
};

export default Template;
