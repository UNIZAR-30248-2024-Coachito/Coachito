import { ExerciseListResume } from '@/screens/AddExercise';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Dashboard: undefined;
  Routine: undefined;
  Profile: undefined;
  Exercises: undefined;
  AddExercise: { selectedExercises: ExerciseListResume[] };
  AddRoutine: { exercises: ExerciseListResume[] };
  ExerciseResume: undefined;
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;
