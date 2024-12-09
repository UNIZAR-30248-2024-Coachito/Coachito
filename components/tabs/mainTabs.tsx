import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from '@/types/navigation';
import Dashboard from '../../screens/Dashboard';
import Routine from '../../screens/Routine';
import Profile from '../../screens/Profile';
import DetailsWorkout from '../../screens/DetailsWorkout';
import Template from '@/components/shared/Template';
import DetailsRoutine from '../../screens/DetailsRoutine';
import AddExercise from '../../screens/AddExercise';
import AddRoutine from '../../screens/AddRoutine';
import EditRoutine from '../../screens/EditRoutine';
import AddExerciseEdit from '../../screens/AddExerciseEdit';
import StartWorkout from '../../screens/StartWorkout';
import DetailsExercise from '../../screens/DetailsExercise';
import LogIn from '../../screens/LogIn';
import { Box } from '@/components/ui/box';
import { useUserInfo } from '@/context/UserContext';

const Tab = createBottomTabNavigator<RootStackParamList>();

const MainTabs: React.FC = () => {
  const { session } = useUserInfo();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
    >
      {session ? (
        <>
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
        </>
      ) : (
        <Tab.Screen name="Login">
          {() => (
            <Box className="flex-1 bg-white dark:bg-black">
              <Box className="flex-1">
                <LogIn />
              </Box>
            </Box>
          )}
        </Tab.Screen>
      )}
    </Tab.Navigator>
  );
};

export default MainTabs;
