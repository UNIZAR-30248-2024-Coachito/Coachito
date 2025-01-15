/* eslint-disable @typescript-eslint/no-require-imports */
import React from 'react';
import { render } from '@testing-library/react-native';
import MainTabs from '@/components/tabs/MainTabs';
import { useUserInfo } from '@/context/UserContext';
import { NavigationContainer } from '@react-navigation/native';

jest.mock('../../../screens/Dashboard', () => {
  const { Text } = require('react-native');
  const Dashboard = () => <Text>Dashboard</Text>;
  Dashboard.displayName = 'Dashboard';
  return Dashboard;
});

jest.mock('../../../screens/Routine', () => {
  const { Text } = require('react-native');
  const Routine = () => <Text>Routine</Text>;
  Routine.displayName = 'Routine';
  return Routine;
});

jest.mock('../../../screens/Profile', () => {
  const { Text } = require('react-native');
  const Profile = () => <Text>Profile</Text>;
  Profile.displayName = 'Profile';
  return Profile;
});

jest.mock('../../../screens/DetailsWorkout', () => {
  const { Text } = require('react-native');
  const DetailsWorkout = () => <Text>DetailsWorkout</Text>;
  DetailsWorkout.displayName = 'DetailsWorkout';
  return DetailsWorkout;
});

jest.mock('../../../screens/DetailsRoutine', () => {
  const { Text } = require('react-native');
  const DetailsRoutine = () => <Text>DetailsRoutine</Text>;
  DetailsRoutine.displayName = 'DetailsRoutine';
  return DetailsRoutine;
});

jest.mock('../../../screens/AddExercise', () => {
  const { Text } = require('react-native');
  const AddExercise = () => <Text>AddExercise</Text>;
  AddExercise.displayName = 'AddExercise';
  return AddExercise;
});

jest.mock('../../../screens/AddRoutine', () => {
  const { Text } = require('react-native');
  const AddRoutine = () => <Text>AddRoutine</Text>;
  AddRoutine.displayName = 'AddRoutine';
  return AddRoutine;
});

jest.mock('../../../screens/EditRoutine', () => {
  const { Text } = require('react-native');
  const EditRoutine = () => <Text>EditRoutine</Text>;
  EditRoutine.displayName = 'EditRoutine';
  return EditRoutine;
});

jest.mock('../../../screens/AddExerciseEdit', () => {
  const { Text } = require('react-native');
  const AddExerciseEdit = () => <Text>AddExerciseEdit</Text>;
  AddExerciseEdit.displayName = 'AddExerciseEdit';
  return AddExerciseEdit;
});

jest.mock('../../../screens/StartWorkout', () => {
  const { Text } = require('react-native');
  const StartWorkout = () => <Text>StartWorkout</Text>;
  StartWorkout.displayName = 'StartWorkout';
  return StartWorkout;
});

jest.mock('../../../screens/DetailsExercise', () => {
  const { Text } = require('react-native');
  const DetailsExercise = () => <Text>DetailsExercise</Text>;
  DetailsExercise.displayName = 'DetailsExercise';
  return DetailsExercise;
});

jest.mock('../../../screens/AddExerciseWhileWorkout', () => {
  const { Text } = require('react-native');
  const AddExerciseWhileWorkout = () => <Text>AddExerciseWhileWorkout</Text>;
  AddExerciseWhileWorkout.displayName = 'AddExerciseWhileWorkout';
  return AddExerciseWhileWorkout;
});

jest.mock('../../../screens/LogIn', () => {
  const { Text } = require('react-native');
  const LogIn = () => <Text>LogIn</Text>;
  LogIn.displayName = 'LogIn';
  return LogIn;
});

jest.mock('@/components/shared/Template', () => {
  const Children = ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  );

  return Children;
});

jest.mock('@/context/UserContext', () => ({
  useUserInfo: jest.fn(),
}));

describe('MainTabs', () => {
  const renderWithNavigation = () =>
    render(
      <NavigationContainer>
        <MainTabs />
      </NavigationContainer>
    );

  it('debe mostrar las pantallas protegidas cuando hay sesión activa', () => {
    (useUserInfo as jest.Mock).mockReturnValue({
      session: { user: { id: 'test-user-id' } },
    });

    const { getByText } = renderWithNavigation();

    expect(getByText('Dashboard')).toBeTruthy();
  });

  it('debe mostrar la pantalla de login cuando no hay sesión activa', () => {
    (useUserInfo as jest.Mock).mockReturnValue({
      session: null,
    });

    const { getByText } = renderWithNavigation();

    expect(getByText('LogIn')).toBeTruthy();
  });
});
