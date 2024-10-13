import React, { useState } from 'react';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from './Dashboard';
import Routine from './Routine';
import Profile from './Profile';
import Exercises from './Exercises';
import AddExercise from '../components/exercise/addExercise';
import AddRoutine from './addRoutine';
import { RootStackParamList } from '@/types/navigation';
import Template from '@/components/shared/Template';
import '../styles.css';

const Tab = createBottomTabNavigator<RootStackParamList>();

export default function App() {
  const [colorMode] = useState<'light' | 'dark'>('dark');

  return (
    <GluestackUIProvider mode={colorMode}>
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
          <Tab.Screen name="Profile">
            {() => (
              <Template>
                <Profile />
              </Template>
            )}
          </Tab.Screen>
          <Tab.Screen name="Exercises">
            {() => (
              <Template>
                <Exercises />
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
        </Tab.Navigator>
      </NavigationContainer>
    </GluestackUIProvider>
  );
}
