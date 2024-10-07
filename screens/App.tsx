import React, { useState } from 'react';
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Box } from '@/components/ui/box';
import Dashboard from './Dashboard';
import '../styles.css';

export default function App() {
  const [colorMode, setColorMode] = useState<"light" | "dark">("dark");

  return (
    <GluestackUIProvider mode={colorMode}>
      <Box className="flex-1 bg-white dark:bg-black pt-8">
        <Dashboard />
      </Box>
    </GluestackUIProvider>
  );
}
