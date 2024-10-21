import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Dashboard: undefined;
  Routine: undefined;
  DetailsRoutine: { templateId: number; myRoutineName: string };
  Profile: undefined;
  Exercises: undefined;
  AddExercise: undefined;
  AddRoutine: undefined;
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;
