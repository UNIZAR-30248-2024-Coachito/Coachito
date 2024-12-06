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
import AddExerciseWhileWorkout from './AddExerciseWhileWorkout';

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
            <NavigationContainer>
              <Tab.Navigator
                screenOptions={{
                  headerShown: false,
                  tabBarStyle: { display: 'none' },
                }}
              >
                <Tab.Screen name="Dashboard">
                  {() => (
                    <Template>
                      <Dashboard />
                    </Template>
                  )}
                </Tab.Screen>
                <Tab.Screen name="Routine">
                  {() => (
                    <Template>
                      <Routine />
                    </Template>
                  )}
                </Tab.Screen>
                <Tab.Screen name="DetailsRoutine">
                  {() => (
                    <Template>
                      <DetailsRoutine />
                    </Template>
                  )}
                </Tab.Screen>
                <Tab.Screen name="Profile">
                  {() => (
                    <Template>
                      <Profile />
                    </Template>
                  )}
                </Tab.Screen>
                <Tab.Screen name="AddExercise">
                  {() => (
                    <Template>
                      <AddExercise />
                    </Template>
                  )}
                </Tab.Screen>
                <Tab.Screen name="AddRoutine">
                  {() => (
                    <Template>
                      <AddRoutine />
                    </Template>
                  )}
                </Tab.Screen>
                <Tab.Screen name="EditRoutine">
                  {() => (
                    <Template>
                      <EditRoutine />
                    </Template>
                  )}
                </Tab.Screen>
                <Tab.Screen name="AddExerciseEdit">
                  {() => (
                    <Template>
                      <AddExerciseEdit />
                    </Template>
                  )}
                </Tab.Screen>
                <Tab.Screen name="StartWorkout">
                  {() => (
                    <Template>
                      <StartWorkout />
                    </Template>
                  )}
                </Tab.Screen>
                <Tab.Screen name="DetailsWorkout">
                  {() => (
                    <Template>
                      <DetailsWorkout />
                    </Template>
                  )}
                </Tab.Screen>
                <Tab.Screen name="DetailsExercise">
                  {() => (
                    <Template>
                      <DetailsExercise />
                    </Template>
                  )}
                </Tab.Screen>
                <Tab.Screen name="AddExerciseWhileWorkout">
                  {() => (
                    <Template>
                      <AddExerciseWhileWorkout />
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
