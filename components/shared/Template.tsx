import React from 'react';
import BottomBar from './BottomBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box } from '@gluestack-ui/themed';

interface TemplateProps {
  children: React.ReactNode;
}

const Template: React.FC<TemplateProps> = ({ children }) => {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <Box className="flex-1 bg-white dark:bg-black">
        <Box className="flex-1">{children}</Box>
        <BottomBar />
      </Box>
    </SafeAreaView>
  );
};

export default Template;
