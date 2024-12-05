import React from 'react';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { NavigationContainer } from '@react-navigation/native';
import '../global.css';
import { SafeAreaView, StatusBar } from 'react-native';
import { AuthProvider } from '@/context/UserContext';
import MainTabs from '@/components/tabs/mainTabs';

type ThemeContextType = {
  colorMode?: 'dark' | 'light';
  toggleColorMode?: () => void;
};

export const ThemeContext = React.createContext<ThemeContextType>({
  colorMode: 'light',
  toggleColorMode: () => {},
});

export default function App() {
  const [colorMode, setColorMode] = React.useState<'dark' | 'light'>('dark');

  const statusBarbackgroundColor =
    colorMode === 'light' ? '#ffffff' : '#000000';

  const toggleColorMode = async () => {
    setColorMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <>
      <StatusBar
        barStyle={colorMode === 'light' ? 'dark-content' : 'light-content'}
        backgroundColor={statusBarbackgroundColor}
      />
      <SafeAreaView
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          flex: 1,
          overflow: 'hidden',
        }}
      >
        <GluestackUIProvider mode={colorMode}>
          <ThemeContext.Provider value={{ colorMode, toggleColorMode }}>
            <AuthProvider>
              <NavigationContainer>
                <MainTabs />
              </NavigationContainer>
            </AuthProvider>
          </ThemeContext.Provider>
        </GluestackUIProvider>
      </SafeAreaView>
    </>
  );
}
