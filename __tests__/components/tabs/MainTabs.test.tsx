/* eslint-disable @typescript-eslint/no-require-imports */
import React from 'react';
import { render } from '@testing-library/react-native';
import MainTabs from '@/components/tabs/MainTabs';

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

jest.mock('@/components/ui/gluestack-ui-provider', () => ({
  GluestackUIProvider: ({ children }: { children: React.ReactNode }) =>
    children,
}));

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    NavigationContainer: ({ children }: { children: React.ReactNode }) =>
      children,
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  };
});

jest.mock('@react-navigation/bottom-tabs', () => {
  return {
    createBottomTabNavigator: jest.fn().mockReturnValue({
      Navigator: ({ children }: { children: React.ReactNode }) => (
        <>{children}</>
      ),
      Screen: ({
        children,
      }: {
        name: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        children: React.ReactNode | ((props: any) => React.ReactNode);
      }) => {
        if (typeof children === 'function') {
          return <>{children({})}</>;
        }
        return <>{children}</>;
      },
    }),
  };
});

jest.mock('@/components/shared/Template', () => {
  const Children = ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  );

  return Children;
});

jest.mock('@/utils/emitter', () => ({
  emitter: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => {
  return {
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
    mergeItem: jest.fn(),
    clear: jest.fn(),
    getAllKeys: jest.fn(),
    multiGet: jest.fn(),
    multiSet: jest.fn(),
    multiRemove: jest.fn(),
    multiMerge: jest.fn(),
  };
});

describe('MainTabs', () => {
  it('debe mostrar la pantalla de inicio de sesión por defecto', () => {
    const { getByText } = render(<MainTabs />);

    expect(getByText('Inicio de sesión')).toBeTruthy();
  });
});
