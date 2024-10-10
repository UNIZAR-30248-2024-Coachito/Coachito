import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Dashboard: undefined;
  Routine: undefined;
  Profile: undefined;
  Exercises: undefined;
  AddExercise: undefined;
  AddRoutine: undefined;
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;
