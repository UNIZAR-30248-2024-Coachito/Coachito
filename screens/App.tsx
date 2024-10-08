import React, { useState } from 'react';
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from './Dashboard';
import Routine from './Routine';
import Profile from './Profile';
import { RootStackParamList } from '@/types/navigation';
import Template from '@/components/shared/Template';

const Tab = createBottomTabNavigator<RootStackParamList>();

export default function App() {
  const [colorMode, setColorMode] = useState<"light" | "dark">("dark");

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
        </Tab.Navigator>
      </NavigationContainer>
    </GluestackUIProvider>
  );
}