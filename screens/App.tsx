import React, { useEffect } from 'react';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { NavigationContainer } from '@react-navigation/native';
import '../global.css';
import { SafeAreaView, StatusBar } from 'react-native';
import { AuthProvider } from '@/context/UserContext';
import { getTheme, saveTheme, ThemeContext } from '@/context/ThemeContext';
import MainTabs from '@/components/tabs/mainTabs';

export default function App() {
  const [colorMode, setColorMode] = React.useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await getTheme();
      setColorMode(savedTheme);
    };

    loadTheme();
  }, []);

  const statusBarbackgroundColor =
    colorMode === 'light' ? '#ffffff' : '#000000';

  const toggleColorMode = async () => {
    const newTheme = colorMode === 'light' ? 'dark' : 'light';
    setColorMode(newTheme);
    await saveTheme(newTheme);
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
