import React from 'react';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from './Dashboard';
import Routine from './Routine';
import Profile from './Profile';
import DetailsWorkout from './DetailsWorkout';
import { RootStackParamList } from '@/types/navigation';
import Template from '@/components/shared/Template';
import DetailsRoutine from './DetailsRoutine';
import AddExercise from './AddExercise';
import AddRoutine from './AddRoutine';
import EditRoutine from './EditRoutine';
import AddExerciseEdit from './AddExerciseEdit';
import StartWorkout from './StartWorkout';
import DetailsExercise from './DetailsExercise';
import '../global.css';
import { SafeAreaView, StatusBar } from 'react-native';

const Tab = createBottomTabNavigator<RootStackParamList>();

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
    colorMode === 'light' ? '#ffffff' : '#1b1b1b';

  const statusBackgroundColor = colorMode === 'light' ? '#ffffff' : '#1b1b1b';

  const statusBoxColor = colorMode === 'light' ? '#f4f4f5' : '#27272a';

  const textColor = colorMode === 'light' ? '#000000' : '#ffffff';

  const statusTableColor = colorMode === 'light' ? '#3f3f46' : '#757575';

  const blueColor = '#3b82f6';

  const redColor = colorMode === 'light' ? '#b91c1c' : '#991b1b';

  const toggleColorMode = () => {
    setColorMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };
  //console.log(colorMode);
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
            <NavigationContainer>
              <Tab.Navigator
                screenOptions={{
                  headerShown: false,
                  tabBarStyle: { display: 'none' },
                }}
              >
                <Tab.Screen name="Dashboard">
                  {() => (
                    <Template
                      backgroundColor={statusBackgroundColor}
                      iconColor={textColor}
                    >
                      <Dashboard
                        backgroundColor={statusBackgroundColor}
                        backgroundColorEntrenamiento={statusBoxColor}
                        textColor={textColor}
                      />
                    </Template>
                  )}
                </Tab.Screen>
                <Tab.Screen name="Routine">
                  {() => (
                    <Template
                      backgroundColor={statusBackgroundColor}
                      iconColor={textColor}
                    >
                      <Routine
                        backgroundColorBoton={statusBoxColor}
                        textColor={textColor}
                        backgroundColorPopUp={statusTableColor}
                        backgroundColor={statusBackgroundColor}
                        blueColor={blueColor}
                        redColor={redColor}
                        buttonColor={statusBoxColor}
                      />
                    </Template>
                  )}
                </Tab.Screen>
                <Tab.Screen name="DetailsRoutine">
                  {() => (
                    <Template
                      backgroundColor={statusBackgroundColor}
                      iconColor={textColor}
                    >
                      <DetailsRoutine />
                    </Template>
                  )}
                </Tab.Screen>
                <Tab.Screen name="Profile">
                  {() => (
                    <Template
                      backgroundColor={statusBackgroundColor}
                      iconColor={textColor}
                    >
                      <Profile
                        backgroundColor={statusBackgroundColor}
                        textColor={textColor}
                        blueColor={blueColor}
                        buttonColor={statusBoxColor}
                      />
                    </Template>
                  )}
                </Tab.Screen>
                <Tab.Screen name="AddExercise">
                  {() => (
                    <Template
                      backgroundColor={statusBackgroundColor}
                      iconColor={textColor}
                    >
                      <AddExercise />
                    </Template>
                  )}
                </Tab.Screen>
                <Tab.Screen name="AddRoutine">
                  {() => (
                    <Template
                      backgroundColor={statusBackgroundColor}
                      iconColor={textColor}
                    >
                      <AddRoutine
                        backgroundColorBoton={statusBoxColor}
                        backgroundColor={statusBackgroundColor}
                        textColor={textColor}
                        backgroundColorPopUp={statusTableColor}
                        blueColor={blueColor}
                      />
                    </Template>
                  )}
                </Tab.Screen>
                <Tab.Screen name="EditRoutine">
                  {() => (
                    <Template
                      backgroundColor={statusBackgroundColor}
                      iconColor={textColor}
                    >
                      <EditRoutine />
                    </Template>
                  )}
                </Tab.Screen>
                <Tab.Screen name="AddExerciseEdit">
                  {() => (
                    <Template
                      backgroundColor={statusBackgroundColor}
                      iconColor={textColor}
                    >
                      <AddExerciseEdit
                        backgroundColor={statusBackgroundColor}
                        textColor={textColor}
                      />
                    </Template>
                  )}
                </Tab.Screen>
                <Tab.Screen name="StartWorkout">
                  {() => (
                    <Template
                      backgroundColor={statusBackgroundColor}
                      iconColor={textColor}
                    >
                      <StartWorkout />
                    </Template>
                  )}
                </Tab.Screen>
                <Tab.Screen name="DetailsWorkout">
                  {() => (
                    <Template
                      backgroundColor={statusBackgroundColor}
                      iconColor={textColor}
                    >
                      <DetailsWorkout />
                    </Template>
                  )}
                </Tab.Screen>
                <Tab.Screen name="DetailsExercise">
                  {() => (
                    <Template
                      backgroundColor={statusBackgroundColor}
                      iconColor={textColor}
                    >
                      <DetailsExercise />
                    </Template>
                  )}
                </Tab.Screen>
              </Tab.Navigator>
            </NavigationContainer>
          </ThemeContext.Provider>
        </GluestackUIProvider>
      </SafeAreaView>
    </>
  );
}
