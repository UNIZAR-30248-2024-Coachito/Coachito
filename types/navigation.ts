import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { WorkoutCardResume } from '@/components/workout/WorkoutCardResume';

export type RootStackParamList = {
  Dashboard: undefined;
  Routine: undefined;
  Profile: undefined;
  Exercises: undefined;
  AddExercise: undefined;
  AddRoutine: undefined;
  VerEntrenamiento: { workout: WorkoutCardResume };
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;
